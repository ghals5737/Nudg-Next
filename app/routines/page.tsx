"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { NewRoutineDialog } from "@/components/new-routine-dialog"
import { routinesApi } from "@/lib/api/routines"
import type { RoutineWithRhythm } from "@/types/api"

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"]

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<RoutineWithRhythm[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewRoutineDialog, setShowNewRoutineDialog] = useState(false)

  const fetchRoutines = () => {
    routinesApi.list()
      .then((res) => setRoutines(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRoutines() }, [])

  const toggleRoutine = async (id: string) => {
    await routinesApi.toggle(id)
    fetchRoutines()
  }

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#2a3433] flex">
      <AppSidebar />

      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="hidden md:flex justify-end items-center px-8 pt-6 pb-4">
          <button className="p-2 rounded-full hover:bg-[#eef5f3] transition-colors relative">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </header>

        <div className="px-6 md:px-8 pb-24 md:pb-8 flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2a3433] tracking-tight mb-3">나의 루틴</h2>
              <p className="text-lg text-[#56615f] leading-relaxed">부드러운 리듬을 만들어 보세요. 습관이 당신을 변화시킵니다.</p>
            </div>
            <button
              onClick={() => setShowNewRoutineDialog(true)}
              className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#e1eae8] text-[#2a3433] hover:bg-[#d9e5e2] transition-colors duration-300 font-semibold shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              새 루틴
            </button>
          </div>

          {loading && <p className="text-[#56615f]">불러오는 중...</p>}

          {!loading && routines.length === 0 && (
            <div className="bg-[#eef5f3] rounded-xl p-8 text-center text-[#56615f]">
              아직 루틴이 없어요. 첫 루틴을 만들어보세요!
            </div>
          )}

          <div className="space-y-6">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className={`group rounded-xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all duration-300 ease-out relative overflow-hidden ${
                  routine.active
                    ? "bg-white hover:shadow-[0px_12px_32px_rgba(42,52,51,0.06)] hover:-translate-y-1"
                    : "bg-[#eef5f3] hover:bg-white hover:shadow-[0px_12px_32px_rgba(42,52,51,0.06)]"
                }`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${routine.active ? "bg-[#006b64]" : "bg-[#d9e5e2]"} transition-colors`} />

                <div className={`flex items-start gap-5 flex-1 min-w-[250px] ${!routine.active ? "opacity-70 group-hover:opacity-100 transition-opacity duration-300" : ""}`}>
                  <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: routine.iconBg }}>
                    <span className="material-symbols-outlined text-2xl text-[#006b64]" style={{ fontVariationSettings: "'FILL' 1" }}>{routine.icon}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-bold text-[#2a3433] tracking-tight mb-1">{routine.title}</h3>
                    <p className="text-sm text-[#56615f]">{routine.duration}분 · {routine.time}</p>
                  </div>
                </div>

                <div className={`flex flex-wrap items-center gap-8 lg:gap-12 flex-shrink-0 ${!routine.active ? "opacity-60 group-hover:opacity-100 transition-opacity duration-300" : ""}`}>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#56615f]/70">스케줄</span>
                    <div className="flex gap-1.5">
                      {dayLabels.map((day, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${
                            routine.days[i] ? "bg-[#7fe6db] text-[#00534d]" : "bg-[#f6faf8] text-[#56615f] font-medium"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#56615f]/70">7일 리듬 ({routine.successRate}%)</span>
                    <div className="flex gap-2 items-center h-8">
                      {routine.rhythm.map((done, i) => (
                        <div
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${
                            done ? "bg-[#006b64] shadow-sm" : i === routine.rhythm.length - 1 ? "bg-[#e7f0ed] ring-1 ring-[#a9b4b2]/50" : "bg-[#d9e5e2]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute right-6 top-6 lg:relative lg:right-0 lg:top-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={routine.active}
                      onChange={() => toggleRoutine(routine.id)}
                    />
                    <div className="w-14 h-8 bg-[#d9e5e2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-[#a9b4b2]/20 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-[#006b64]" />
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
    </div>
  )
}
