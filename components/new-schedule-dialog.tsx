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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const templates = [
    { label: "회의", color: "#7986CB" }, // blue
    { label: "집중 작업", color: "#4DB6AC" }, // green
    { label: "학습", color: "#9575CD" }, // purple
    { label: "운동", color: "#E57373" }, // red
    { label: "휴식", color: "#FFD54F" }, // yellow
    { label: "식사", color: "#FF8A65" }, // orange
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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "오후" : "오전"
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${period} ${displayHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  const handleTemplateClick = (template: (typeof templates)[0]) => {
    setTitle(template.label)
    setSelectedTemplate(template.label)
  }

  const handleSubmit = () => {
    // TODO: 실제로 일정을 저장하는 로직
    console.log("새 블록 생성:", { title, startTime, duration })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-8">
        <DialogHeader>
          <DialogTitle className="text-[#1A1B1E] text-lg font-semibold">새 블록 만들기</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 빠른 템플릿 */}
          <div className="space-y-3">
            <Label className="text-[#343A40] text-sm font-medium">빠른 템플릿</Label>
            <div className="grid grid-cols-3 gap-2">
              {templates.map((template) => (
                <button
                  key={template.label}
                  onClick={() => handleTemplateClick(template)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#F1F3F5] hover:bg-[#E9ECEF] transition-colors text-left"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: template.color }} />
                  <span className="text-[#343A40] text-sm">{template.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <Label className="text-[#343A40] text-sm font-medium">제목</Label>
            <Input
              placeholder="작업 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white text-[#343A40] border-[#E9ECEF] h-12 rounded-lg focus:border-[#4DB6AC] focus:ring-[#4DB6AC] focus:ring-[3px] focus:ring-opacity-10"
            />
          </div>

          {/* 시작 시간 */}
          <div className="space-y-2">
            <Label className="text-[#343A40] text-sm font-medium">시작 시간</Label>
            <div className="relative">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-white text-[#343A40] border border-[#E9ECEF] h-12 w-full rounded-lg pl-4 pr-10 focus:border-[#4DB6AC] focus:ring-[#4DB6AC] focus:ring-[3px] focus:ring-opacity-10 outline-none"
                style={{ color: "transparent" }}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#343A40] text-sm">
                {formatTime(startTime)}
              </div>
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96] pointer-events-none" />
            </div>
          </div>

          {/* 소요 시간 */}
          <div className="space-y-3">
            <Label className="text-[#343A40] text-sm font-medium">소요 시간</Label>
            <div className="grid grid-cols-4 gap-2">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    duration === d.value
                      ? "bg-[#4DB6AC] text-white shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                      : "bg-[#F1F3F5] text-[#343A40] hover:bg-[#E9ECEF]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button className="text-[#4DB6AC] text-sm hover:underline">직접 입력</button>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[#E9ECEF]">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm text-[#868E96] hover:text-[#343A40] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#4DB6AC] hover:bg-[#3AA996] text-white rounded-lg text-sm font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)] transition-colors"
          >
            만들기
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
