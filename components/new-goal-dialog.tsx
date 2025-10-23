"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { useState } from "react"

type NewGoalDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const colors = [
  { name: "블루", value: "blue", class: "bg-[#7AA2FF]" },
  { name: "그린", value: "green", class: "bg-[#4ADE80]" },
  { name: "옐로", value: "yellow", class: "bg-[#FCD34D]" },
  { name: "퍼플", value: "purple", class: "bg-[#C084FC]" },
  { name: "핑크", value: "pink", class: "bg-[#F472B6]" },
  { name: "오렌지", value: "orange", class: "bg-[#FB923C]" },
  { name: "시안", value: "cyan", class: "bg-[#22D3EE]" },
  { name: "레드", value: "red", class: "bg-[#F87171]" },
]

const quickTags = ["업무", "개인", "학습", "건강", "취미", "중요", "긴급", "장기", "단기"]

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
    // Handle goal creation
    console.log("[v0] Creating goal:", { title, selectedColor, tags })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text">새 목표</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="goal-title" className="text-text">
              목표 제목 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="goal-title"
              placeholder="예: 프로젝트 완성하기"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background border-border text-text"
            />
          </div>

          {/* Color */}
          <div className="space-y-3">
            <Label className="text-text">색상</Label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`${color.class} rounded-lg px-4 py-3 text-sm font-medium text-white transition-all hover:opacity-90 ${
                    selectedColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-card" : ""
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-text">태그</Label>
            <div className="flex gap-2">
              <Input
                placeholder="새 태그 입력..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                className="bg-background border-border text-text flex-1"
              />
              <Button onClick={handleAddTag} className="bg-brand hover:bg-brand-strong">
                추가
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleQuickTag(tag)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                    tags.includes(tag) ? "bg-brand text-white" : "bg-background text-text-sub hover:bg-accent"
                  }`}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label className="text-text">마감일 (선택)</Label>
            <Select>
              <SelectTrigger className="bg-background border-border text-text">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-text-sub" />
                  <SelectValue placeholder="연도. 월. 일." />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">마감일 없음</SelectItem>
                <SelectItem value="today">오늘</SelectItem>
                <SelectItem value="tomorrow">내일</SelectItem>
                <SelectItem value="week">1주일 후</SelectItem>
                <SelectItem value="month">1개월 후</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-text-sub">
            취소
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()} className="bg-brand hover:bg-brand-strong">
            생성
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
