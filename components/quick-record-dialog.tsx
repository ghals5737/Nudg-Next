"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Zap, Wind, Footprints, Music, Droplet, Brain, MoreHorizontal, ChevronDown } from "lucide-react"
import { useState } from "react"

interface QuickRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const moodEmojis = [
  { range: [-5, -4], emoji: "😭", label: "매우 나쁨" },
  { range: [-3, -2], emoji: "😢", label: "나쁨" },
  { range: [-1, 1], emoji: "😐", label: "보통" },
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
  const [copingMethod, setCopingMethod] = useState("")
  const [customCoping, setCustomCoping] = useState("")
  const [showAdditional, setShowAdditional] = useState(false)

  const currentMood = getMoodFromScore(moodScore[0])

  const copingMethods = [
    { id: "breathing", label: "관찰을 4-7-8", icon: Wind },
    { id: "walk", label: "5분 산책", icon: Footprints },
    { id: "music", label: "음악 듣기", icon: Music },
    { id: "water", label: "물 마시기", icon: Droplet },
    { id: "meditation", label: "명상하기", icon: Brain },
    { id: "more", label: "더보기", icon: MoreHorizontal },
  ]

  const handleSave = () => {
    // Handle save logic here
    console.log("[v0] Saving quick record:", { moodScore: moodScore[0], impulse, copingMethod, customCoping })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-background sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-text">
            <Zap className="h-5 w-5 text-warning" />
            빠른 기록
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mood Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-text">지금 기분은 어떠가요?</label>
            <div className="flex flex-col items-center gap-3">
              <span className="text-6xl">{currentMood.emoji}</span>
              <span className="text-sm text-text-sub">{currentMood.label}</span>
              <div className="w-full px-2">
                <Slider value={moodScore} onValueChange={setMoodScore} min={-5} max={5} step={1} className="w-full" />
                <div className="mt-2 flex justify-between text-xs text-text-sub">
                  <span>-5</span>
                  <span>0</span>
                  <span>+5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Impulse Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">지금 하고 싶은 행동은...</label>
            <Textarea
              placeholder="예: 스마트폰을 계속 확인하고 싶은 충동"
              value={impulse}
              onChange={(e) => setImpulse(e.target.value)}
              maxLength={500}
              className="min-h-[80px] resize-none border-border bg-card text-text placeholder:text-text-sub"
            />
            <div className="text-right text-xs text-text-sub">{impulse.length}/500</div>
          </div>

          {/* Coping Methods */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text">대처법</label>
            <div className="grid grid-cols-3 gap-2">
              {copingMethods.map((method) => {
                const Icon = method.icon
                return (
                  <Button
                    key={method.id}
                    variant={copingMethod === method.id ? "default" : "outline"}
                    className={`h-auto flex-col gap-2 py-4 ${
                      copingMethod === method.id
                        ? "border-brand bg-brand text-white hover:bg-brand-strong"
                        : "border-border bg-card text-text hover:bg-card-hover"
                    }`}
                    onClick={() => setCopingMethod(method.id)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{method.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Custom Coping Input */}
          <div className="space-y-2">
            <Input
              placeholder="또는 직접 입력..."
              value={customCoping}
              onChange={(e) => setCustomCoping(e.target.value)}
              className="border-border bg-card text-text placeholder:text-text-sub"
            />
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <button
              onClick={() => setShowAdditional(!showAdditional)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 text-sm font-medium text-text transition-colors hover:bg-card-hover"
            >
              <span>추가 정보</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdditional ? "rotate-180" : ""}`} />
            </button>
            {showAdditional && (
              <div className="space-y-3 rounded-lg border border-border bg-card p-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-sub">장소</label>
                  <Input
                    placeholder="예: 집, 사무실"
                    className="border-border bg-background text-text placeholder:text-text-sub"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-sub">메모</label>
                  <Textarea
                    placeholder="추가 메모를 입력하세요"
                    className="min-h-[60px] resize-none border-border bg-background text-text placeholder:text-text-sub"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-border pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 text-text-sub">
            취소
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-brand hover:bg-brand-strong">
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
