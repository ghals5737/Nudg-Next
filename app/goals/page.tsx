"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, BarChart3, ChevronDown, MoreVertical, Calendar, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { NewGoalDialog } from "@/components/new-goal-dialog"

type Step = {
  id: number
  title: string
  duration: string
  completed: boolean
  parentId?: number // For nested steps
}

type Goal = {
  id: number
  title: string
  tags: string[]
  progress: number
  completedSteps: number
  totalSteps: number
  totalTime: string
  color: "blue" | "green" | "yellow"
  steps: Step[]
}

const sampleGoals: Goal[] = [
  {
    id: 1,
    title: "프로젝트 완성하기",
    tags: ["업무", "중요"],
    progress: 33,
    completedSteps: 1,
    totalSteps: 6,
    totalTime: "10시간 15분",
    color: "blue",
    steps: [
      { id: 1, title: "기획서 작성", duration: "1시간 30분", completed: false },
      { id: 2, title: "요구사항 정리", duration: "30분", completed: true, parentId: 1 },
      { id: 3, title: "일정 계획", duration: "45분", completed: false },
      { id: 4, title: "개발 시작", duration: "4시간", completed: false },
      { id: 5, title: "UI 컴포넌트", duration: "2시간", completed: false, parentId: 4 },
      { id: 6, title: "API 연동", duration: "1시간 30분", completed: false },
    ],
  },
  {
    id: 2,
    title: "건강 관리",
    tags: ["개인", "루틴"],
    progress: 67,
    completedSteps: 2,
    totalSteps: 3,
    totalTime: "45분",
    color: "green",
    steps: [
      { id: 1, title: "아침 운동", duration: "30분", completed: true },
      { id: 2, title: "물 마시기", duration: "5분", completed: true },
      { id: 3, title: "명상", duration: "10분", completed: false },
    ],
  },
  {
    id: 3,
    title: "영어 공부",
    tags: ["학습", "장기"],
    progress: 25,
    completedSteps: 1,
    totalSteps: 4,
    totalTime: "1시간 45분",
    color: "yellow",
    steps: [
      { id: 1, title: "단어 암기", duration: "30분", completed: true },
      { id: 2, title: "문법 학습", duration: "45분", completed: false },
      { id: 3, title: "듣기 연습", duration: "20분", completed: false },
      { id: 4, title: "말하기 연습", duration: "10분", completed: false },
    ],
  },
]

