// ──────────────────────────────────────────
// Shared domain types (frontend + server)
// ──────────────────────────────────────────

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  timezone: string
  language: string
  theme: "light" | "dark" | "system"
  notificationsEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface GoalStep {
  id: string
  label: string
  done: boolean
  order: number
}

export interface Goal {
  id: string
  userId: string
  title: string
  subtitle: string
  icon: string
  iconBg: string
  iconColor: string
  progressColor: string
  progress: number
  steps: GoalStep[]
  createdAt: string
  updatedAt: string
}

export interface Routine {
  id: string
  userId: string
  title: string
  icon: string
  iconBg: string
  duration: number
  time: string
  days: boolean[]
  active: boolean
  smartReminders: boolean
  createdAt: string
  updatedAt: string
}

export interface RoutineLog {
  id: string
  routineId: string
  userId: string
  date: string
  completed: boolean
}

export type TaskTag = "업무" | "개인" | "심부름" | "학습" | string
export type TaskStatus = "pending" | "active" | "completed" | "snoozed"

export interface ScheduleBlock {
  id: string
  userId: string
  title: string
  date: string
  startTime: number
  endTime: number
  duration: number
  location?: string
  tag?: TaskTag
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface CBTEntry {
  id: string
  userId: string
  emoji: string
  mood: string
  moodBg: string
  moodText: string
  content: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  notificationsEnabled: boolean
}

// ──────────────────────────────────────────
// API request / response shapes
// ──────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Auth
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// Goals
export interface CreateGoalRequest {
  title: string
  subtitle?: string
  icon?: string
  iconBg?: string
  iconColor?: string
  progressColor?: string
  steps?: string[]
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  progress?: number
}

export interface UpdateGoalStepRequest {
  done: boolean
}

// Routines
export interface CreateRoutineRequest {
  title: string
  icon?: string
  iconBg?: string
  duration: number
  time: string
  days: boolean[]
  smartReminders?: boolean
}

export interface UpdateRoutineRequest extends Partial<CreateRoutineRequest> {
  active?: boolean
}

export interface RoutineWithRhythm extends Routine {
  rhythm: boolean[]
  successRate: number
}

export interface RoutineRhythmResponse {
  routineId: string
  rhythm: { date: string; completed: boolean }[]
  successRate: number
}

export interface TodayRoutineItem {
  routine: Routine
  completed: boolean
}

export interface TodayRoutinesResponse {
  items: TodayRoutineItem[]
  progress: { completed: number; total: number }
}

// Schedule
export interface CreateScheduleBlockRequest {
  title: string
  date: string
  startTime: number
  endTime: number
  duration: number
  location?: string
  tag?: TaskTag
}

export interface UpdateScheduleBlockRequest extends Partial<CreateScheduleBlockRequest> {
  status?: TaskStatus
}

export interface SnoozeRequest {
  minutes: number
}

// CBT
export interface CreateCBTEntryRequest {
  emoji: string
  mood: string
  moodBg?: string
  moodText?: string
  content: string
  tags?: string[]
}

export interface UpdateCBTEntryRequest extends Partial<CreateCBTEntryRequest> {}

// Dashboard
export interface DashboardResponse {
  greeting: string
  date: string
  focusTask: ScheduleBlock | null
  todayTasks: ScheduleBlock[]
  todayRoutines: {
    routine: Routine
    completed: boolean
  }[]
  recentCBT: CBTEntry | null
  routineProgress: {
    completed: number
    total: number
  }
}
