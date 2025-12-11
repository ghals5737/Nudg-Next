"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { ActiveTimerBar } from "@/components/active-timer-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

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

  // 날짜 포맷팅
  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const date = today.getDate()
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
    const dayName = dayNames[today.getDay()]
    return `${year}년 ${month}월 ${date}일 ${dayName}`
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AppSidebar />

      {activeTask && (
        <ActiveTimerBar
          taskName={activeTask}
          onPause={handlePauseTask}
          onComplete={handleCompleteTask}
          onMinimize={handleMinimizeTimer}
        />
      )}

      <main className={`flex-1 ml-[260px] ${activeTask ? "pt-[72px]" : ""}`}>
        <div className="px-10 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-bold text-[#1A1B1E]">안녕하세요! 👋</h1>
            <p className="text-sm text-[#868E96]">{getCurrentDate()}</p>
          </div>

          {/* Today's Schedule */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1A1B1E]">오늘의 계획</h2>
              <button className="text-sm text-[#868E96] hover:text-[#1A1B1E] transition-colors">
                다음 블록
              </button>
            </div>

            <div className="space-y-3">
              <Card className="border-l-4 border-l-[#4DB6AC] bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#343A40] mb-1">프로젝트 기획서 작성</h3>
                    <p className="text-sm text-[#868E96]">10:00 - 11:30 (1시간 30분)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-[#4DB6AC] hover:bg-[#3AA996] text-white h-9 px-6 rounded-lg font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                      onClick={() => handleStartTask("프로젝트 기획서 작성")}
                    >
                      시작
                    </Button>
                    <button className="text-xs text-[#868E96] hover:text-[#343A40] px-2 py-1">
                      15분 미루기
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-[#FF8A65] bg-white p-6 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-[#343A40] mb-1">팀 미팅 준비</h3>
                    <p className="text-sm text-[#868E96]">14:00 - 15:00 (1시간)</p>
                  </div>
                  <span className="text-sm text-[#868E96]">대기중</span>
                </div>
              </Card>
            </div>
          </section>

          {/* Today's Routines */}
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1A1B1E]">오늘의 루틴</h2>
              <button className="text-sm text-[#868E96] hover:text-[#1A1B1E] transition-colors">
                더보기
              </button>
            </div>

            <div className="space-y-2">
              {[
                { name: "아침 운동 (30분)", checked: true, time: "✓ 완료" },
                { name: "독서 시간 (20분)", checked: false, time: "19:00" },
                { name: "명상 (10분)", checked: false, time: "21:30" },
              ].map((routine, i) => (
                <Card key={i} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={routine.checked}
                      className={routine.checked ? "border-[#4DB6AC] data-[state=checked]:bg-[#4DB6AC]" : ""}
                    />
                    <span className={routine.checked ? "text-[#868E96] line-through" : "text-[#343A40]"}>
                      {routine.name}
                    </span>
                  </div>
                  <span className={`text-sm ${routine.checked ? "text-[#4DB6AC]" : "text-[#868E96]"}`}>
                    {routine.time}
                  </span>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent CBT Records */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1A1B1E]">최근 CBT 기록</h2>
              <button className="text-sm text-[#868E96] hover:text-[#1A1B1E] transition-colors">
                전체보기
              </button>
            </div>

            <div className="space-y-3">
              <Card className="bg-white p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">😊</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#343A40]">김호흡으로 스트레스 완화</h3>
                    <p className="mt-1 text-sm text-[#868E96]">
                      2시간 전 • 성공
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
