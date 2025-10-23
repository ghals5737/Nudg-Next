"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { NewScheduleDialog } from "@/components/new-schedule-dialog"
import { GoalsTreeDialog } from "@/components/goals-tree-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, ChevronLeft, ChevronRight, Clock, Target } from "lucide-react"
import { useState } from "react"

// Sample tasks for demonstration
const sampleTasks = [
  {
    id: 1,
    title: "프로젝트 기획서 작성",
    startTime: 10,
    duration: 1.5,
    color: "brand",
  },
  {
    id: 2,
    title: "팀 미팅 준비",
    startTime: 14,
    duration: 1,
    color: "warn",
  },
  {
    id: 3,
    title: "코드 리뷰",
    startTime: 16,
    duration: 0.5,
    color: "success",
  },
]

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks] = useState(sampleTasks)
  const [showNewScheduleDialog, setShowNewScheduleDialog] = useState(false)
  const [showGoalsDialog, setShowGoalsDialog] = useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const currentHour = new Date().getHours()

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

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <main className="flex-1 md:ml-[200px]">
        <div className="mx-auto max-w-5xl p-6 pb-24 md:pb-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={goToPreviousDay} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-text">{formatDate(currentDate)}</h1>
                <Button
                  variant="link"
                  size="sm"
                  onClick={goToToday}
                  className="h-auto p-0 text-xs text-brand hover:text-brand-strong"
                >
                  오늘
                </Button>
              </div>
              <Button variant="ghost" size="icon" onClick={goToNextDay} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-grid-quarter bg-transparent"
                onClick={() => setShowGoalsDialog(true)}
              >
                <Target className="mr-2 h-4 w-4" />
                목표
              </Button>
              <Button onClick={() => setShowNewScheduleDialog(true)} className="bg-brand hover:bg-brand-strong">
                <Plus className="mr-2 h-4 w-4" />새 블록
              </Button>
            </div>
          </div>

          {/* Timeline View */}
          <div className="relative">
            {/* Current time indicator */}
            <div
              className="absolute left-0 right-0 z-10 flex items-center"
              style={{ top: `${(currentHour / 24) * 100}%` }}
            >
              <div className="h-0.5 flex-1 bg-brand" />
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                <Clock className="h-3 w-3" />
              </div>
            </div>

            {/* Hour grid */}
            <div className="space-y-0">
              {hours.map((hour) => {
                const tasksAtThisHour = tasks.filter(
                  (task) => hour >= task.startTime && hour < task.startTime + task.duration,
                )

                return (
                  <div key={hour} className="relative flex border-b border-grid-quarter" style={{ minHeight: "60px" }}>
                    {/* Hour label */}
                    <div className="flex w-16 flex-shrink-0 items-start justify-end pr-4 pt-1">
                      <span className="text-sm font-medium text-text-sub">{hour.toString().padStart(2, "0")}:00</span>
                    </div>

                    {/* Task area */}
                    <div className="relative flex-1 py-1">
                      {tasksAtThisHour.map((task) => {
                        // Only render the task card at its start hour
                        if (hour === task.startTime) {
                          const heightInPixels = task.duration * 60
                          return (
                            <Card
                              key={task.id}
                              className={`absolute left-2 right-2 cursor-pointer border-l-4 bg-card p-3 transition-all hover:shadow-lg ${
                                task.color === "brand"
                                  ? "border-l-brand"
                                  : task.color === "warn"
                                    ? "border-l-warn"
                                    : "border-l-success"
                              }`}
                              style={{
                                height: `${heightInPixels}px`,
                                top: "4px",
                              }}
                            >
                              <h3 className="font-medium text-card-foreground">{task.title}</h3>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {task.startTime.toString().padStart(2, "0")}:00 -{" "}
                                {(task.startTime + task.duration).toString().padStart(2, "0")}:00 ({task.duration}시간)
                              </p>
                            </Card>
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
      </main>

      <MobileNav />

      {/* New schedule dialog */}
      <NewScheduleDialog open={showNewScheduleDialog} onOpenChange={setShowNewScheduleDialog} />

      {/* Goals tree dialog */}
      <GoalsTreeDialog open={showGoalsDialog} onOpenChange={setShowGoalsDialog} />
    </div>
  )
}
