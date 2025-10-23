"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Clock } from "lucide-react"

interface NewScheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewScheduleDialog({ open, onOpenChange }: NewScheduleDialogProps) {
  const [title, setTitle] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [duration, setDuration] = useState(60) // in minutes
  const [color, setColor] = useState("blue")

  const templates = [
    { label: "회의", color: "blue" },
    { label: "집중 작업", color: "green" },
    { label: "학습", color: "purple" },
    { label: "운동", color: "red" },
    { label: "휴식", color: "yellow" },
    { label: "식사", color: "orange" },
  ]

  const durations = [
    { label: "15분", value: 15 },
    { label: "30분", value: 30 },
    { label: "45분", value: 45 },
    { label: "1시간", value: 60 },
    { label: "1.5시간", value: 90 },
    { label: "2시간", value: 120 },
    { label: "3시간", value: 180 },
    { label: "4시간", value: 240 },
  ]

  const colors = [
    { value: "blue", label: "파란색", class: "bg-[#7AA2FF]" },
    { value: "orange", label: "주황색", class: "bg-[#FF9F66]" },
    { value: "green", label: "초록색", class: "bg-[#66D9A8]" },
    { value: "purple", label: "보라색", class: "bg-[#B794F6]" },
    { value: "pink", label: "분홍색", class: "bg-[#F472B6]" },
    { value: "red", label: "빨간색", class: "bg-[#FF6B6B]" },
    { value: "teal", label: "청록색", class: "bg-[#4FD1C5]" },
    { value: "yellow", label: "노란색", class: "bg-[#FFD93D]" },
  ]

  const getColorClass = (colorValue: string) => {
    return colors.find((c) => c.value === colorValue)?.class || "bg-brand"
  }

  const getColorDot = (colorValue: string) => {
    const templateColors: Record<string, string> = {
      회의: "bg-[#7AA2FF]",
      "집중 작업": "bg-[#66D9A8]",
      학습: "bg-[#B794F6]",
      운동: "bg-[#FF6B6B]",
      휴식: "bg-[#FFD93D]",
      식사: "bg-[#FF9F66]",
    }
    return templateColors[colorValue] || "bg-brand"
  }

  const calculateEndTime = () => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes + duration
    const endHours = Math.floor(totalMinutes / 60) % 24
    const endMinutes = totalMinutes % 60
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`
  }

  const formatDuration = () => {
    const hours = Math.floor(duration / 60)
    const mins = duration % 60
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`
    if (hours > 0) return `${hours}h 0m`
    return `${mins}m`
  }

  const handleTemplateClick = (template: (typeof templates)[0]) => {
    setTitle(template.label)
    setColor(template.color)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text">새 블록 만들기</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-text-secondary text-sm">빠른 템플릿</Label>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((template) => (
                <button
                  key={template.label}
                  onClick={() => handleTemplateClick(template)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background hover:bg-background-strong transition-colors text-left"
                >
                  <div className={`w-2 h-2 rounded-full ${getColorDot(template.label)}`} />
                  <span className="text-text text-sm">{template.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">제목</Label>
            <Input
              placeholder="여러 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background text-text border-border"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">시작 시간</Label>
            <div className="relative">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-background text-text border-border pl-10"
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-text-secondary text-sm">소요 시간</Label>
            <div className="grid grid-cols-4 gap-2">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    duration === d.value ? "bg-brand text-white" : "bg-background text-text hover:bg-background-strong"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button className="text-brand text-sm hover:underline">직접 입력</button>
          </div>

          <div className="space-y-3">
            <Label className="text-text-secondary text-sm">색상</Label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    color === c.value ? "bg-background-strong" : "bg-background hover:bg-background-strong"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${c.class}`} />
                  <span className="text-text text-sm">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-text-secondary text-sm">미리보기</Label>
            <div
              className={`rounded-lg p-4 border-l-4 bg-background ${getColorClass(color).replace("bg-", "border-")}`}
            >
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-text-secondary mt-0.5" />
                <div>
                  <div className="text-text font-medium">{title || "작업 제목"}</div>
                  <div className="text-text-secondary text-sm mt-1">
                    {startTime} - {calculateEndTime()} • {formatDuration()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
