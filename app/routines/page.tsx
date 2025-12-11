"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Check, MoreVertical, Calendar, Clock, Bell } from "lucide-react"
import { useState } from "react"
import { NewRoutineDialog } from "@/components/new-routine-dialog"

type Routine = {
  id: number
  title: string
  duration: number
  time: string
  days: string[]
  notificationType: string
  notificationMessage: string
  emoji: string
  weeklyProgress: number[]
  active: boolean
  timeUntil?: string
}

const sampleRoutines: Routine[] = [
  {
    id: 1,
    title: "아침 운동",
    duration: 30,
    time: "07:00",
    days: ["매일", "월", "화", "수", "목", "금"],
    notificationType: "보통 알림",
    notificationMessage: "운동할 시간이에요!",
    emoji: "🤙",
    weeklyProgress: [1, 1, 1, 1, 1, 0, 1], // 6/7 = 86%
    active: true,
    timeUntil: "지금",
  },
  {
    id: 2,
    title: "독서 시간",
    duration: 20,
    time: "19:00",
    days: ["매일", "일", "월", "화", "수", "목", "금", "토"],
    notificationType: "부드러운 알림",
    notificationMessage: "책 읽을 시간이에요",
    emoji: "📚",
    weeklyProgress: [1, 1, 1, 0, 0, 1, 0], // 4/7 = 57%
    active: true,
    timeUntil: "7시간 7분 후",
  },
  {
    id: 3,
    title: "명상",
    duration: 10,
    time: "21:30",
    days: ["매일", "일", "월", "화", "수", "목", "금", "토"],
    notificationType: "",
    notificationMessage: "",
    emoji: "",
    weeklyProgress: [1, 1, 1, 1, 0, 1, 0], // 5/7 = 71%
    active: true,
    timeUntil: "9시간 37분 후",
  },
]

const inactiveRoutines: Routine[] = []

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>(sampleRoutines)
  const [inactive, setInactive] = useState<Routine[]>(inactiveRoutines)
  const [showNewRoutineDialog, setShowNewRoutineDialog] = useState(false)

  const calculateSuccessRate = (progress: number[]) => {
    const completed = progress.filter((p) => p === 1).length
    return Math.round((completed / progress.length) * 100)
  }

  const formatDays = (days: string[]) => {
    if (days[0] === "매일") {
      return `매일·${days.slice(1).join(", ")}`
    }
    return days.join(", ")
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AppSidebar />

      <main className="flex-1 ml-[260px]">
        <div className="px-10 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-[#1A1B1E]">루틴</h1>
              <p className="text-sm text-[#868E96]">반복 작업을 관리하고 습관을 만들어보세요</p>
            </div>
            <Button
              onClick={() => setShowNewRoutineDialog(true)}
              className="bg-[#4DB6AC] hover:bg-[#3AA996] text-white h-9 px-4 rounded-lg font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              새 루틴
            </Button>
          </div>

          {/* 활성 루틴 */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[#1A1B1E]">활성 루틴</h2>
            <div className="space-y-4">
              {routines.map((routine) => {
                const successRate = calculateSuccessRate(routine.weeklyProgress)
                return (
                  <div
                    key={routine.id}
                    className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6"
                  >
                    {/* Header with toggle and menu */}
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="text-base font-semibold text-[#343A40]">{routine.title}</h3>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={routine.active}
                          className="data-[state=checked]:bg-[#4DB6AC]"
                        />
                        <button className="p-1 hover:bg-[#F8F9FA] rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4 text-[#868E96]" />
                        </button>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="mb-2 flex items-center gap-2 text-sm text-[#868E96]">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDays(routine.days)}</span>
                    </div>

                    {/* Time */}
                    <div className="mb-2 flex items-center gap-2 text-sm text-[#868E96]">
                      <Clock className="h-4 w-4" />
                      <span>
                        {routine.time} · {routine.timeUntil}
                      </span>
                    </div>

                    {/* Notification */}
                    {routine.notificationType && (
                      <div className="mb-4 flex items-center gap-2 text-sm text-[#868E96]">
                        <Bell className="h-4 w-4" />
                        <span>
                          {routine.notificationType} · {routine.notificationMessage} {routine.emoji}
                        </span>
                      </div>
                    )}

                    {/* Weekly progress */}
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-[#868E96]">최근 7일</span>
                        <span className="font-medium text-[#4DB6AC]">{successRate}% 성공</span>
                      </div>
                      <div className="flex gap-1">
                        {routine.weeklyProgress.map((completed, index) => (
                          <div
                            key={index}
                            className={`h-2 flex-1 rounded ${
                              completed === 1 ? "bg-[#4DB6AC]" : "bg-[#E9ECEF]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <Button className="flex-1 bg-[#4DB6AC] hover:bg-[#3AA996] text-white h-10 rounded-lg font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)]">
                        <Check className="mr-2 h-4 w-4" />
                        ✓ 완료
                      </Button>
                      <button className="px-3 py-2 text-xs text-[#868E96] hover:text-[#343A40] hover:bg-[#F8F9FA] rounded-lg transition-colors">
                        <Clock className="inline h-3 w-3 mr-1" />
                        ① 15분 미루기
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 비활성 루틴 */}
          {inactive.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-[#1A1B1E]">비활성 루틴</h2>
              <div className="space-y-4">
                {inactive.map((routine) => {
                  const successRate = calculateSuccessRate(routine.weeklyProgress)
                  return (
                    <div
                      key={routine.id}
                      className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 opacity-60"
                    >
                      {/* Header with toggle and menu */}
                      <div className="mb-4 flex items-start justify-between">
                        <h3 className="text-base font-semibold text-[#343A40]">{routine.title}</h3>
                        <div className="flex items-center gap-3">
                          <Switch checked={routine.active} />
                          <button className="p-1 hover:bg-[#F8F9FA] rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4 text-[#868E96]" />
                          </button>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="mb-2 flex items-center gap-2 text-sm text-[#868E96]">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDays(routine.days)}</span>
                      </div>

                      {/* Time */}
                      <div className="mb-2 flex items-center gap-2 text-sm text-[#868E96]">
                        <Clock className="h-4 w-4" />
                        <span>{routine.time}</span>
                      </div>

                      {/* Weekly progress */}
                      <div>
                        <div className="mb-2 flex items-center justify-between text-xs">
                          <span className="text-[#868E96]">최근 7일</span>
                          <span className="font-medium text-[#868E96]">{successRate}% 성공</span>
                        </div>
                        <div className="flex gap-1">
                          {routine.weeklyProgress.map((completed, index) => (
                            <div
                              key={index}
                              className={`h-2 flex-1 rounded ${
                                completed === 1 ? "bg-[#4DB6AC]" : "bg-[#E9ECEF]"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <MobileNav />

      {/* New Routine Dialog */}
      <NewRoutineDialog open={showNewRoutineDialog} onOpenChange={setShowNewRoutineDialog} />
    </div>
  )
}
