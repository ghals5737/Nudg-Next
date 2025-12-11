"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"

type NewGoalDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const colors = [
  { name: "블루", value: "blue", color: "#7986CB" },
  { name: "그린", value: "green", color: "#4DB6AC" },
  { name: "옐로우", value: "yellow", color: "#FFD54F" },
  { name: "퍼플", value: "purple", color: "#9575CD" },
  { name: "핑크", value: "pink", color: "#F06292" },
  { name: "오렌지", value: "orange", color: "#FF8A65" },
  { name: "시안", value: "cyan", color: "#4DD0E1" },
  { name: "레드", value: "red", color: "#E57373" },
]

const quickTags = ["업무", "개인", "학습", "건강", "취미", "중요", "긴급", "루틴", "장기", "단기"]

export function NewGoalDialog({ open, onOpenChange }: NewGoalDialogProps) {
  const [title, setTitle] = useState("")
  const [selectedColor, setSelectedColor] = useState("blue")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleQuickTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
    }
  }

  const handleCreate = () => {
    // TODO: 실제로 목표를 생성하는 로직
    console.log("새 목표 생성:", { title, selectedColor, tags })
    onOpenChange(false)
    // Reset form
    setTitle("")
    setSelectedColor("blue")
    setTags([])
    setNewTag("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[560px] max-h-[90vh] overflow-y-auto rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] p-8">
        <DialogHeader>
          <DialogTitle className="text-[#1A1B1E] text-lg font-semibold">새 목표</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="goal-title" className="text-[#343A40] text-sm font-medium">
              목표 제목 <span className="text-[#E57373]">*</span>
            </Label>
            <Input
              id="goal-title"
              placeholder="예: 프로젝트 완성하기"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white text-[#343A40] border-[#E9ECEF] h-12 rounded-lg focus:border-[#4DB6AC] focus:ring-[#4DB6AC] focus:ring-[3px] focus:ring-opacity-10"
            />
          </div>

          {/* Color */}
          <div className="space-y-3">
            <Label className="text-[#343A40] text-sm font-medium">색상</Label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => {
                const isSelected = selectedColor === color.value
                return (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium text-white transition-all ${
                      isSelected
                        ? "ring-2 ring-black ring-offset-2 ring-offset-white"
                        : "hover:opacity-90"
                    }`}
                    style={{ backgroundColor: color.color }}
                  >
                    {color.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-[#343A40] text-sm font-medium">태그</Label>
            <div className="flex gap-2">
              <Input
                placeholder="새 태그 입력..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="bg-white text-[#343A40] border-[#E9ECEF] h-12 rounded-lg flex-1 focus:border-[#4DB6AC] focus:ring-[#4DB6AC] focus:ring-[3px] focus:ring-opacity-10"
              />
              <button
                onClick={handleAddTag}
                className="bg-[#4DB6AC] hover:bg-[#3AA996] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)] transition-colors"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => {
                const isSelected = tags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => handleQuickTag(tag)}
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-[#4DB6AC] text-white"
                        : "bg-[#F1F3F5] text-[#343A40] hover:bg-[#E9ECEF]"
                    }`}
                  >
                    <Plus className="h-3 w-3" />
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-[#E9ECEF]">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm text-[#868E96] hover:text-[#343A40] transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="px-6 py-2 bg-[#4DB6AC] hover:bg-[#3AA996] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)] transition-colors"
          >
            생성
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