export default function GoalsPage() {
  const [goals] = useState<Goal[]>(sampleGoals)
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")
  const [expandedGoals, setExpandedGoals] = useState<number[]>([])
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)

  const toggleExpanded = (goalId: number) => {
    setExpandedGoals((prev) => (prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]))
  }

  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => g.progress === 100).length
  const inProgressGoals = goals.filter((g) => g.progress > 0 && g.progress < 100).length
  const averageProgress = Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <main className="flex-1 md:ml-[200px]">
        <div className="mx-auto max-w-7xl p-6 pb-24 md:pb-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-text">목표 & 스텝</h1>
              <p className="text-sm text-text-sub">큰 목표를 작은 스텝으로 나누어 관리하세요</p>
            </div>
            <Button onClick={() => setShowNewGoalDialog(true)} className="bg-brand hover:bg-brand-strong">
              <Plus className="mr-2 h-4 w-4" />새 목표
            </Button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="bg-card p-4">
              <p className="mb-1 text-sm text-text-sub">전체 목표</p>
              <p className="text-3xl font-bold text-text">{totalGoals}</p>
            </Card>

            <Card className="bg-card p-4">
              <p className="mb-1 text-sm text-text-sub">완료</p>
              <p className="text-3xl font-bold text-success">{completedGoals}</p>
            </Card>

            <Card className="bg-card p-4 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-text-sub">진행 중</p>
                <p className="text-3xl font-bold text-text">{inProgressGoals}</p>
              </div>
              <Clock className="h-5 w-5 text-text-sub" />
            </Card>

            <Card className="bg-card p-4 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-text-sub">평균 진행률</p>
                <p className="text-3xl font-bold text-text">{averageProgress}%</p>
              </div>
              <BarChart3 className="h-5 w-5 text-text-sub" />
            </Card>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "active" ? "default" : "ghost"}
                onClick={() => setActiveTab("active")}
                className={activeTab === "active" ? "bg-brand hover:bg-brand-strong" : ""}
              >
                활성 목표
              </Button>
              <Button
                variant={activeTab === "archived" ? "default" : "ghost"}
                onClick={() => setActiveTab("archived")}
                className={activeTab === "archived" ? "bg-brand hover:bg-brand-strong" : ""}
              >
                보관함
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-text-sub">정렬:</span>
              <Select defaultValue="recent">
                <SelectTrigger className="w-[140px] bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">최근 생성순</SelectItem>
                  <SelectItem value="progress">진행률순</SelectItem>
                  <SelectItem value="name">이름순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <Card
                key={goal.id}
                className={`bg-card p-5 border-l-4 ${
                  goal.color === "blue"
                    ? "border-l-brand"
                    : goal.color === "green"
                      ? "border-l-success"
                      : "border-l-warn"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          goal.color === "blue" ? "bg-brand" : goal.color === "green" ? "bg-success" : "bg-warn"
                        }`}
                      />
                      <h2 className="text-lg font-semibold text-text">{goal.title}</h2>
                    </div>
                    <div className="flex gap-2">
                      {goal.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-background text-text-sub">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>수정</DropdownMenuItem>
                      <DropdownMenuItem>보관</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">삭제</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-text-sub">
                      {goal.completedSteps} / {goal.totalSteps} 스텝 완료
                    </span>
                    <span className="font-medium text-text">{goal.progress}%</span>
                  </div>
                  <Progress
                    value={goal.progress}
                    className={`h-2 ${
                      goal.color === "blue"
                        ? "[&>div]:bg-brand"
                        : goal.color === "green"
                          ? "[&>div]:bg-success"
                          : "[&>div]:bg-warn"
                    }`}
                  />
                </div>

                {/* Time */}
                <div className="mb-4 flex items-center gap-2 text-sm text-text-sub">
                  <Clock className="h-4 w-4" />
                  <span>{goal.totalTime}</span>
                </div>

                <div>
                  <button
                    onClick={() => toggleExpanded(goal.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-accent"
                  >
                    <span>스텝 보기</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedGoals.includes(goal.id) ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expandedGoals.includes(goal.id) && (
                    <div className="mt-3 space-y-1 rounded-lg border border-border bg-background p-3">
                      {goal.steps.map((step) => (
                        <div
                          key={step.id}
                          className={`flex items-center gap-2 rounded py-2 px-2 hover:bg-accent transition-colors ${
                            step.parentId ? "ml-8" : ""
                          }`}
                        >
                          <Checkbox
                            checked={step.completed}
                            className={`h-4 w-4 ${step.completed ? "data-[state=checked]:bg-brand data-[state=checked]:border-brand" : ""}`}
                          />
                          <span
                            className={`flex-1 text-sm ${step.completed ? "text-text-sub line-through" : "text-text"}`}
                          >
                            {step.title}
                          </span>
                          <span className="text-xs text-text-sub">{step.duration}</span>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-accent-strong">
                              <Calendar className="h-3.5 w-3.5 text-text-sub" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-accent-strong">
                              <Pencil className="h-3.5 w-3.5 text-text-sub" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-accent-strong">
                              <Trash2 className="h-3.5 w-3.5 text-text-sub" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-4 py-2 text-sm text-text-sub transition-colors hover:bg-accent hover:text-text mt-2">
                        <Plus className="h-4 w-4" />
                        <span>스텝 추가</span>
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
      <NewGoalDialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog} />
    </div>
  )
}
