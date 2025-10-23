"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { ActiveTimerBar } from "@/components/active-timer-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap } from "lucide-react"

export default function HomePage() {
  const [activeTask, setActiveTask] = useState<string | null>(null)

  const handleStartTask = (taskName: string) => {
    setActiveTask(taskName)
  }

  const handlePauseTask = () => {
    console.log("[v0] Task paused")
  }

  const handleCompleteTask = () => {
    setActiveTask(null)
    console.log("[v0] Task completed")
  }

  const handleMinimizeTimer = () => {
    console.log("[v0] Timer minimized")
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      {activeTask && (
        <ActiveTimerBar
          taskName={activeTask}
          onPause={handlePauseTask}
          onComplete={handleCompleteTask}
          onMinimize={handleMinimizeTimer}
        />
      )}

      <main className={`flex-1 md:ml-[200px] ${activeTask ? "pt-[72px]" : ""}`}>
        <div className="mx-auto max-w-5xl p-6 pb-24 md:pb-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold text-text">안녕하세요! 👋</h1>
            <p className="text-sm text-text-sub">2025년 10월 23일 목요일</p>
          </div>

          <Button className="mb-8 w-full bg-brand hover:bg-brand-strong" size="lg">
            <Zap className="mr-2 h-5 w-5" />
            지금 기록하기 ⚡
          </Button>

          {/* Today's Schedule */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">오늘의 계획</h2>
              <Button variant="ghost" size="sm" className="text-text-sub hover:text-text">
                더욱 블록
              </Button>
            </div>

            <div className="space-y-3">
              <Card className="border-l-4 border-l-brand bg-card p-4">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-card-foreground">프로젝트 기획서 작성</h3>
                    <p className="mt-1 text-sm text-muted-foreground">10:00 - 11:30 (1시간 30분)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-brand hover:bg-brand-strong"
                      onClick={() => handleStartTask("프로젝트 기획서 작성")}
                    >
                      시작
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                      15분 미루기
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-warn bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-card-foreground">팀 미팅 준비</h3>
                    <p className="mt-1 text-sm text-muted-foreground">14:00 - 15:00 (1시간)</p>
                  </div>
                  <span className="text-sm text-muted-foreground">대기중</span>
                </div>
              </Card>
            </div>
          </section>

          {/* Today's Routines */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">오늘의 루틴</h2>
              <Button variant="ghost" size="sm" className="text-text-sub hover:text-text">
                더보기
              </Button>
            </div>

            <div className="space-y-2">
              {[
                { name: "아침 운동 (30분)", checked: true, time: "완료" },
                { name: "독서 시간 (20분)", checked: false, time: "19:00" },
                { name: "명상 (10분)", checked: false, time: "21:30" },
              ].map((routine, i) => (
                <Card key={i} className="flex items-center justify-between bg-card p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={routine.checked}
                      className={routine.checked ? "border-success data-[state=checked]:bg-success" : ""}
                    />
                    <span className={routine.checked ? "text-muted-foreground line-through" : "text-card-foreground"}>
                      {routine.name}
                    </span>
                  </div>
                  <span className={`text-sm ${routine.checked ? "text-success" : "text-muted-foreground"}`}>
                    {routine.time}
                  </span>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent CBT Records */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text">최근 CBT 기록</h2>
              <Button variant="ghost" size="sm" className="text-text-sub hover:text-text">
                전체보기
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { emoji: "😊", title: "집중운으로 스트레스 완화", time: "2시간 전", status: "상공" },
                { emoji: "😊", title: "산책으로 기분 전환", time: "6시간", status: "상공" },
                { emoji: "😰", title: "음악 듣기", time: "2일 전", status: "부분 성공" },
              ].map((record, i) => (
                <Card key={i} className="bg-card p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{record.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-card-foreground">{record.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {record.time} • {record.status}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
