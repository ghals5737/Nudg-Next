"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useState } from "react"
import { routinesApi } from "@/lib/api/routines"

interface NewRoutineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const dayLabels = ["월", "화", "수", "목", "금", "토", "일"]

export function NewRoutineDialog({ open, onOpenChange, onSuccess }: NewRoutineDialogProps) {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("07:00")
  const [duration, setDuration] = useState(15)
  const [selectedDays, setSelectedDays] = useState([true, true, true, true, true, false, false])
  const [smartReminders, setSmartReminders] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleDay = (i: number) => {
    const updated = [...selectedDays]
    updated[i] = !updated[i]
    setSelectedDays(updated)
  }

  const handleClose = () => {
    onOpenChange(false)
    setTitle("")
    setTime("07:00")
    setDuration(15)
    setSelectedDays([true, true, true, true, true, false, false])
    setError(null)
  }

  const handleSubmit = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await routinesApi.create({ title, time, duration, days: selectedDays, smartReminders })
      handleClose()
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#f6faf8] sm:max-w-2xl rounded-[2rem] shadow-[0px_12px_32px_rgba(42,52,51,0.06)] border-none p-0 gap-0 overflow-hidden">
        <div className="px-8 pt-10 pb-6 max-h-[90vh] overflow-y-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#2a3433] mb-4">새 루틴</h1>
            <p className="text-lg text-[#56615f] leading-relaxed">부드러운 리듬을 만들어 보세요.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-sm rounded-xl px-4 py-3 mb-6">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <div className="space-y-10">
            {/* 이름 */}
            <div className="flex flex-col gap-3">
              <label className="text-xl font-semibold text-[#2a3433] tracking-tight">이름</label>
              <div className="rounded-xl bg-white border-none shadow-[inset_0_0_0_2px_rgba(0,107,100,0.12)] focus-within:shadow-[inset_0_0_0_2px_#006b64] transition-all duration-300">
                <input
                  className="w-full bg-transparent border-none rounded-xl px-6 py-5 text-lg text-[#2a3433] focus:ring-0 focus:outline-none placeholder-[#a9b4b2]"
                  placeholder="예: 아침 수분 보충"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* 시간 & 소요시간 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-xl font-semibold text-[#2a3433] tracking-tight">시작 시간</label>
                <div className="rounded-xl bg-white shadow-[inset_0_0_0_2px_rgba(0,107,100,0.12)] focus-within:shadow-[inset_0_0_0_2px_#006b64] transition-all">
                  <input
                    type="time"
                    className="w-full bg-transparent border-none rounded-xl px-6 py-5 text-lg text-[#2a3433] focus:ring-0 focus:outline-none"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xl font-semibold text-[#2a3433] tracking-tight">소요 시간 (분)</label>
                <div className="rounded-xl bg-white shadow-[inset_0_0_0_2px_rgba(0,107,100,0.12)] focus-within:shadow-[inset_0_0_0_2px_#006b64] transition-all">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    className="w-full bg-transparent border-none rounded-xl px-6 py-5 text-lg text-[#2a3433] focus:ring-0 focus:outline-none"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* 스케줄 */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <label className="text-xl font-semibold text-[#2a3433] tracking-tight">스케줄</label>
                <span className="text-sm text-[#56615f] bg-[#eef5f3] px-3 py-1 rounded-full">
                  {selectedDays.filter(Boolean).length === 7 ? "매일" : `주 ${selectedDays.filter(Boolean).length}회`}
                </span>
              </div>
              <div className="flex justify-between items-center bg-[#eef5f3] p-4 rounded-xl">
                {dayLabels.map((day, i) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`w-11 h-11 rounded-full font-semibold text-base flex items-center justify-center transition-all duration-300 ${
                      selectedDays[i]
                        ? "bg-[#006b64] text-[#e2fffa] shadow-sm hover:opacity-90"
                        : "bg-[#d9e5e2] text-[#56615f] hover:bg-[#e7f0ed]"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* 스마트 리마인더 */}
            <div className="flex flex-col gap-4 bg-[#eef5f3] p-6 rounded-xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#7fe6db] rounded-full opacity-20 blur-2xl pointer-events-none" />
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006b64] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
                  <h3 className="text-xl font-semibold text-[#2a3433] tracking-tight">스마트 리마인더</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={smartReminders} onChange={(e) => setSmartReminders(e.target.checked)} />
                  <div className="w-14 h-8 bg-[#d9e5e2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-[#a9b4b2]/20 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-[#006b64]" />
                </label>
              </div>
              <p className="text-base text-[#56615f] leading-relaxed mt-1 max-w-[90%] relative z-10">
                집중 중일 때는 방해하지 않는 부드러운 알림으로 루틴을 기억시켜 드립니다.
              </p>
            </div>

            <div className="pb-4 flex gap-4 items-center">
              <button onClick={handleClose} className="flex-1 bg-[#d9e5e2] text-[#2a3433] font-semibold text-lg py-5 px-8 rounded-xl hover:bg-[#e7f0ed] transition-colors">
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || submitting}
                className="flex-[2] bg-gradient-to-br from-[#006b64] to-[#7fe6db] text-[#e2fffa] font-bold text-lg py-5 px-8 rounded-xl shadow-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "저장 중..." : "루틴 만들기"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
