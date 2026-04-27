"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { routinesApi } from "@/lib/api/routines"
import { TimePicker } from "@/components/time-picker"
import type { RoutineWithRhythm } from "@/types/api"

interface EditRoutineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routine: RoutineWithRhythm | null
  onSuccess?: () => void
}

const dayLabels = ["월", "화", "수", "목", "금", "토", "일"]

export function EditRoutineDialog({ open, onOpenChange, routine, onSuccess }: EditRoutineDialogProps) {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("07:00")
  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [duration, setDuration] = useState(15)
  const [selectedDays, setSelectedDays] = useState([true, true, true, true, true, false, false])
  const [smartReminders, setSmartReminders] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !routine) return
    setTitle(routine.title)
    setTime(routine.time)
    setDuration(routine.duration)
    setSelectedDays(routine.days.length === 7 ? routine.days : [true, true, true, true, true, false, false])
    setSmartReminders(routine.smartReminders)
    setTimePickerOpen(false)
    setError(null)
  }, [open, routine?.id])

  const toggleDay = (i: number) => {
    const updated = [...selectedDays]
    updated[i] = !updated[i]
    setSelectedDays(updated)
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimePickerOpen(false)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!routine || !title.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await routinesApi.update(routine.id, { title, time, duration, days: selectedDays, smartReminders })
      handleClose()
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!routine) return
    setDeleting(true)
    setError(null)
    try {
      await routinesApi.delete(routine.id)
      handleClose()
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 중 오류가 발생했습니다.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#EEF1F5] sm:max-w-2xl rounded-[2rem] shadow-[0px_12px_32px_rgba(31,41,55,0.06)] border-none p-0 gap-0 overflow-hidden">
        <div className="px-8 pt-10 pb-6 max-h-[90vh] overflow-y-auto">
          <div className="mb-12">
            <DialogTitle className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1F2937] mb-4">루틴 수정</DialogTitle>
            <p className="text-lg text-[#6B7280] leading-relaxed">루틴을 원하는 대로 조정하세요.</p>
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
              <label className="text-xl font-semibold text-[#1F2937] tracking-tight">이름</label>
              <div className="rounded-xl bg-white border-none shadow-[inset_0_0_0_2px_rgba(31,118,235,0.12)] focus-within:shadow-[inset_0_0_0_2px_#1F76EB] transition-all duration-300">
                <input
                  className="w-full bg-transparent border-none rounded-xl px-6 py-5 text-lg text-[#1F2937] focus:ring-0 focus:outline-none placeholder-[#6B7280]"
                  placeholder="예: 아침 수분 보충"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* 시간 & 소요시간 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-xl font-semibold text-[#1F2937] tracking-tight">시작 시간</label>
                <TimePicker
                  value={time}
                  onChange={setTime}
                  open={timePickerOpen}
                  onOpenChange={setTimePickerOpen}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xl font-semibold text-[#1F2937] tracking-tight">소요 시간 (분)</label>
                <div className="rounded-xl bg-white shadow-[inset_0_0_0_2px_rgba(31,118,235,0.12)] focus-within:shadow-[inset_0_0_0_2px_#1F76EB] transition-all">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    className="w-full bg-transparent border-none rounded-xl px-6 py-5 text-lg text-[#1F2937] focus:ring-0 focus:outline-none"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* 스케줄 */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <label className="text-xl font-semibold text-[#1F2937] tracking-tight">스케줄</label>
                <span className="text-sm text-[#6B7280] bg-[#EEF1F5] px-3 py-1 rounded-full">
                  {selectedDays.filter(Boolean).length === 7 ? "매일" : `주 ${selectedDays.filter(Boolean).length}회`}
                </span>
              </div>
              <div className="flex justify-between items-center bg-[#EEF1F5] p-4 rounded-xl">
                {dayLabels.map((day, i) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={`w-11 h-11 rounded-full font-semibold text-base flex items-center justify-center transition-all duration-300 ${
                      selectedDays[i]
                        ? "bg-[#1F76EB] text-[#ffffff] shadow-sm hover:opacity-90"
                        : "bg-[#E4E9F0] text-[#6B7280] hover:bg-[#EEF1F5]"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* 스마트 리마인더 */}
            <div className="flex flex-col gap-4 bg-[#EEF1F5] p-6 rounded-xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#E8F0FC] rounded-full opacity-20 blur-2xl pointer-events-none" />
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#1F76EB] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
                  <h3 className="text-xl font-semibold text-[#1F2937] tracking-tight">스마트 리마인더</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={smartReminders} onChange={(e) => setSmartReminders(e.target.checked)} />
                  <div className="w-14 h-8 bg-[#E4E9F0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-[#6B7280]/20 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-sm peer-checked:bg-[#1F76EB]" />
                </label>
              </div>
              <p className="text-base text-[#6B7280] leading-relaxed mt-1 max-w-[90%] relative z-10">
                집중 중일 때는 방해하지 않는 부드러운 알림으로 루틴을 기억시켜 드립니다.
              </p>
            </div>

            <div className="pb-4 flex gap-4 items-center">
              <button
                onClick={handleDelete}
                disabled={deleting || submitting}
                className="px-5 py-5 rounded-xl text-[#b91c1c] font-semibold hover:bg-[#fef2f2] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                {deleting ? "삭제 중..." : "삭제"}
              </button>
              <button onClick={handleClose} className="flex-1 bg-[#E4E9F0] text-[#1F2937] font-semibold text-lg py-5 px-8 rounded-xl hover:bg-[#EEF1F5] transition-colors">
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || submitting || deleting}
                className="flex-[2] bg-[#1F76EB] text-[#ffffff] font-bold text-lg py-5 px-8 rounded-xl shadow-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
