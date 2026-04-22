"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { goalsApi } from "@/lib/api/goals"

interface NewGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function NewGoalDialog({ open, onOpenChange, onSuccess }: NewGoalDialogProps) {
  const [title, setTitle] = useState("")
  const [steps, setSteps] = useState<string[]>(["", ""])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addStep = () => setSteps([...steps, ""])

  const updateStep = (i: number, value: string) => {
    const updated = [...steps]
    updated[i] = value
    setSteps(updated)
  }

  const removeStep = (i: number) => setSteps(steps.filter((_, idx) => idx !== i))

  const handleClose = () => {
    onOpenChange(false)
    setTitle("")
    setSteps(["", ""])
    setError(null)
  }

  const handleSubmit = async () => {
    if (!title.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await goalsApi.create({ title, steps: steps.filter(Boolean) })
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
      <DialogContent className="bg-[#f6faf8] sm:max-w-2xl rounded-[3rem] shadow-[0px_12px_32px_rgba(42,52,51,0.06)] border-none p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-8 pt-10 pb-6 bg-[#eef5f3]/50">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 text-[#006b64]">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <DialogTitle className="font-bold text-sm tracking-widest text-[#005e57] uppercase">새 목표</DialogTitle>
            </div>
            <button onClick={handleClose} className="text-[#56615f] hover:text-[#2a3433] transition-colors p-2 rounded-full hover:bg-[#e7f0ed]/50">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="relative group mt-6">
            <input
              className="w-full bg-transparent border-none p-0 text-3xl md:text-4xl font-extrabold text-[#2a3433] placeholder:text-[#56615f]/40 focus:ring-0 focus:outline-none"
              placeholder="무엇을 이루고 싶으신가요?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-[#006b64] to-[#7fe6db] group-focus-within:w-full transition-all duration-500 ease-out" />
          </div>
          <p className="mt-4 text-[#56615f] text-base leading-relaxed max-w-lg">
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

          <div className="flex items-center gap-3 mb-6 text-[#56615f]">
            <span className="material-symbols-outlined text-xl">route</span>
            <h3 className="font-bold text-lg text-[#2a3433]">실행 스텝</h3>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#eef5f3] flex items-center justify-center text-[#56615f] font-semibold text-sm">{i + 1}</div>
                </div>
                <div className="flex-1 bg-[#eef5f3] rounded-[1.5rem] p-4 transition-all duration-300 group-hover:bg-[#e7f0ed]">
                  <input
                    className="w-full bg-transparent border-none p-0 text-lg text-[#2a3433] focus:ring-0 focus:outline-none placeholder:text-[#56615f]/50"
                    placeholder={i === 0 ? "첫 번째 스텝을 입력하세요" : "다음 스텝은 무엇인가요?"}
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                  />
                </div>
                {steps.length > 1 && (
                  <button onClick={() => removeStep(i)} className="mt-2 text-[#56615f]/40 hover:text-[#a83836] transition-colors p-2 opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                )}
              </div>
            ))}
            <div className="flex items-center gap-4 mt-2 ml-1">
              <div className="flex-shrink-0 w-8 flex justify-center">
                <div className="w-2 h-2 rounded-full bg-[#e1eae8]" />
              </div>
              <button onClick={addStep} className="flex items-center gap-2 text-[#006b64] hover:text-[#005e57] transition-colors py-2 font-medium">
                <span className="material-symbols-outlined text-xl">add_circle</span>
                스텝 추가
              </button>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-white border-t border-[#eef5f3]/50 flex justify-end gap-4">
          <button onClick={handleClose} className="px-6 py-4 rounded-full text-[#56615f] font-semibold hover:bg-[#eef5f3] transition-colors">
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || submitting}
            className="px-8 py-4 rounded-full text-[#e2fffa] font-semibold shadow-[0px_8px_24px_rgba(0,107,100,0.15)] hover:shadow-[0px_12px_32px_rgba(0,107,100,0.2)] transition-all duration-300 hover:-translate-y-0.5 bg-gradient-to-br from-[#006b64] to-[#7fe6db] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {submitting ? "저장 중..." : "목표 심기"}
            {!submitting && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
