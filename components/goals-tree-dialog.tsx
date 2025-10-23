"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Calendar } from "lucide-react"
import { useState } from "react"

interface Step {
  id: string
  title: string
  duration: string
  completed: boolean
}

interface Goal {
  id: string
  title: string
  color: string
  tags: string[]
  steps: Step[]
  expanded: boolean
}

interface GoalsTreeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GoalsTreeDialog({ open, onOpenChange }: GoalsTreeDialogProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "프로젝트 완성하기",
      color: "bg-brand",
      tags: ["업무", "중요"],
      expanded: true,
      steps: [
        { id: "1-1", title: "기획서 작성", duration: "1시간 30분", completed: false },
        { id: "1-2", title: "요구사항 정리", duration: "30분", completed: true },
        { id: "1-3", title: "일정 계획", duration: "45분", completed: false },
        { id: "1-4", title: "개발 시작", duration: "4시간", completed: false },
        { id: "1-5", title: "UI 컴포넌트", duration: "2시간", completed: false },
      ],
    },
    {
      id: "2",
      title: "건강 관리",
      color: "bg-success",
      tags: ["개인", "루틴"],
      expanded: false,
      steps: [
        { id: "2-1", title: "아침 운동", duration: "30분", completed: true },
        { id: "2-2", title: "물 마시기", duration: "5분", completed: false },
      ],
    },
  ])

  const toggleGoal = (goalId: string) => {
    setGoals(goals.map((goal) => (goal.id === goalId ? { ...goal, expanded: !goal.expanded } : goal)))
  }

  const toggleStep = (goalId: string, stepId: string) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              steps: goal.steps.map((step) => (step.id === stepId ? { ...step, completed: !step.completed } : step)),
            }
          : goal,
      ),
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-hidden bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b border-grid-quarter p-6 pb-4">
          <SheetTitle className="text-lg font-bold text-text">목표 & 스텝</SheetTitle>
        </SheetHeader>

        <div className="h-[calc(100vh-80px)] overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg bg-background p-3">
                  <div className={`h-3 w-3 flex-shrink-0 rounded-full ${goal.color}`} />
                  <div className="flex-1">
                    <h3 className="font-medium text-text">{goal.title}</h3>
                    <div className="mt-1 flex gap-2">
                      {goal.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-grid-quarter text-xs text-text-sub">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => toggleGoal(goal.id)}
                  >
                    {goal.expanded ? (
                      <ChevronDown className="h-4 w-4 text-text-sub" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-text-sub" />
                    )}
                  </Button>
                </div>

                {goal.expanded && (
                  <div className="ml-6 space-y-2">
                    {goal.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 rounded-lg bg-background p-3 transition-colors hover:bg-grid-quarter"
                      >
                        <Checkbox
                          checked={step.completed}
                          onCheckedChange={() => toggleStep(goal.id, step.id)}
                          className="flex-shrink-0"
                        />
                        <span
                          className={`flex-1 text-sm ${step.completed ? "text-text-sub line-through" : "text-text"}`}
                        >
                          {step.title}
                        </span>
                        <span className="text-xs text-text-sub">{step.duration}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <Calendar className="h-4 w-4 text-text-sub" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
