"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Clock, BarChart3, ChevronDown, ChevronDown as ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import { NewGoalDialog } from "@/components/new-goal-dialog"

type Goal = {
  id: number
  title: string
  tags: string[]
  progress: number
  completedSteps: number
  totalSteps: number
  totalTime: string
  color: "blue" | "green" | "orange"
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
  },
  {
    id: 3,
    title: "영어 공부",
    tags: ["학습", "장기"],
    progress: 25,
    completedSteps: 1,
    totalSteps: 4,
    totalTime: "",
    color: "orange",
  },
]

function getColorClass(color: string) {
  switch (color) {
    case "blue":
      return "#7986CB"
    case "green":
      return "#4DB6AC"
    case "orange":
      return "#FF8A65"
    default:
      return "#90A4AE"
  }
}

export default function GoalsPage() {
  const [goals] = useState<Goal[]>(sampleGoals)
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active")
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)

  const totalGoals = goals.length
  const completedGoals = goals.filter((g) => g.progress === 100).length
  const inProgressGoals = goals.filter((g) => g.progress > 0 && g.progress < 100).length
  const averageProgress = Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AppSidebar />

      <main className="flex-1 ml-[260px]">
        <div className="px-10 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-[#1A1B1E]">목표 & 스텝</h1>
              <p className="text-sm text-[#868E96]">큰 목표를 작은 스텝으로 나누어 관리하세요</p>
            </div>
            <Button
              onClick={() => setShowNewGoalDialog(true)}
              className="bg-[#4DB6AC] hover:bg-[#3AA996] text-white h-9 px-4 rounded-lg font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              새 목표
            </Button>
          </div>

          {/* Statistics */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6">
              <p className="mb-1 text-sm text-[#868E96]">전체 목표</p>
              <p className="text-3xl font-bold text-[#1A1B1E]">{totalGoals}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6">
              <p className="mb-1 text-sm text-[#868E96]">완료</p>
              <p className="text-3xl font-bold text-[#4DB6AC]">{completedGoals}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-[#868E96]">진행 중</p>
                <p className="text-3xl font-bold text-[#1A1B1E]">{inProgressGoals}</p>
              </div>
              <Clock className="h-5 w-5 text-[#868E96]" />
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-[#868E96]">평균 진행률</p>
                <p className="text-3xl font-bold text-[#1A1B1E]">{averageProgress}%</p>
              </div>
              <BarChart3 className="h-5 w-5 text-[#868E96]" />
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "active"
                    ? "bg-[#4DB6AC] text-white shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                    : "bg-white text-[#868E96] hover:bg-[#F8F9FA]"
                }`}
              >
                활성 목표
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "archived"
                    ? "bg-[#4DB6AC] text-white shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                    : "bg-white text-[#868E96] hover:bg-[#F8F9FA]"
                }`}
              >
                보관함
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-[#868E96]">정렬:</span>
              <Select defaultValue="recent">
                <SelectTrigger className="w-[140px] bg-white border-[#E9ECEF] text-[#343A40]">
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

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 border-l-4"
                style={{ borderLeftColor: getColorClass(goal.color) }}
              >
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: getColorClass(goal.color) }}
                    />
                    <h2 className="text-lg font-semibold text-[#343A40]">{goal.title}</h2>
                  </div>
                  <div className="flex gap-2">
                    {goal.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs text-[#868E96] bg-[#F1F3F5] rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-[#343A40]">
                      {goal.completedSteps} / {goal.totalSteps} 스텝 완료
                    </span>
                    <span className="font-medium text-[#343A40]">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#F1F3F5] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${goal.progress}%`,
                        backgroundColor: getColorClass(goal.color),
                      }}
                    />
                  </div>
                </div>

                {/* Time and View Steps */}
                <div className="flex items-center justify-between">
                  {goal.totalTime && (
                    <div className="flex items-center gap-2 text-sm text-[#868E96]">
                      <Clock className="h-4 w-4" />
                      <span>{goal.totalTime}</span>
                    </div>
                  )}
                  <button className="flex items-center gap-1 text-sm text-[#4DB6AC] hover:text-[#3AA996] transition-colors">
                    <span>스텝 보기</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MobileNav />
      <NewGoalDialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog} />
    </div>
  )
}
