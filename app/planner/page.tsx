"use client"

import { useEffect, useRef, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { NewScheduleDialog } from "@/components/new-schedule-dialog"
import { EditScheduleDialog } from "@/components/edit-schedule-dialog"
import { scheduleApi } from "@/lib/api/schedule"
import type { ScheduleBlock } from "@/types/api"
import { useBlockAlarms } from "@/hooks/use-block-alarms"
import { getPermission, requestPermission, type PermissionState } from "@/lib/notifications"

const toDateStr = (date: Date) => {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const d = date.getDate().toString().padStart(2, "0")
  return `${y}-${m}-${d}`
}

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

const toElapsedStr = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

export default function PlannerPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewScheduleDialog, setShowNewScheduleDialog] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null)

  // 타이머
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0) // seconds (누적, 일시정지 시 유지)

  // 알림 권한
  const [notifPermission, setNotifPermission] = useState<PermissionState>("default")
  useEffect(() => { setNotifPermission(getPermission()) }, [])
  const handleEnableNotifications = async () => {
    const result = await requestPermission()
    setNotifPermission(result)
  }
  const startedAtRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchBlocks = (date: Date) => {
    setLoading(true)
    scheduleApi.list(toDateStr(date))
      .then((res) => setBlocks(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBlocks(currentDate) }, [currentDate])

  // 타이머 인터벌 — isRunning에 따라 시작/정지, elapsed는 유지
  useEffect(() => {
    if (isRunning) {
      startedAtRef.current = Date.now() - elapsed * 1000
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startedAtRef.current!) / 1000))
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning])

  const handleStart = (block: ScheduleBlock) => {
    // 다른 블록으로 전환 시에만 누적 시간 초기화
    if (activeBlockId !== block.id) {
      setElapsed(0)
    }
    setActiveBlockId(block.id)
    setIsRunning(true)
  }

  const handleComplete = async () => {
    if (!activeBlockId) return
    try {
      await scheduleApi.complete(activeBlockId)
      setActiveBlockId(null)
      setIsRunning(false)
      setElapsed(0)
      fetchBlocks(currentDate)
    } catch (err) {
      console.error("완료 처리 실패:", err)
      alert(`완료 처리에 실패했어요: ${err instanceof Error ? err.message : "알 수 없는 오류"}`)
    }
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleResume = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setActiveBlockId(null)
    setIsRunning(false)
    setElapsed(0)
  }

  const handleSnooze = async (id: string) => {
    await scheduleApi.snooze(id, { minutes: 15 })
    fetchBlocks(currentDate)
  }

  const goTo = (offset: number) => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + offset)
    setCurrentDate(d)
  }

  const formatDate = (date: Date) => {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"]
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`
  }

  const isToday = () => currentDate.toDateString() === new Date().toDateString()

  const now = new Date()
  const nowDecimal = now.getHours() + now.getMinutes() / 60

  const isCurrentTimeBlock = (block: ScheduleBlock) =>
    isToday() && nowDecimal >= block.startTime && nowDecimal < block.endTime

  const isPastBlock = (block: ScheduleBlock) =>
    isToday() && block.endTime < nowDecimal

  const sortedBlocks = [...blocks].sort((a, b) => a.startTime - b.startTime)

  // 오늘 일정 블록에 대한 시작/종료 5분 전/종료 알림 자동 스케줄링
  useBlockAlarms(sortedBlocks, isToday())

  const activeBlock = blocks.find((b) => b.id === activeBlockId) ?? null

  // 진행률 (예상 시간 대비)
  const progressPercent = activeBlock
    ? Math.min(100, Math.round((elapsed / (activeBlock.duration * 3600)) * 100))
    : 0

  return (
    <div className="min-h-screen bg-[#EEF1F5] text-[#1F2937] flex">
      <AppSidebar />

      {/* 활성 타이머 바 */}
      {activeBlock && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#1F76EB] text-[#ffffff] shadow-[0px_4px_16px_rgba(31,118,235,0.2)]">
          {/* 진행 바 */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-white/40 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
          <div className="flex items-center justify-between px-6 py-3 md:pl-80">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined text-xl ${isRunning ? "animate-pulse" : ""}`}>timer</span>
              <div>
                <span className="font-semibold">{activeBlock.title}</span>
                <span className="ml-3 text-[#ffffff]/70 text-sm">
                  {isRunning ? `예상 ${toDurationStr(activeBlock.duration)}` : "일시정지됨"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xl font-bold tabular-nums">{toElapsedStr(elapsed)}</span>
              {isRunning ? (
                <button
                  onClick={handlePause}
                  className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
                >
                  일시정지
                </button>
              ) : (
                <>
                  <button
                    onClick={handleResume}
                    className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
                  >
                    재개
                  </button>
                  <button
                    onClick={handleStop}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
                  >
                    중단
                  </button>
                </>
              )}
              <button
                onClick={handleComplete}
                className="px-3 py-1.5 rounded-full bg-white/30 hover:bg-white/40 text-sm font-bold transition-colors"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      <main className={`flex-1 md:ml-72 flex flex-col min-h-screen ${activeBlock ? "pt-[52px]" : ""}`}>
        <header className="hidden md:flex justify-end items-center px-8 pt-6 pb-4">
          <button className="p-2 rounded-full hover:bg-[#EEF1F5] transition-colors">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </header>

        <div className="flex-1 px-4 sm:px-8 lg:px-12 pb-24 md:pb-8 max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1F2937] mb-2">오늘의 집중</h2>
              <div className="flex items-center gap-3 text-[#6B7280]">
                <button onClick={() => goTo(-1)} className="p-1 hover:text-[#1F76EB] transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <span className="font-medium">{formatDate(currentDate)}</span>
                <button onClick={() => goTo(1)} className="p-1 hover:text-[#1F76EB] transition-colors">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
                {!isToday() && (
                  <button onClick={() => setCurrentDate(new Date())} className="text-sm text-[#1F76EB] hover:text-[#1F76EB] font-medium">오늘</button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isToday() && notifPermission === "default" && (
                <button
                  onClick={handleEnableNotifications}
                  className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#1F76EB] font-semibold hover:bg-[#E8F0FC] transition-colors duration-300 shadow-[0px_4px_12px_rgba(31,41,55,0.04)]"
                >
                  <span className="material-symbols-outlined">notifications_active</span>
                  알람 켜기
                </button>
              )}
              {isToday() && notifPermission === "granted" && (
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#E8F0FC] text-[#1F76EB] text-sm font-medium">
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
                  알람 켜짐
                </span>
              )}
              {isToday() && notifPermission === "denied" && (
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#EEF1F5] text-[#6B7280] text-sm font-medium" title="브라우저 설정에서 알림을 허용해주세요">
                  <span className="material-symbols-outlined text-base">notifications_off</span>
                  알람 차단됨
                </span>
              )}
              <button
                onClick={() => setShowNewScheduleDialog(true)}
                className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8F0FC] text-[#1F2937] font-semibold hover:bg-[#E4E9F0] transition-colors duration-300"
              >
                <span className="material-symbols-outlined">add</span>
                새 블록
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-[#6B7280]">불러오는 중...</p>
          ) : sortedBlocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <span className="material-symbols-outlined text-5xl text-[#6B7280]">calendar_today</span>
              <p className="text-[#6B7280] font-medium">등록된 일정이 없어요</p>
              <button
                onClick={() => setShowNewScheduleDialog(true)}
                className="mt-2 flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8F0FC] text-[#1F2937] font-semibold hover:bg-[#E4E9F0] transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                첫 블록 추가하기
              </button>
            </div>
          ) : (
            <div className="space-y-4 relative">
              <div className="absolute left-[39px] top-4 bottom-4 w-px bg-[#6B7280] opacity-15 hidden sm:block" />
              {sortedBlocks.map((block) => {
                const isActive = block.id === activeBlockId
                const isCurrentBlock = isCurrentTimeBlock(block)
                const isPast = isPastBlock(block)
                const isCompleted = block.status === "completed"

                return (
                  <div key={block.id} className="flex gap-4 sm:gap-8 items-start group">
                    <div className="hidden sm:flex flex-col items-center min-w-[80px] pt-4">
                      <span className={`font-bold ${isActive || isCurrentBlock ? "text-[#1F76EB]" : isPast ? "text-[#6B7280]" : "text-[#6B7280]"}`}>
                        {toTimeStr(block.startTime)}
                      </span>
                      <span className="text-xs text-[#6B7280] mt-1">{toDurationStr(block.duration)}</span>
                    </div>

                    {(
                      <div
                        onClick={() => setEditingBlock(block)}
                        className={`flex-1 rounded-xl p-6 relative overflow-hidden transition-all duration-300 ease-out cursor-pointer ${
                          isCompleted
                            ? "bg-white opacity-50"
                            : isActive
                            ? "bg-white shadow-[0px_12px_32px_rgba(31,41,55,0.1)] ring-2 ring-[#E8F0FC]/50"
                            : isCurrentBlock
                            ? "bg-white shadow-[0px_12px_32px_rgba(31,41,55,0.06)]"
                            : "bg-white hover:bg-white hover:shadow-[0px_16px_40px_rgba(31,41,55,0.08)]"
                        } ${isPast && !isCurrentBlock && !isCompleted ? "opacity-60" : ""}`}>

                        {/* 좌측 상태 표시 바 */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors ${
                          isActive ? "bg-[#1F76EB]"
                          : isCurrentBlock ? "bg-[#1F76EB]"
                          : isCompleted ? "bg-[#E8F0FC]"
                          : "bg-transparent"
                        }`} />

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 sm:hidden">
                              <span className={`text-sm font-bold ${isActive || isCurrentBlock ? "text-[#1F76EB]" : "text-[#6B7280]"}`}>
                                {toTimeStr(block.startTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-lg font-bold ${isCompleted ? "line-through text-[#6B7280]" : "text-[#1F2937]"}`}>
                                {block.title}
                              </h3>
                              {isCompleted && (
                                <span className="text-xs bg-[#E8F0FC] text-[#1F2937] px-2 py-0.5 rounded-full font-medium">완료</span>
                              )}
                            </div>
                            {block.location && (
                              <p className="text-sm text-[#6B7280] flex items-center gap-1 mb-2">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {block.location}
                              </p>
                            )}
                            {/* 실제 소요 시간 표시 (완료된 블록) */}
                            {isCompleted && (
                              <p className="text-xs text-[#6B7280] flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">schedule</span>
                                실제 소요: {toDurationStr(block.duration)}
                              </p>
                            )}
                            {/* 진행 중 타이머 표시 */}
                            {isActive && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                                  <span>진행 중</span>
                                  <span>{progressPercent}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-[#E4E9F0] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#1F76EB] rounded-full transition-all duration-1000"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* 액션 버튼 */}
                          <div className="flex items-center gap-2 flex-shrink-0 self-start" onClick={(e) => e.stopPropagation()}>
                            {!isCompleted && (
                              <>
                                {isActive ? (
                                  <>
                                    <span className="font-mono text-lg font-bold text-[#1F76EB] tabular-nums">{toElapsedStr(elapsed)}</span>
                                    <button
                                      onClick={handleComplete}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1F76EB] text-[#ffffff] text-sm font-bold hover:bg-[#1F76EB] transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm">check</span>
                                      완료
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#EEF1F5] text-[#6B7280] text-sm font-medium">
                                      <span className="material-symbols-outlined text-sm">timer</span>
                                      {toDurationStr(block.duration)}
                                    </span>
                                    <button
                                      onClick={() => handleStart(block)}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1F76EB] text-[#ffffff] text-sm font-bold hover:opacity-90 transition-opacity"
                                    >
                                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                      시작
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </div>
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
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 rounded-full bg-[#1F76EB] text-[#ffffff] shadow-[0px_12px_32px_rgba(31,41,55,0.06)] flex items-center justify-center z-50"
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
      <EditScheduleDialog
        open={!!editingBlock}
        onOpenChange={(open) => { if (!open) setEditingBlock(null) }}
        block={editingBlock}
        onSuccess={() => fetchBlocks(currentDate)}
      />
    </div>
  )
}
