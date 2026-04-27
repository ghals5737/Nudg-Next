"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Zap, Wind, Footprints, Music, Droplet, Brain, MoreHorizontal } from "lucide-react"
import { useState } from "react"

interface QuickRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const moodEmojis = [
  { range: [-5, -4], emoji: "😩", label: "매우 나쁨" },
  { range: [-3, -2], emoji: "😐", label: "나쁨" },
  { range: [-1, 1], emoji: "😐", label: "나쁨" },
  { range: [2, 3], emoji: "🙂", label: "좋음" },
  { range: [4, 5], emoji: "😊", label: "매우 좋음" },
]

function getMoodFromScore(score: number) {
  const mood = moodEmojis.find(({ range }) => score >= range[0] && score <= range[1])
  return mood || moodEmojis[2]
}

export function QuickRecordDialog({ open, onOpenChange }: QuickRecordDialogProps) {
  const [moodScore, setMoodScore] = useState([0])
  const [impulse, setImpulse] = useState("")
  const [selectedCoping, setSelectedCoping] = useState<string | null>(null)

  const currentMood = getMoodFromScore(moodScore[0])

  const copingMethods = [
    { id: "breathing", label: "김호흡 4-7-8", icon: Wind },
    { id: "walk", label: "5분 산책", icon: Footprints },
    { id: "water", label: "물 마시기", icon: Droplet },
    { id: "meditation", label: "명상하기", icon: Brain },
    { id: "music", label: "음악 듣기", icon: Music },
    { id: "more", label: "더보기", icon: MoreHorizontal },
  ]

  const handleSave = () => {
    // TODO: 실제로 기록을 저장하는 로직
    console.log("빠른 기록 저장:", { moodScore: moodScore[0], impulse, copingMethod: selectedCoping })
    onOpenChange(false)
    // Reset form
    setMoodScore([0])
    setImpulse("")
    setSelectedCoping(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-[560px] rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#1F2937] text-lg font-semibold">
            <Zap className="h-5 w-5 text-[#1F76EB]" />
            빠른 기록
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mood Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-[#1F2937]">지금 기분은 어떤가요?</label>
            <div className="flex flex-col items-center gap-3">
              <span className="text-6xl">{currentMood.emoji}</span>
              <span className="text-sm text-[#1F2937]">{currentMood.label}</span>
              <div className="w-full px-2">
                <Slider
                  value={moodScore}
                  onValueChange={setMoodScore}
                  min={-5}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="mt-2 flex justify-between text-xs text-[#6B7280]">
                  <span>-5</span>
                  <span>0</span>
                  <span>+5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Impulse Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F2937]">지금 하고 싶은 행동은...</label>
            <Textarea
              placeholder="예: 스마트폰을 계속 확인하고 싶은 충동"
              value={impulse}
              onChange={(e) => setImpulse(e.target.value)}
              maxLength={500}
              className="min-h-[100px] resize-none border-[#E4E9F0] bg-white text-[#1F2937] placeholder:text-[#6B7280] focus:border-[#1F76EB] focus:ring-[#1F76EB] focus:ring-[3px] focus:ring-opacity-10 rounded-lg"
            />
            <div className="text-right text-xs text-[#6B7280]">{impulse.length}/500</div>
          </div>

          {/* Coping Methods */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#1F2937]">대처법</label>
            <div className="grid grid-cols-3 gap-3">
              {copingMethods.map((method) => {
                const Icon = method.icon
                const isSelected = selectedCoping === method.id
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedCoping(method.id)}
                    className={`h-24 flex flex-col items-center justify-center gap-2 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-[#1F76EB] bg-[#E8F0FC] text-[#1F76EB] shadow-[0_2px_6px_rgba(31,118,235,0.2)]"
                        : "border-[#E4E9F0] bg-white text-[#1F2937] hover:border-[#1F76EB] hover:bg-[#EEF1F5]"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{method.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[#E4E9F0]">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#1F76EB] hover:bg-[#1F76EB] text-white rounded-lg text-sm font-semibold shadow-[0_2px_6px_rgba(31,118,235,0.2)] transition-colors"
          >
            저장
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
