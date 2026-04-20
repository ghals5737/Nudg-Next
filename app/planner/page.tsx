"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { NewScheduleDialog } from "@/components/new-schedule-dialog"
import { scheduleApi } from "@/lib/api/schedule"
import type { ScheduleBlock } from "@/types/api"

const toDateStr = (date: Date) => date.toISOString().slice(0, 10)

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

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewScheduleDialog, setShowNewScheduleDialog] = useState(false)

  const fetchBlocks = (date: Date) => {
    setLoading(true)
    scheduleApi.list(toDateStr(date))
      .then((res) => setBlocks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBlocks(currentDate) }, [currentDate])

  const goTo = (offset: number) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + offset)
    setCurrentDate(d)
  }

  const formatDate = (date: Date) => {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`
  }

  const isToday = () => {
    const today = new Date()
    return currentDate.toDateString() === today.toDateString()
  }

  const now = new Date()
  const currentHour = now.getHours()
  const hours = Array.from({ length: 16 }, (_, i) => i + 6) // 06:00 ~ 21:00

  const handleSnooze = async (id: string) => {
    await scheduleApi.snooze(id, { minutes: 15 })
    fetchBlocks(currentDate)
  }

  const getBlockForHour = (hour: number) =>
    blocks.find((b) => hour === Math.floor(b.startTime))

  const isActiveBlock = (block: ScheduleBlock) => {
    const nowDecimal = now.getHours() + now.getMinutes() / 60
    return isToday() && nowDecimal >= block.startTime && nowDecimal < block.endTime
  }

  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#2a3433] flex">
      <AppSidebar />

      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="hidden md:flex justify-end items-center px-8 pt-6 pb-4">
          <button className="p-2 rounded-full hover:bg-[#eef5f3] transition-colors">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </header>

        <div className="flex-1 px-4 sm:px-8 lg:px-12 pb-24 md:pb-8 max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2a3433] mb-2">오늘의 집중</h2>
              <div className="flex items-center gap-3 text-[#56615f]">
                <button onClick={() => goTo(-1)} className="p-1 hover:text-[#006b64] transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <span className="font-medium">{formatDate(currentDate)}</span>
                <button onClick={() => goTo(1)} className="p-1 hover:text-[#006b64] transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
                {!isToday() && (
                  <button onClick={() => setCurrentDate(new Date())} className="text-sm text-[#006b64] hover:text-[#005e57] font-medium">오늘</button>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowNewScheduleDialog(true)}
              className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-[#cce8e4] text-[#3d5653] font-semibold hover:bg-[#e1eae8] transition-colors duration-300"
            >
              <span className="material-symbols-outlined">add</span>
              새 블록
            </button>
          </div>

          {loading ? (
            <p className="text-[#56615f]">불러오는 중...</p>
          ) : (
            <div className="space-y-6 relative">
              <div className="absolute left-[39px] top-4 bottom-4 w-px bg-[#a9b4b2] opacity-15 hidden sm:block" />
              {hours.map((hour) => {
                const block = getBlockForHour(hour)
                const isActive = block ? isActiveBlock(block) : false
                const isPast = isToday() && hour < currentHour

                return (
                  <div key={hour} className="flex gap-4 sm:gap-8 items-start group">
                    <div className="hidden sm:flex flex-col items-center min-w-[80px] pt-4">
                      <span className={`font-bold ${isActive ? "text-[#006b64]" : isPast ? "text-[#a9b4b2]" : "text-[#56615f]"}`}>
                        {hour.toString().padStart(2, "0")}:00
                      </span>
                      {block && (
                        <span className="text-xs text-[#56615f] mt-1">{toDurationStr(block.duration)}</span>
                      )}
                    </div>

                    {block ? (
                      <div className={`flex-1 rounded-xl p-6 relative overflow-hidden transition-all duration-300 ease-out hover:shadow-[0px_16px_40px_rgba(42,52,51,0.08)] ${
                        isActive ? "bg-white shadow-[0px_12px_32px_rgba(42,52,51,0.06)]" : "bg-[#eef5f3] hover:bg-[#e7f0ed]"
                      } ${isPast && !isActive ? "opacity-50" : ""}`}>
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#006b64] to-[#7fe6db]" />
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2 sm:hidden">
                              <span className={`text-sm font-bold ${isActive ? "text-[#006b64]" : "text-[#56615f]"}`}>{toTimeStr(block.startTime)}</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#2a3433] mb-1">{block.title}</h3>
                            {block.location && (
                              <p className="text-sm text-[#56615f] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {block.location}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleSnooze(block.id)}
                            className="self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef5f3] text-[#56615f] hover:bg-[#e7f0ed] hover:text-[#2a3433] transition-colors text-sm font-medium"
                          >
                            <span className="material-symbols-outlined text-sm">snooze</span>
                            15분
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 py-4">
                        <div className="h-px bg-[#e7f0ed]" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <button
        onClick={() => setShowNewScheduleDialog(true)}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#006b64] to-[#7fe6db] text-[#e2fffa] shadow-[0px_12px_32px_rgba(42,52,51,0.06)] flex items-center justify-center z-50"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      <MobileNav />
      <NewScheduleDialog
        open={showNewScheduleDialog}
        onOpenChange={setShowNewScheduleDialog}
        date={toDateStr(currentDate)}
        onSuccess={() => fetchBlocks(currentDate)}
      />
    </div>
  )
}
