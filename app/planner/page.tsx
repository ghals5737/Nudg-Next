"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { NewScheduleDialog } from "@/components/new-schedule-dialog"
import { Button } from "@/components/ui/button"
import { Plus, ChevronLeft, ChevronRight, Clock, Calendar, Copy, FileText } from "lucide-react"
import { useState } from "react"

// Sample tasks for demonstration
const sampleTasks = [
  {
    id: 1,
    title: "프로젝트 기획서 작성",
    startTime: 10,
    endTime: 11.5,
    duration: 1.5,
    color: "#7986CB", // blue
  },
]

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks] = useState(sampleTasks)
  const [showNewScheduleDialog, setShowNewScheduleDialog] = useState(false)

  // 08:00부터 17:00까지 시간 슬롯
  const hours = Array.from({ length: 10 }, (_, i) => i + 8)
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTimePosition = ((currentHour - 8) * 60 + currentMinute) / 60 // 8시 기준으로 시간 위치 계산

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(date)
    return `${month}월 ${day}일 (${weekday})`
  }

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = () => {
    const today = new Date()
    return (
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AppSidebar />

      <main className="flex-1 ml-[260px]">
        <div className="flex h-full">
          {/* 중앙 플래너 영역 */}
          <div className="flex-1 bg-white">
            <div className="px-10 py-8">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold text-[#1A1B1E]">플래너</h1>
                  <Calendar className="h-4 w-4 text-[#868E96]" />
                  <span className="text-sm text-[#868E96]">{formatDate(currentDate)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowNewScheduleDialog(true)}
                    className="bg-[#4DB6AC] hover:bg-[#3AA996] text-white h-9 px-4 rounded-lg font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    새 블록
                  </Button>
                  <div className="flex items-center gap-2 text-[#1A1B1E]">
                    <button
                      onClick={goToPreviousDay}
                      className="p-1 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToToday}
                      className="px-3 py-1 text-sm hover:bg-[#F8F9FA] rounded-lg transition-colors"
                    >
                      오늘
                    </button>
                    <button
                      onClick={goToNextDay}
                      className="p-1 hover:bg-[#F8F9FA] rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Timeline View */}
              <div className="relative">
                {/* Current time indicator - 오늘일 때만 표시 */}
                {isToday() && currentHour >= 8 && currentHour <= 17 && (
                  <div
                    className="absolute left-0 right-0 z-10 flex items-center"
                    style={{ top: `${(currentTimePosition / 10) * 100}%` }}
                  >
                    <div className="h-0.5 flex-1 bg-[#4DB6AC]" />
                    <div className="flex h-3 w-3 items-center justify-center rounded-full bg-[#4DB6AC]">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                )}

                {/* Hour grid */}
                <div className="space-y-0 border-l border-[#E9ECEF]">
                  {hours.map((hour) => {
                    const tasksAtThisHour = tasks.filter(
                      (task) => hour >= task.startTime && hour < task.endTime,
                    )

                    return (
                      <div
                        key={hour}
                        className="relative flex border-b border-[#E9ECEF]"
                        style={{ minHeight: "80px" }}
                      >
                        {/* Hour label */}
                        <div className="flex w-20 flex-shrink-0 items-start justify-end pr-4 pt-2">
                          <span className="text-sm font-medium text-[#868E96]">
                            {hour.toString().padStart(2, "0")}:00
                          </span>
                        </div>

                        {/* Task area */}
                        <div className="relative flex-1 py-2">
                          {tasksAtThisHour.map((task) => {
                            // Only render the task card at its start hour
                            if (hour === Math.floor(task.startTime)) {
                              const startOffset = (task.startTime - hour) * 80 // 시간당 80px
                              const heightInPixels = task.duration * 80
                              return (
                                <div
                                  key={task.id}
                                  className="absolute left-2 right-2 cursor-pointer rounded-lg bg-white border-l-4 p-3 transition-all hover:shadow-md"
                                  style={{
                                    height: `${heightInPixels}px`,
                                    top: `${startOffset}px`,
                                    borderLeftColor: task.color,
                                  }}
                                >
                                  <h3 className="font-medium text-[#343A40] text-sm">{task.title}</h3>
                                  <p className="mt-1 text-xs text-[#868E96]">
                                    {Math.floor(task.startTime)
                                      .toString()
                                      .padStart(2, "0")}:{task.startTime % 1 === 0 ? "00" : "30"} -{" "}
                                    {Math.floor(task.endTime)
                                      .toString()
                                      .padStart(2, "0")}:{task.endTime % 1 === 0 ? "00" : "30"} •{" "}
                                    {task.duration === 1.5 ? "1h 30m" : `${task.duration}h`}
                                  </p>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 빠른 액션 패널 */}
          <div className="w-64 bg-white border-l border-[#E9ECEF] p-6">
            <h2 className="text-sm font-semibold text-[#1A1B1E] mb-4">빠른 액션</h2>
            <div className="space-y-2">
              <button
                onClick={() => setShowNewScheduleDialog(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F8F9FA] transition-colors text-left"
              >
                <Plus className="h-4 w-4 text-[#868E96]" />
                <span className="text-sm text-[#343A40]">새 블록 추가</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F8F9FA] transition-colors text-left">
                <Copy className="h-4 w-4 text-[#868E96]" />
                <span className="text-sm text-[#343A40]">어제 일정 복사</span>
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#F8F9FA] transition-colors text-left">
                <FileText className="h-4 w-4 text-[#868E96]" />
                <span className="text-sm text-[#343A40]">템플릿 적용</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />

      {/* New schedule dialog */}
      <NewScheduleDialog open={showNewScheduleDialog} onOpenChange={setShowNewScheduleDialog} />
    </div>
  )
}
