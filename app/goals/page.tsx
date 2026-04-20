"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { NewGoalDialog } from "@/components/new-goal-dialog"
import { goalsApi } from "@/lib/api/goals"
import type { Goal } from "@/types/api"

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)

  const fetchGoals = () => {
    goalsApi.list()
      .then((res) => setGoals(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchGoals() }, [])

  const handleStepToggle = async (goalId: string, stepId: string, done: boolean) => {
    await goalsApi.updateStep(goalId, stepId, { done: !done })
    fetchGoals()
  }

  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
    : 0

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#2a3433] flex">
      <AppSidebar />

      <main className="flex-1 md:ml-72 min-h-screen pt-6 md:pt-12 px-6 md:px-12 pb-24 max-w-6xl mx-auto w-full">
        <header className="md:hidden fixed top-0 left-0 w-full bg-[#f6faf8]/80 backdrop-blur-3xl z-40 flex justify-between items-center px-6 py-4">
          <div className="text-xl font-bold text-[#006b64]">Nudg</div>
          <button className="text-[#56615f] p-2 rounded-full hover:bg-[#eef5f3] transition-colors">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </header>

        <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-16 md:mt-0">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2a3433] mb-2">장기 목표</h2>
            <p className="text-lg text-[#56615f] font-medium max-w-lg">꾸준한 진전이 급격한 도약보다 낫습니다. 오늘도 한 걸음씩.</p>
          </div>
          <button
            onClick={() => setShowNewGoalDialog(true)}
            className="self-start md:self-auto bg-white text-[#006b64] px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-[#eef5f3] transition-colors duration-300 shadow-[0px_12px_32px_rgba(42,52,51,0.06)]"
          >
            <span className="material-symbols-outlined">add</span>
            새 목표
          </button>
        </header>

        {loading ? (
          <p className="text-[#56615f]">불러오는 중...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 전체 진행률 */}
            <section className="lg:col-span-5 bg-white rounded-[3rem] p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-[0px_12px_32px_rgba(42,52,51,0.06)]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#b7e7ff]/30 to-[#f6faf8] opacity-50 pointer-events-none" />
              <h3 className="text-xl font-bold text-[#2a3433] z-10 self-start w-full mb-8">전체 진행률</h3>
              <div className="relative w-48 h-48 mb-6 z-10 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-[#e1eae8]" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
                  <circle
                    className="text-[#006b64] opacity-80"
                    cx="50" cy="50" fill="none" r="45" stroke="currentColor"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * overallProgress) / 100}
                    strokeLinecap="round" strokeWidth="8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-[#006b64]">{overallProgress}%</span>
                  <span className="text-sm text-[#56615f] font-medium">마일스톤</span>
                </div>
              </div>
              <p className="text-center text-[#56615f] font-medium z-10">
                {goals.length > 0 ? `${goals.length}개의 활성 목표에서 꾸준히 진전 중입니다.` : "아직 목표가 없어요. 첫 목표를 만들어보세요!"}
              </p>
            </section>

            {/* 목표 목록 */}
            <section className="lg:col-span-7 flex flex-col gap-6">
              {goals.length === 0 && (
                <div className="bg-[#eef5f3] rounded-xl p-8 text-center text-[#56615f]">
                  아직 목표가 없어요. 새 목표를 추가해보세요!
                </div>
              )}
              {goals.map((goal) => (
                <article
                  key={goal.id}
                  className="bg-[#eef5f3] rounded-xl p-6 md:p-8 hover:bg-[#e7f0ed] transition-colors duration-300 group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: goal.iconBg }}>
                        <span className="material-symbols-outlined text-2xl" style={{ color: goal.iconColor, fontVariationSettings: "'FILL' 1" }}>{goal.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-[#2a3433]">{goal.title}</h4>
                        <p className="text-[#56615f] font-medium mt-1">{goal.subtitle}</p>
                      </div>
                    </div>
                    <span className="font-bold bg-white rounded-full px-4 py-2 text-sm hidden sm:block group-hover:bg-[#f6faf8] transition-colors" style={{ color: goal.progressColor }}>
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-[#f6faf8] h-4 rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${goal.progress}%`,
                        background: `linear-gradient(90deg, ${goal.progressColor}, ${goal.iconBg})`,
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {goal.steps.map((step) => (
                      <button
                        key={step.id}
                        onClick={() => handleStepToggle(goal.id, step.id, step.done)}
                        className="bg-white text-[#56615f] px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-[#f6faf8] transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg" style={{ color: step.done ? goal.progressColor : "#a9b4b2" }}>
                          {step.done ? "check_circle" : "radio_button_unchecked"}
                        </span>
                        {step.label}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#f6faf8]/90 backdrop-blur-xl z-50 px-6 py-4 flex justify-around items-center shadow-[0px_-12px_32px_rgba(42,52,51,0.04)]">
        <MobileNav />
      </nav>

      <NewGoalDialog
        open={showNewGoalDialog}
        onOpenChange={setShowNewGoalDialog}
        onSuccess={() => fetchGoals()}
      />
    </div>
  )
}
