"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Edit, MapPin, Trash2 } from "lucide-react"

type CBTDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  entry: {
    date: string
    time: string
    emoji: string
    mood: string
    moodScore: string
    title: string
    copingMethod: string
    location: string
    result: string
    notes: string
  } | null
}

function formatDetailDate(dateStr: string) {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  const dayOfWeek = days[date.getDay()]
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`
}

export function CBTDetailDialog({ open, onOpenChange, entry }: CBTDetailDialogProps) {
  if (!entry) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card p-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border p-4">
          <DialogTitle className="text-lg font-semibold text-text">기록 상세</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-text-sub hover:text-text">
              <Edit className="h-4 w-4" />
              편집
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-text-sub hover:text-text"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="text-center">
            <p className="mb-2 text-sm text-text-sub">{formatDetailDate(entry.date)}</p>
            <p className="text-4xl font-bold text-text">{entry.time}</p>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-background p-3">
            <span className="text-3xl">{entry.emoji}</span>
            <div>
              <p className="font-medium text-success">{entry.mood}</p>
              <p className="text-sm text-text-sub">{entry.moodScore}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-medium text-text-sub">충동 내용</h3>
              <p className="text-text">{entry.title}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-text-sub">대처법</h3>
              <div className="flex items-center gap-2 text-text">
                <span className="text-text-sub">🫁</span>
                <span>{entry.copingMethod}</span>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-text-sub">장소</h3>
              <div className="flex items-center gap-2 text-text">
                <MapPin className="h-4 w-4 text-text-sub" />
                <span>{entry.location}</span>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-text-sub">대처 결과</h3>
              <p className="text-text">{entry.result}</p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-text-sub">메모</h3>
              <p className="text-text">{entry.notes}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-4">
          <Button variant="ghost" className="w-full text-danger hover:bg-danger/10 hover:text-danger">
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
