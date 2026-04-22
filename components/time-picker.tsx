"use client"

import { useEffect, useRef } from "react"

interface TimePickerProps {
  value: string // HH:MM (24h)
  onChange: (value: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5)

function parse(value: string) {
  const [h, m] = value.split(":").map(Number)
  const isPM = h >= 12
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return { isPM, h12, m }
}

function toHHMM(h12: number, isPM: boolean, m: number) {
  let h24 = h12
  if (isPM && h12 !== 12) h24 = h12 + 12
  if (!isPM && h12 === 12) h24 = 0
  return `${h24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

export function TimePicker({ value, onChange, open, onOpenChange }: TimePickerProps) {
  const { isPM, h12, m } = parse(value)
  const hourRef = useRef<HTMLDivElement>(null)
  const minRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    // 선택된 항목으로 스크롤
    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
      if (!ref.current) return
      const item = ref.current.children[index] as HTMLElement
      if (item) item.scrollIntoView({ block: "center", behavior: "instant" })
    }
    scrollTo(hourRef, HOURS.indexOf(h12))
    scrollTo(minRef, MINUTES.indexOf(m) >= 0 ? MINUTES.indexOf(m) : 0)
  }, [open, h12, m])

  const set = (newH12: number, newIsPM: boolean, newM: number) => {
    onChange(toHHMM(newH12, newIsPM, newM))
  }

  const displayTime = `${isPM ? "오후" : "오전"} ${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className={`w-full bg-white rounded-xl px-6 py-5 text-lg text-[#2a3433] text-left transition-all duration-300 outline-none ${
          open
            ? "shadow-[inset_0_0_0_2px_#006b64]"
            : "shadow-[inset_0_0_0_2px_rgba(0,107,100,0.12)] hover:shadow-[inset_0_0_0_2px_rgba(0,107,100,0.3)]"
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="material-symbols-outlined text-lg text-[#56615f]">schedule</span>
          {displayTime}
        </span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-[0px_12px_32px_rgba(42,52,51,0.12)] z-50 overflow-hidden">
          <div className="flex">
            {/* 오전 / 오후 */}
            <div className="flex flex-col gap-0 border-r border-[#f0f5f3] px-3 py-3 justify-start">
              {(["오전", "오후"] as const).map((label, i) => {
                const selected = i === 0 ? !isPM : isPM
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => set(h12, i === 1, m)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      selected
                        ? "bg-gradient-to-br from-[#006b64] to-[#7fe6db] text-white"
                        : "text-[#56615f] hover:bg-[#eef5f3]"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* 시 */}
            <div
              ref={hourRef}
              className="flex-1 flex flex-col gap-0.5 max-h-56 overflow-y-auto py-3 px-2 scrollbar-hide border-r border-[#f0f5f3]"
            >
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => set(h, isPM, m)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 text-center ${
                    h === h12
                      ? "bg-gradient-to-br from-[#006b64] to-[#7fe6db] text-white font-bold"
                      : "text-[#56615f] hover:bg-[#eef5f3]"
                  }`}
                >
                  {h.toString().padStart(2, "0")}
                </button>
              ))}
            </div>

            {/* 분 */}
            <div
              ref={minRef}
              className="flex-1 flex flex-col gap-0.5 max-h-56 overflow-y-auto py-3 px-2 scrollbar-hide"
            >
              {MINUTES.map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => set(h12, isPM, min)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 text-center ${
                    min === m || (MINUTES.indexOf(m) < 0 && min === 0)
                      ? "bg-gradient-to-br from-[#006b64] to-[#7fe6db] text-white font-bold"
                      : "text-[#56615f] hover:bg-[#eef5f3]"
                  }`}
                >
                  {min.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
