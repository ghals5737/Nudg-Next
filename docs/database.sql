-- ============================================================
-- Nudg Database Schema (PostgreSQL)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Extensions
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()


-- ────────────────────────────────────────────────────────────
-- ENUM types
-- ────────────────────────────────────────────────────────────
CREATE TYPE theme_enum     AS ENUM ('light', 'dark', 'system');
CREATE TYPE task_status    AS ENUM ('pending', 'active', 'completed', 'snoozed');
CREATE TYPE task_tag       AS ENUM ('업무', '개인', '심부름', '학습');


-- ============================================================
-- 1. users
-- 사용자 계정 및 앱 설정을 함께 저장.
-- 설정 항목이 많지 않아 별도 테이블로 분리하지 않음.
-- ============================================================
CREATE TABLE users (
    id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name                  TEXT        NOT NULL,
    email                 TEXT        NOT NULL UNIQUE,
    password_hash         TEXT        NOT NULL,
    avatar_url            TEXT,

    -- App settings (settings 페이지)
    timezone              TEXT        NOT NULL DEFAULT 'Asia/Seoul',
    language              TEXT        NOT NULL DEFAULT 'ko',
    theme                 theme_enum  NOT NULL DEFAULT 'light',
    notifications_enabled BOOLEAN     NOT NULL DEFAULT TRUE,

    created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 로그인 속도를 위한 인덱스 (email lookup)
CREATE INDEX idx_users_email ON users (email);


-- ============================================================
-- 2. refresh_tokens
-- JWT Refresh Token 관리 (로그아웃 시 무효화).
-- Access Token은 짧은 TTL로 stateless 처리, Refresh Token만 DB 저장.
-- ============================================================
CREATE TABLE refresh_tokens (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash TEXT        NOT NULL UNIQUE,   -- bcrypt hash of the raw token
    expires_at TIMESTAMPTZ NOT NULL,
    revoked    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);


-- ============================================================
-- 3. goals
-- 장기 목표. UI 표현용 색상/아이콘 값 포함.
-- progress는 서버가 steps 완료율로 자동 계산하거나 수동 입력 가능.
-- ============================================================
CREATE TABLE goals (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title          TEXT        NOT NULL,
    subtitle       TEXT,
    icon           TEXT        NOT NULL DEFAULT 'star',
    icon_bg        TEXT        NOT NULL DEFAULT '#cce8e4',
    icon_color     TEXT        NOT NULL DEFAULT '#3d5653',
    progress_color TEXT        NOT NULL DEFAULT '#006b64',
    progress       SMALLINT    NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_goals_user_id ON goals (user_id);


-- ============================================================
-- 4. goal_steps
-- 목표에 속한 실행 스텝. 순서(order_idx)로 UI 정렬.
-- ============================================================
CREATE TABLE goal_steps (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id    UUID        NOT NULL REFERENCES goals (id) ON DELETE CASCADE,
    label      TEXT        NOT NULL,
    done       BOOLEAN     NOT NULL DEFAULT FALSE,
    order_idx  SMALLINT    NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_goal_steps_goal_id ON goal_steps (goal_id);


-- ============================================================
-- 5. routines
-- 일일 반복 습관. days 배열은 월~일 7개 boolean.
-- PostgreSQL BOOLEAN[] 사용; 길이 7로 제약.
-- ============================================================
CREATE TABLE routines (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title             TEXT        NOT NULL,
    icon              TEXT        NOT NULL DEFAULT 'check_circle',
    icon_bg           TEXT        NOT NULL DEFAULT '#cce8e4',
    duration          SMALLINT    NOT NULL CHECK (duration > 0),  -- 분 단위
    scheduled_time    TIME        NOT NULL,                        -- "07:00"
    days              BOOLEAN[7]  NOT NULL,                        -- 월(0)~일(6)
    active            BOOLEAN     NOT NULL DEFAULT TRUE,
    smart_reminders   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_routines_user_id ON routines (user_id);


-- ============================================================
-- 6. routine_logs
-- 루틴 실제 완료 기록. (routineId, date) 유니크.
-- 리듬 계산 및 성공률 산출에 사용.
-- ============================================================
CREATE TABLE routine_logs (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    routine_id UUID        NOT NULL REFERENCES routines (id) ON DELETE CASCADE,
    user_id    UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    log_date   DATE        NOT NULL,
    completed  BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (routine_id, log_date)
);

CREATE INDEX idx_routine_logs_routine_id_date ON routine_logs (routine_id, log_date DESC);
CREATE INDEX idx_routine_logs_user_id_date    ON routine_logs (user_id, log_date DESC);


-- ============================================================
-- 7. schedule_blocks
-- 플래너 타임블록. start_time/end_time은 24시간 소수 표기
-- (예: 9.5 = 09:30, 10.5 = 10:30).
-- ============================================================
CREATE TABLE schedule_blocks (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title        TEXT        NOT NULL,
    block_date   DATE        NOT NULL,
    start_time   NUMERIC(4,2) NOT NULL CHECK (start_time >= 0 AND start_time < 24),
    end_time     NUMERIC(4,2) NOT NULL CHECK (end_time > start_time),
    duration     NUMERIC(4,2) NOT NULL CHECK (duration > 0),  -- 시간 단위
    location     TEXT,
    tag          task_tag,
    status       task_status NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_schedule_blocks_user_date ON schedule_blocks (user_id, block_date);


-- ============================================================
-- 8. cbt_entries
-- 감정 기록 (CBT). mood 색상은 UI 렌더링용으로 DB에 함께 저장.
-- ============================================================
CREATE TABLE cbt_entries (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    emoji      TEXT        NOT NULL,
    mood       TEXT        NOT NULL,
    mood_bg    TEXT        NOT NULL DEFAULT '#cce8e4',
    mood_text  TEXT        NOT NULL DEFAULT '#3d5653',
    content    TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cbt_entries_user_id_created ON cbt_entries (user_id, created_at DESC);


-- ============================================================
-- 9. cbt_entry_tags
-- CBT 기록에 붙는 태그. 정규화 저장 (배열 컬럼 대신).
-- ============================================================
CREATE TABLE cbt_entry_tags (
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID NOT NULL REFERENCES cbt_entries (id) ON DELETE CASCADE,
    tag      TEXT NOT NULL,

    UNIQUE (entry_id, tag)
);

CREATE INDEX idx_cbt_entry_tags_entry_id ON cbt_entry_tags (entry_id);


-- ============================================================
-- Trigger: updated_at 자동 갱신
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 각 테이블에 트리거 적용
DO $$
DECLARE
    t TEXT;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'users', 'goals', 'goal_steps',
        'routines', 'schedule_blocks', 'cbt_entries'
    ]
    LOOP
        EXECUTE format(
            'CREATE TRIGGER trg_%I_updated_at
             BEFORE UPDATE ON %I
             FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
            t, t
        );
    END LOOP;
END;
$$;


-- ============================================================
-- ERD 요약 (텍스트)
-- ============================================================
--
--  users
--   ├── refresh_tokens    (1:N)
--   ├── goals             (1:N)
--   │    └── goal_steps   (1:N)
--   ├── routines          (1:N)
--   │    └── routine_logs (1:N)
--   ├── schedule_blocks   (1:N)
--   └── cbt_entries       (1:N)
--        └── cbt_entry_tags (1:N)
--
