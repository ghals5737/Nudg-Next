# Nudg

ADHD 친화적 시간 관리 앱. 하루 계획, 루틴 추적, 목표 관리, CBT 감정 기록을 하나의 앱에서 관리합니다.

## 주요 기능

- **홈 대시보드** — 오늘의 계획, 루틴, CBT 기록 요약 및 타이머 시작
- **플래너** — 시간 블록 기반 일정 관리 및 15분 단위 미루기
- **루틴** — 반복 작업 등록, 요일별 스케줄, 최근 7일 성공률 추적
- **목표 & 스텝** — 큰 목표를 작은 스텝으로 분해하고 진행률 관리
- **CBT 기록** — 감정/충동 기록, 대처법 저장, 타임라인/목록 뷰

## 기술 스택

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Radix UI** (shadcn/ui 기반 컴포넌트)
- **Lucide React** 아이콘

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

## 프로젝트 구조

```
app/
  page.tsx          # 홈 대시보드
  planner/          # 플래너
  routines/         # 루틴 관리
  goals/            # 목표 & 스텝
  cbt/              # CBT 기록
  settings/         # 설정
components/
  app-sidebar.tsx   # 사이드바 네비게이션
  mobile-nav.tsx    # 모바일 하단 네비게이션
  active-timer-bar  # 작업 타이머 바
  ...               # 각 페이지별 다이얼로그 컴포넌트
```

## 디자인 시스템

`design.json` 에 색상, 타이포그래피, 컴포넌트 스타일이 정의되어 있습니다.
브랜드 컬러는 Teal(`#4DB6AC`) 계열이며 Clean, Soft-Focus, Pastel-Utility 스타일을 지향합니다.
