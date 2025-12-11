"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Clock } from "lucide-react"

interface NewRoutineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewRoutineDialog({ open, onOpenChange }: NewRoutineDialogProps) {
  const [title, setTitle] = useState("")
  const [frequency, setFrequency] = useState<"매일" | "매주" | "격주" | "커스텀">("매일")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [time, setTime] = useState("09:00")
  const [alarmEnabled, setAlarmEnabled] = useState(false)

  const days = ["일", "월", "화", "수", "목", "금", "토"]

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "오후" : "오전"
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
    return `${period} ${displayHour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  const handleSubmit = () => {
    // TODO: 실제로 루틴을 저장하는 로직
    console.log("새 루틴 생성:", { title, frequency, selectedDays, time, alarmEnabled })
    onOpenChange(false)
    // Reset form
    setTitle("")
    setFrequency("매일")
    setSelectedDays([])
    setTime("09:00")
    setAlarmEnabled(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-8">
        <DialogHeader>
          <DialogTitle className="text-[#1A1B1E] text-lg font-semibold">새 루틴</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 루틴 제목 */}
          <div className="space-y-2">
            <Label className="text-[#343A40] text-sm font-medium">루틴 제목</Label>
            <Input
              placeholder="예: 아침 운동, 독서 시간..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white text-[#343A40] border-[#E9ECEF] h-12 rounded-lg focus:border-[#4DB6AC] focus:ring-[#4DB6AC] focus:ring-[3px] focus:ring-opacity-10"
            />
          </div>

          {/* 빈도 */}
          <div className="space-y-3">
            <Label className="text-[#343A40] text-sm font-medium">빈도</Label>
            <div className="grid grid-cols-4 gap-2">
              {(["매일", "매주", "격주", "커스텀"] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    frequency === freq
                      ? "bg-[#4DB6AC] text-white shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                      : "bg-[#F1F3F5] text-[#343A40] hover:bg-[#E9ECEF]"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* 요일 */}
          {frequency === "매일" && (
            <div className="space-y-3">
              <Label className="text-[#343A40] text-sm font-medium">요일</Label>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDays.includes(day)
                        ? "bg-[#4DB6AC] text-white shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                        : "bg-[#F1F3F5] text-[#343A40] hover:bg-[#E9ECEF]"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 시간 */}
          <div className="space-y-2">
            <Label className="text-[#343A40] text-sm font-medium">시간</Label>
            <div className="relative">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white text-[#343A40] border border-[#E9ECEF] h-12 w-full rounded-lg pl-4 pr-10 focus:border-[#4DB6AC] focus:ring-[#4DB6AC] focus:ring-[3px] focus:ring-opacity-10 outline-none"
                style={{ color: "transparent" }}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#343A40] text-sm">
                {formatTime(time)}
              </div>
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#868E96] pointer-events-none" />
            </div>
          </div>

          {/* 알람 */}
          <div className="flex items-center justify-between">
            <Label className="text-[#343A40] text-sm font-medium">알람</Label>
            <Switch
              checked={alarmEnabled}
              onCheckedChange={setAlarmEnabled}
              className="data-[state=checked]:bg-[#4DB6AC]"
            />
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
            생성
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

