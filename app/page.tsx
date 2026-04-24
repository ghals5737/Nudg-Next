"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { dashboardApi } from "@/lib/api/dashboard"
import { scheduleApi } from "@/lib/api/schedule"
import type { DashboardResponse } from "@/types/api"

const toTimeStr = (t: number) => {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

const toDurationStr = (hours: number) => {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}분`
  if (m === 0) return `${h}시간`
  return `${h}시간 ${m}분`
}

const getCurrentDate = () => {
  const today = new Date()
  const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
  return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${dayNames[today.getDay()]}`
}

export default function HomePage() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.get()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleComplete = async (id: string) => {
    await scheduleApi.complete(id)
    setActiveTaskId(null)
    const res = await dashboardApi.get()
    setData(res.data)
  }

  const handleSnooze = async (id: string) => {
    await scheduleApi.snooze(id, { minutes: 15 })
    const res = await dashboardApi.get()
    setData(res.data)
  }

  const focusTask = data?.focusTask ?? null
  const activeTaskTitle = data?.todayTasks.find((t) => t.id === activeTaskId)?.title ?? null

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-[#24323d] flex selection:bg-[#b8dcec] selection:text-[#00534d]">
      <AppSidebar />

      {activeTaskId && activeTaskTitle && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#0b5c7a] text-[#ffffff] px-6 py-3 flex items-center justify-between shadow-[0px_4px_16px_rgba(11,92,122,0.2)]">
          <div className="flex items-center gap-3 md:ml-72">
            <span className="material-symbols-outlined text-xl animate-pulse">timer</span>
            <span className="font-semibold">{activeTaskTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleComplete(activeTaskId)} className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors">
              완료
            </button>
          </div>
        </div>
      )}

      <main className={`flex-1 md:ml-72 flex flex-col min-h-screen ${activeTaskId ? "pt-[52px]" : ""}`}>
        <header className="hidden md:flex justify-end items-center px-8 pt-6 pb-4">
          <div className="flex items-center gap-4 text-[#6a7a8a]">
            <button className="p-2 rounded-full hover:bg-[#e8eff5] transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-[#e8eff5] transition-colors">
              <span className="material-symbols-outlined text-2xl">account_circle</span>
            </button>
          </div>
        </header>

        <div className="flex-1 px-6 md:px-12 py-6 md:py-8 pb-24 md:pb-12 max-w-5xl mx-auto w-full flex flex-col gap-12">
          <section className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#24323d] tracking-tight">
              {loading ? "불러오는 중..." : `${data?.greeting ?? "안녕하세요!"} 👋`}
            </h2>
            <p className="text-[#6a7a8a] text-lg">{getCurrentDate()}</p>
          </section>

          {/* Focus Now Hero */}
          <section className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-[0px_12px_32px_rgba(36,50,61,0.06)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#b8dcec] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
            <div className="relative z-10 space-y-6 flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d5e4ee] text-[#3d4e58] text-sm font-medium">
                <span className="material-symbols-outlined text-sm">center_focus_strong</span>
                현재 우선 과제
              </div>
              {focusTask ? (
                <>
                  <h3 className={`text-2xl md:text-3xl font-bold tracking-tight ${focusTask.status === "completed" ? "text-[#a8b4bf] line-through" : "text-[#24323d]"}`}>
                    {focusTask.title}
                  </h3>
                  <p className="text-[#6a7a8a] max-w-md mx-auto md:mx-0">
                    {toTimeStr(focusTask.startTime)} - {toTimeStr(focusTask.endTime)} ({toDurationStr(focusTask.duration)})
                  </p>
                  {focusTask.status === "completed" ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d5e4ee] text-[#3d4e58] text-sm font-semibold">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      완료했어요! 수고하셨습니다 🎉
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center md:justify-start">
                      <button
                        className="bg-[#0b5c7a] text-[#ffffff] rounded-xl px-8 py-4 font-bold text-lg flex items-center gap-3 hover:-translate-y-1 transition-all duration-300 shadow-[0px_12px_32px_rgba(36,50,61,0.06)] w-full sm:w-auto justify-center"
                        onClick={() => setActiveTaskId(focusTask.id)}
                      >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                        시작
                      </button>
                      <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e8eff5] text-[#6a7a8a] text-sm font-medium">
                        <span className="material-symbols-outlined text-sm">timer</span>
                        {toDurationStr(focusTask.duration)}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xl text-[#6a7a8a]">{loading ? "로딩 중..." : "오늘 예정된 집중 과제가 없어요 🎉"}</p>
              )}
            </div>
            <div className="relative z-10 w-40 h-40 md:w-56 md:h-56 flex-shrink-0 flex items-center justify-center bg-[#f5f8fb] rounded-full shadow-[0px_12px_32px_rgba(36,50,61,0.06)]">
              <div className="absolute inset-2 rounded-full border-4 border-[#cfdce6] border-t-[#b8dcec] opacity-60" />
              <span className="material-symbols-outlined text-5xl md:text-6xl text-[#083d52] opacity-70">hourglass_empty</span>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 오늘의 계획 */}
            <section className="lg:col-span-7 flex flex-col gap-6">
              <h4 className="text-lg font-bold text-[#24323d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6a7a8a]">calendar_month</span>
                오늘의 계획
              </h4>
              <div className="flex flex-col gap-4">
                {loading && <p className="text-[#6a7a8a]">불러오는 중...</p>}
                {!loading && data?.todayTasks.length === 0 && (
                  <p className="text-[#6a7a8a] text-sm">오늘 등록된 일정이 없어요.</p>
                )}
                {data?.todayTasks.map((task) => {
                  const isCompleted = task.status === "completed"
                  return (
                    <div
                      key={task.id}
                      className={`rounded-xl p-5 flex items-start gap-4 group transition-colors duration-300 ${
                        isCompleted ? "bg-white opacity-60" : "bg-[#e8eff5] hover:bg-[#e8eff5] cursor-pointer"
                      }`}
                    >
                      {isCompleted ? (
                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-[#d5e4ee] flex items-center justify-center">
                          <span className="material-symbols-outlined text-xs text-[#0b5c7a]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => scheduleApi.complete(task.id).then(() => dashboardApi.get().then((r) => setData(r.data)))}
                          className="mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#a8b4bf] group-hover:border-[#0b5c7a] transition-colors flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-xs text-transparent group-hover:text-[#b8dcec] transition-colors">check</span>
                        </button>
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${isCompleted ? "line-through text-[#a8b4bf]" : "text-[#24323d]"}`}>{task.title}</p>
                        <p className="text-sm text-[#6a7a8a] mt-1">{toTimeStr(task.startTime)} - {toTimeStr(task.endTime)}</p>
                      </div>
                      <span className="text-sm text-[#6a7a8a] bg-white px-3 py-1 rounded-full whitespace-nowrap">{toTimeStr(task.startTime)}</span>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* 오늘의 루틴 */}
            <section className="lg:col-span-5 flex flex-col gap-6">
              <h4 className="text-lg font-bold text-[#24323d] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6a7a8a]">track_changes</span>
                오늘의 루틴
              </h4>
              <div className="bg-white rounded-[2rem] p-8 shadow-[0px_12px_32px_rgba(36,50,61,0.06)] flex flex-col items-center gap-6">
                {data && (
                  <>
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle className="stroke-[#cfdce6]" cx="50" cy="50" fill="none" r="45" strokeWidth="8" strokeLinecap="round" />
                        <circle
                          className="stroke-[#0b5c7a]"
                          cx="50" cy="50" fill="none" r="45"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * (data.routineProgress.total > 0 ? data.routineProgress.completed / data.routineProgress.total : 0))}
                          strokeLinecap="round" strokeWidth="8"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-[#24323d]">{data.routineProgress.completed}/{data.routineProgress.total}</span>
                        <span className="text-xs text-[#6a7a8a]">루틴</span>
                      </div>
                    </div>
                    <div className="space-y-3 w-full">
                      {data.todayRoutines.map(({ routine, completed }) => (
                        <div key={routine.id} className="space-y-1.5 w-full">
                          <div className="flex items-center justify-between text-sm">
                            <span className={completed ? "text-[#24323d] font-medium" : "text-[#6a7a8a]"}>{routine.title} ({routine.duration}분)</span>
                            <span className={completed ? "text-[#0b5c7a] font-bold" : "text-[#6a7a8a]"}>{completed ? "완료" : "대기"}</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#cfdce6] rounded-full overflow-hidden">
                            <div className={`h-full bg-[#b8dcec] rounded-full transition-all duration-500 ${completed ? "w-full" : "w-0"}`} />
                          </div>
                        </div>
                      ))}
                      {data.todayRoutines.length === 0 && (
                        <p className="text-sm text-[#6a7a8a] text-center">오늘 루틴이 없어요.</p>
                      )}
                    </div>
                  </>
                )}
                {loading && <p className="text-[#6a7a8a] text-sm">불러오는 중...</p>}
              </div>
            </section>
          </div>

          {/* 최근 CBT */}
          <section className="flex flex-col gap-6">
            <h4 className="text-lg font-bold text-[#24323d] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6a7a8a]">psychology</span>
              최근 CBT 기록
              <a href="/cbt" className="ml-auto text-sm text-[#6a7a8a] font-normal hover:text-[#0b5c7a] transition-colors">전체보기</a>
            </h4>
            {data?.recentCBT ? (
              <div className="bg-white rounded-xl p-6 shadow-[0px_12px_32px_rgba(36,50,61,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white shadow-[0px_12px_32px_rgba(36,50,61,0.06)] flex items-center justify-center text-xl flex-shrink-0">
                    {data.recentCBT.emoji}
                  </div>
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2" style={{ backgroundColor: data.recentCBT.moodBg, color: data.recentCBT.moodText }}>
                      {data.recentCBT.mood}
                    </span>
                    <p className="text-[#24323d] leading-relaxed">{data.recentCBT.content}</p>
                    {data.recentCBT.tags && data.recentCBT.tags.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {data.recentCBT.tags.map((tag) => (
                          <span key={tag} className="text-xs text-[#6a7a8a] bg-[#f5f8fb] px-2 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              !loading && <p className="text-sm text-[#6a7a8a]">아직 감정 기록이 없어요.</p>
            )}
          </section>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
