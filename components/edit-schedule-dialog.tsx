"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { scheduleApi } from "@/lib/api/schedule"
import type { ScheduleBlock } from "@/types/api"
import { TimePicker } from "@/components/time-picker"

interface EditScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  block: ScheduleBlock | null
  onSuccess?: () => void
}

const durations = [
  { label: "15분", value: 15 },
  { label: "30분", value: 30 },
  { label: "1시간", value: 60 },
  { label: "커스텀", value: 0 },
]

const quickTags = ["업무", "개인", "심부름", "학습"] as const

const toHHMM = (decimal: number) => {
  const h = Math.floor(decimal)
  const m = Math.round((decimal - h) * 60)
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

const toDecimal = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h + m / 60
}

const durationToMin = (hours: number) => Math.round(hours * 60)

export function EditScheduleDialog({ open, onOpenChange, block, onSuccess }: EditScheduleDialogProps) {
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [timePickerOpen, setTimePickerOpen] = useState(false)
  const [durationMin, setDurationMin] = useState(30)
  const [customDuration, setCustomDuration] = useState(30)
  const [selectedTag, setSelectedTag] = useState<string>("업무")
  const [location, setLocation] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !block) return
    setTitle(block.title)
    setStartTime(toHHMM(block.startTime))
    const minVal = durationToMin(block.duration)
    const preset = durations.find((d) => d.value === minVal && d.value !== 0)
    if (preset) {
      setDurationMin(preset.value)
      setCustomDuration(minVal)
    } else {
      setDurationMin(0)
      setCustomDuration(minVal > 0 ? minVal : 30)
    }
    setSelectedTag(block.tag ?? "업무")
    setLocation(block.location ?? "")
    setError(null)
  }, [open, block?.id])

  const effectiveDuration = durationMin === 0 ? customDuration : durationMin

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!block || !title.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const start = toDecimal(startTime)
      const durationHours = effectiveDuration / 60
      await scheduleApi.update(block.id, {
        title,
        startTime: start,
        endTime: start + durationHours,
        duration: durationHours,
        location: location || undefined,
        tag: selectedTag as "업무" | "개인" | "심부름" | "학습",
      })
      handleClose()
      onSuccess?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!block) return
    setDeleting(true)
    setError(null)
    try {
      await scheduleApi.delete(block.id)
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
      <DialogContent className="bg-white/90 backdrop-blur-3xl sm:max-w-2xl rounded-[2rem] shadow-[0px_12px_32px_rgba(42,52,51,0.06)] p-8 md:p-12 border border-[#a9b4b2]/15 gap-0">
        <div className="flex justify-between items-center mb-10">
          <div>
            <DialogTitle className="text-3xl font-bold tracking-tight text-[#2a3433]">블록 수정</DialogTitle>
            <p className="text-[#56615f] mt-2 text-sm">집중 세션을 수정하세요.</p>
          </div>
          <button onClick={handleClose} className="w-12 h-12 rounded-full bg-[#eef5f3] flex items-center justify-center text-[#56615f] hover:bg-[#d9e5e2] transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-sm rounded-xl px-4 py-3 mb-6">
            <span className="material-symbols-outlined text-base">error</span>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-8">
          {/* 제목 */}
          <section className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-[#56615f] uppercase tracking-wider">무엇에 집중하나요?</label>
            <input
              className="w-full bg-[#eef5f3]/50 text-2xl md:text-4xl font-bold text-[#2a3433] placeholder:text-[#a9b4b2]/60 rounded-xl p-6 outline-none focus:ring-2 focus:ring-[#006b64]/20 border-none"
              placeholder="예: 디자인 시스템 검토"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </section>

          {/* 시작 시간 */}
          <section className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-[#56615f] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">schedule</span>
              시작 시간
            </label>
            <TimePicker
              value={startTime}
              onChange={setStartTime}
              open={timePickerOpen}
              onOpenChange={setTimePickerOpen}
            />
          </section>

          {/* 소요 시간 */}
          <section className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-[#56615f] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">timer</span>
              소요 시간
            </label>
            <div className="flex flex-wrap gap-4">
              {durations.map((d) => (
                <label key={d.value} className="cursor-pointer">
                  <input type="radio" name="edit-duration" value={d.value} checked={durationMin === d.value} onChange={() => setDurationMin(d.value)} className="sr-only" />
                  <div className={`px-6 py-4 rounded-xl font-semibold text-lg transition-colors duration-300 ${durationMin === d.value ? "bg-[#cce8e4] text-[#3d5653]" : "bg-[#eef5f3] text-[#56615f] hover:bg-[#d9e5e2]"}`}>
                    {d.label}
                  </div>
                </label>
              ))}
            </div>
            {durationMin === 0 && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={5}
                  max={480}
                  className="w-32 bg-[#eef5f3] rounded-xl px-4 py-3 text-lg text-[#2a3433] outline-none focus:ring-2 focus:ring-[#006b64]/20 border-none"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(Number(e.target.value))}
                />
                <span className="text-[#56615f]">분</span>
              </div>
            )}
          </section>

          {/* 장소 */}
          <section className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-[#56615f] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">location_on</span>
              장소 (선택)
            </label>
            <input
              className="w-full bg-[#eef5f3]/50 rounded-xl px-6 py-4 text-base text-[#2a3433] placeholder:text-[#a9b4b2] outline-none focus:ring-2 focus:ring-[#006b64]/20 border-none"
              placeholder="예: 홈 오피스, Google Meet"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </section>

          {/* 태그 */}
          <section className="flex flex-col gap-4">
            <label className="text-xs font-semibold text-[#56615f] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">sell</span>
              태그
            </label>
            <div className="flex flex-wrap gap-3">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors duration-300 ${
                    selectedTag === tag
                      ? "bg-[#b7e7ff]/50 text-[#24566a] border border-[#b7e7ff]"
                      : "bg-[#eef5f3] text-[#56615f] hover:bg-[#d9e5e2]"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <div className="flex justify-between gap-4 pt-4 border-t border-[#e7f0ed]">
            <button
              onClick={handleDelete}
              disabled={deleting || submitting}
              className="px-6 py-4 rounded-xl text-[#b91c1c] font-semibold hover:bg-[#fef2f2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">delete</span>
              {deleting ? "삭제 중..." : "삭제"}
            </button>
            <div className="flex gap-4">
              <button onClick={handleClose} className="px-8 py-4 rounded-xl text-[#56615f] font-semibold hover:bg-[#eef5f3] transition-colors">
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || submitting || deleting}
                className="px-10 py-4 rounded-xl text-[#e2fffa] font-bold text-lg hover:opacity-90 shadow-sm transition-all bg-gradient-to-br from-[#006b64] to-[#7fe6db] disabled:opacity-50 disabled:cursor-not-allowed"
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
