"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Check, MoreVertical, Calendar, Bell } from "lucide-react"
import { useState } from "react"

type Routine = {
  id: number
  title: string
  duration: number
  time: string
  days: string[]
  notification: string
  emoji: string
  weeklyProgress: number
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
    notification: "모든 알림 • 운동할 시간이에요!",
    emoji: "💪",
    weeklyProgress: 86,
    active: true,
    timeUntil: "작금",
  },
  {
    id: 2,
    title: "독서 시간",
    duration: 20,
    time: "19:00",
    days: ["매일", "월", "화", "수", "목", "금", "토"],
    notification: "부드러운 알림 • 책 읽을 시간이에요",
    emoji: "📚",
    weeklyProgress: 57,
    active: true,
    timeUntil: "7시간 27분 후",
  },
  {
    id: 3,
    title: "명상",
    duration: 10,
    time: "21:30",
    days: ["매일", "월", "화", "수", "목", "금", "토"],
    notification: "",
    emoji: "",
    weeklyProgress: 71,
    active: true,
    timeUntil: "9시간 57분 후",
  },
]

const inactiveRoutines: Routine[] = [
  {
    id: 4,
    title: "물 마시기",
    duration: 0,
    time: "10:00",
    days: ["매일", "월", "화", "수", "목", "금"],
    notification: "모든 알림 • 물 마실 시간!",
    emoji: "💧",
    weeklyProgress: 57,
    active: false,
  },
]

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>(sampleRoutines)
  const [inactive, setInactive] = useState<Routine[]>(inactiveRoutines)

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <main className="flex-1 md:ml-[200px]">
        <div className="mx-auto max-w-6xl p-6 pb-24 md:pb-6">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-text">루틴</h1>
              <p className="text-sm text-text-sub">반복 작업을 관리하고 습관을 만들어보세요</p>
            </div>
            <Button className="bg-brand hover:bg-brand-strong">
              <Plus className="mr-2 h-4 w-4" />새 루틴
            </Button>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-text">활성 루틴</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {routines.map((routine) => (
                <Card key={routine.id} className="bg-card p-4">
                  {/* Header with title, toggle, and menu */}
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-base font-semibold text-text">{routine.title}</h3>
                    <div className="flex items-center gap-2">
                      <Switch checked={routine.active} />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Days */}
                  <div className="mb-2 flex items-center gap-1 text-xs text-text-sub">
                    <Calendar className="h-3 w-3" />
                    <span>{routine.days.join(" • ")}</span>
                  </div>

                  {/* Time */}
                  <div className="mb-2 flex items-center gap-1 text-xs text-text-sub">
                    <span className="flex items-center gap-1">
                      ⏰ {routine.time}
                      {routine.timeUntil && <span> • {routine.timeUntil}</span>}
                    </span>
                  </div>

                  {/* Notification */}
                  {routine.notification && (
                    <div className="mb-3 flex items-center gap-1 text-xs text-text-sub">
                      <Bell className="h-3 w-3" />
                      <span>
                        {routine.notification} {routine.emoji}
                      </span>
                    </div>
                  )}

                  {/* Weekly progress */}
                  <div className="mb-3">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-text-sub">최근 7일</span>
                      <span className="font-medium text-success">{routine.weeklyProgress}% 성공</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div
                          key={day}
                          className={`h-2 flex-1 rounded ${
                            day <= Math.floor((routine.weeklyProgress / 100) * 7) ? "bg-success" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <Button className="flex-1 bg-brand hover:bg-brand-strong">
                      <Check className="mr-2 h-4 w-4" />
                      완료
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-text-sub">
                      ⏰ 15분 미루기
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-text">비활성 루틴</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {inactive.map((routine) => (
                <Card key={routine.id} className="bg-card p-4 opacity-60">
                  {/* Header with title, toggle, and menu */}
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-base font-semibold text-text">{routine.title}</h3>
                    <div className="flex items-center gap-2">
                      <Switch checked={routine.active} />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Days */}
                  <div className="mb-2 flex items-center gap-1 text-xs text-text-sub">
                    <Calendar className="h-3 w-3" />
                    <span>{routine.days.join(" • ")}</span>
                  </div>

                  {/* Time */}
                  <div className="mb-2 flex items-center gap-1 text-xs text-text-sub">
                    <span>⏰ {routine.time}</span>
                  </div>

                  {/* Notification */}
                  {routine.notification && (
                    <div className="mb-3 flex items-center gap-1 text-xs text-text-sub">
                      <Bell className="h-3 w-3" />
                      <span>
                        {routine.notification} {routine.emoji}
                      </span>
                    </div>
                  )}

                  {/* Weekly progress */}
                  <div>
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-text-sub">최근 7일</span>
                      <span className="font-medium text-text-sub">{routine.weeklyProgress}% 성공</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div
                          key={day}
                          className={`h-2 flex-1 rounded ${
                            day <= Math.floor((routine.weeklyProgress / 100) * 7) ? "bg-success" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
