"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Square, Check } from "lucide-react"

interface ActiveTimerBarProps {
  taskName: string
  onPause: () => void
  onComplete: () => void
  onMinimize: () => void
}

export function ActiveTimerBar({ taskName, onPause, onComplete, onMinimize }: ActiveTimerBarProps) {
  const [seconds, setSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused])

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const handlePauseToggle = () => {
    setIsPaused(!isPaused)
    if (!isPaused) {
      onPause()
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-[#1a1d24] md:left-[200px]">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 animate-pulse rounded-full bg-brand" />
          <div>
            <div className="text-lg font-mono font-semibold text-text">{formatTime(seconds)}</div>
            <div className="text-xs text-text-sub">{taskName}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onMinimize} className="h-8 w-8 text-text-sub hover:text-text">
            <Square className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handlePauseToggle} className="text-text-sub hover:text-text">
            <Pause className="mr-1 h-4 w-4" />
            {isPaused ? "재개" : "일시정지"}
          </Button>
          <Button size="sm" onClick={onComplete} className="bg-brand hover:bg-brand-strong">
            <Check className="mr-1 h-4 w-4" />
            완료
          </Button>
        </div>
      </div>
    </div>
  )
}
