"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { NewRoutineDialog } from "@/components/new-routine-dialog"
import { EditRoutineDialog } from "@/components/edit-routine-dialog"
import { routinesApi } from "@/lib/api/routines"
import type { RoutineWithRhythm, TodayRoutinesResponse } from "@/types/api"

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"]

const todayDateStr = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = (d.getMonth() + 1).toString().padStart(2, "0")
  const day = d.getDate().toString().padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<RoutineWithRhythm[]>([])
  const [today, setToday] = useState<TodayRoutinesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNewRoutineDialog, setShowNewRoutineDialog] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<RoutineWithRhythm | null>(null)

  const fetchRoutines = () => {
    routinesApi.list()
      .then((res) => setRoutines(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const fetchToday = () => {
    routinesApi.today()
      .then((res) => setToday(res.data))
      .catch(console.error)
  }

  useEffect(() => {
    fetchRoutines()
    fetchToday()
  }, [])

  const toggleRoutine = async (id: string) => {
    await routinesApi.toggle(id)
    fetchRoutines()
    fetchToday()
  }

  const toggleTodayCompletion = async (routineId: string, currentlyCompleted: boolean) => {
    const date = todayDateStr()
    try {
      if (currentlyCompleted) {
        await routinesApi.unlogCompletion(routineId, date)
      } else {
        await routinesApi.logCompletion(routineId, date)
      }
      fetchToday()
      fetchRoutines() // 7일 리듬 갱신
    } catch (err) {
      console.error("루틴 체크 실패:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF1F5] text-[#1F2937] flex">
      <AppSidebar />

      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="hidden md:flex justify-end items-center px-8 pt-6 pb-4">
          <button className="p-2 rounded-full hover:bg-[#EEF1F5] transition-colors relative">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </header>

        <div className="px-6 md:px-8 pb-24 md:pb-8 flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] tracking-tight mb-3">나의 루틴</h2>
              <p className="text-lg text-[#6B7280] leading-relaxed">부드러운 리듬을 만들어 보세요. 습관이 당신을 변화시킵니다.</p>
            </div>
            <button
              onClick={() => setShowNewRoutineDialog(true)}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E4E9F0] text-[#1F2937] hover:bg-[#E4E9F0] transition-colors duration-300 font-semibold shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              새 루틴
            </button>
          </div>

          {loading && <p className="text-[#6B7280]">불러오는 중...</p>}

          {/* 오늘의 루틴 체크 */}
          {today && today.items.length > 0 && (
            <section className="mb-10 bg-white rounded-xl p-6 md:p-8 shadow-[0px_12px_32px_rgba(31,41,55,0.04)]">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1">오늘의 루틴</h3>
                  <p className="text-sm text-[#6B7280]">
                    {today.progress.completed}/{today.progress.total} 완료
                    {today.progress.total > 0 && (
                      <span className="ml-2 text-[#1F76EB] font-semibold">
                        {Math.round((today.progress.completed / today.progress.total) * 100)}%
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* 진행률 바 */}
              <div className="h-1.5 w-full bg-[#EEF1F5] rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-[#1F76EB] rounded-full transition-all duration-500"
                  style={{ width: today.progress.total > 0 ? `${(today.progress.completed / today.progress.total) * 100}%` : "0%" }}
                />
              </div>

              <ul className="space-y-2">
                {today.items.map(({ routine, completed }) => (
                  <li key={routine.id}>
                    <button
                      onClick={() => toggleTodayCompletion(routine.id, completed)}
                      className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors ${
                        completed ? "bg-[#E8F0FC]" : "bg-[#EEF1F5] hover:bg-[#E4E9F0]"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full transition-colors flex-shrink-0 ${
                          completed ? "bg-[#1F76EB] text-white" : "bg-white border border-[#E4E9F0]"
                        }`}
                      >
                        {completed && (
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold ${completed ? "text-[#1F76EB] line-through" : "text-[#1F2937]"}`}>
                          {routine.title}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{routine.duration}분 · {routine.time}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!loading && routines.length === 0 && (
            <div className="bg-[#EEF1F5] rounded-xl p-8 text-center text-[#6B7280]">
              아직 루틴이 없어요. 첫 루틴을 만들어보세요!
            </div>
          )}

          <div className="space-y-6">
            {routines.map((routine) => (
              <div
                key={routine.id}
                onClick={() => setEditingRoutine(routine)}
                className={`group rounded-xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all duration-300 ease-out relative overflow-hidden cursor-pointer ${
                  routine.active
                    ? "bg-white hover:shadow-[0px_12px_32px_rgba(31,41,55,0.06)] hover:-translate-y-1"
                    : "bg-[#EEF1F5] hover:bg-white hover:shadow-[0px_12px_32px_rgba(31,41,55,0.06)]"
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${routine.active ? "bg-[#1F76EB]" : "bg-[#E4E9F0]"} transition-colors`} />

                <div className={`flex items-start gap-5 flex-1 min-w-[250px] ${!routine.active ? "opacity-70 group-hover:opacity-100 transition-opacity duration-300" : ""}`}>
                  <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: routine.iconBg }}>
                    <span className="material-symbols-outlined text-2xl text-[#1F76EB]" style={{ fontVariationSettings: "'FILL' 1" }}>{routine.icon}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-[#1F2937] tracking-tight mb-1">{routine.title}</h3>
                    <p className="text-sm text-[#6B7280]">{routine.duration}분 · {routine.time}</p>
                  </div>
                </div>

                <div className={`flex flex-wrap items-center gap-8 lg:gap-12 flex-shrink-0 ${!routine.active ? "opacity-60 group-hover:opacity-100 transition-opacity duration-300" : ""}`}>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#6B7280]/70">스케줄</span>
                    <div className="flex gap-1.5">
                      {dayLabels.map((day, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                            routine.days[i] ? "bg-[#E8F0FC] text-[#00534d]" : "bg-[#EEF1F5] text-[#6B7280] font-medium"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#6B7280]/70">7일 리듬 ({routine.successRate}%)</span>
                    <div className="flex gap-2 items-center h-8">
                      {routine.rhythm.map((done, i) => (
                        <div
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${
                            done ? "bg-[#1F76EB] shadow-sm" : i === routine.rhythm.length - 1 ? "bg-[#EEF1F5] ring-1 ring-[#6B7280]/50" : "bg-[#E4E9F0]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute right-6 top-6 lg:relative lg:right-0 lg:top-0" onClick={(e) => e.stopPropagation()}>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={routine.active}
                      onChange={() => toggleRoutine(routine.id)}
                    />
                    <div className="w-14 h-8 bg-[#E4E9F0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-[#6B7280]/20 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-[#1F76EB]" />
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="h-12" />
        </div>
      </main>

      <MobileNav />
      <NewRoutineDialog
        open={showNewRoutineDialog}
        onOpenChange={setShowNewRoutineDialog}
        onSuccess={() => fetchRoutines()}
      />
      <EditRoutineDialog
        open={!!editingRoutine}
        onOpenChange={(open) => { if (!open) setEditingRoutine(null) }}
        routine={editingRoutine}
        onSuccess={() => fetchRoutines()}
      />
    </div>
  )
}
