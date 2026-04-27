"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { goalsApi } from "@/lib/api/goals"
import type { Goal } from "@/types/api"

interface EditGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: Goal | null
  onSuccess?: () => void
}

export function EditGoalDialog({ open, onOpenChange, goal, onSuccess }: EditGoalDialogProps) {
  const [title, setTitle] = useState("")
  const [steps, setSteps] = useState<{ id?: string; label: string; done: boolean }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !goal) return
    setTitle(goal.title)
    setSteps(goal.steps.map((s) => ({ id: s.id, label: s.label, done: s.done })))
    setError(null)
  }, [open, goal?.id])

  const addStep = () => setSteps([...steps, { label: "", done: false }])

  const updateStep = (i: number, label: string) => {
    const updated = [...steps]
    updated[i] = { ...updated[i], label }
    setSteps(updated)
  }

  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i))

  const handleClose = () => {
    onOpenChange(false)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!goal || !title.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await goalsApi.update(goal.id, {
        title,
        steps: steps.filter((s) => s.label.trim()).map((s) => s.label),
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
    if (!goal) return
    setDeleting(true)
    setError(null)
    try {
      await goalsApi.delete(goal.id)
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
      <DialogContent showCloseButton={false} className="bg-[#EEF1F5] sm:max-w-2xl rounded-[3rem] shadow-[0px_12px_32px_rgba(31,41,55,0.06)] border-none p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-8 pt-10 pb-6 bg-[#EEF1F5]/50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 text-[#1F76EB]">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <DialogTitle className="font-bold text-sm tracking-widest text-[#1F76EB] uppercase">목표 수정</DialogTitle>
            </div>
            <button onClick={handleClose} className="text-[#6B7280] hover:text-[#1F2937] transition-colors p-2 rounded-full hover:bg-[#EEF1F5]/50">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="relative group mt-6">
            <input
              className="w-full bg-transparent border-none p-0 text-3xl md:text-4xl font-extrabold text-[#1F2937] placeholder:text-[#6B7280]/40 focus:ring-0 focus:outline-none"
              placeholder="무엇을 이루고 싶으신가요?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-[#1F76EB] group-focus-within:w-full transition-all duration-500 ease-out" />
          </div>
          <p className="mt-4 text-[#6B7280] text-base leading-relaxed max-w-lg">
            큰 목표를 작은 스텝으로 나눠보세요.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 bg-white">
          {error && (
            <div className="flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-sm rounded-xl px-4 py-3 mb-4">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 mb-6 text-[#6B7280]">
            <span className="material-symbols-outlined text-xl">route</span>
            <h3 className="font-bold text-lg text-[#1F2937]">실행 스텝</h3>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 group/step">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#EEF1F5] flex items-center justify-center text-[#6B7280] font-semibold text-sm">{i + 1}</div>
                </div>
                <div className="flex-1 bg-[#EEF1F5] rounded-[1.5rem] p-4 transition-all duration-300 group-hover/step:bg-[#EEF1F5]">
                  <input
                    className="w-full bg-transparent border-none p-0 text-lg text-[#1F2937] focus:ring-0 focus:outline-none placeholder:text-[#6B7280]/50"
                    placeholder={i === 0 ? "첫 번째 스텝을 입력하세요" : "다음 스텝은 무엇인가요?"}
                    value={step.label}
                    onChange={(e) => updateStep(i, e.target.value)}
                  />
                </div>
                {steps.length > 1 && (
                  <button onClick={() => removeStep(i)} className="mt-2 text-[#6B7280]/40 hover:text-[#a83836] transition-colors p-2 opacity-0 group-hover/step:opacity-100">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </div>
            ))}
            <div className="flex items-center gap-4 mt-2 ml-1">
              <div className="flex-shrink-0 w-8 flex justify-center">
                <div className="w-2 h-2 rounded-full bg-[#E4E9F0]" />
              </div>
              <button onClick={addStep} className="flex items-center gap-2 text-[#1F76EB] hover:text-[#1F76EB] transition-colors py-2 font-medium">
                <span className="material-symbols-outlined text-xl">add_circle</span>
                스텝 추가
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-white border-t border-[#EEF1F5]/50 flex justify-between gap-4">
          <button
            onClick={handleDelete}
            disabled={deleting || submitting}
            className="px-5 py-4 rounded-full text-[#b91c1c] font-semibold hover:bg-[#fef2f2] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            {deleting ? "삭제 중..." : "삭제"}
          </button>
          <div className="flex gap-3">
            <button onClick={handleClose} className="px-6 py-4 rounded-full text-[#6B7280] font-semibold hover:bg-[#EEF1F5] transition-colors">
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || submitting || deleting}
              className="px-8 py-4 rounded-full text-[#ffffff] font-semibold shadow-[0px_8px_24px_rgba(31,118,235,0.15)] hover:shadow-[0px_12px_32px_rgba(31,118,235,0.2)] transition-all duration-300 hover:-translate-y-0.5 bg-[#1F76EB] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {submitting ? "저장 중..." : "저장"}
              {!submitting && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
