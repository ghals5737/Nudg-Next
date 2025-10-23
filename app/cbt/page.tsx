"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { CBTDetailDialog } from "@/components/cbt-detail-dialog"
import { QuickRecordDialog } from "@/components/quick-record-dialog"
import { Plus, Filter, ChevronRight } from "lucide-react"
import { useState } from "react"

type CBTEntry = {
  id: number
  date: string
  time: string
  emoji: string
  title: string
  tags: string[]
  metadata: string
  status: "positive" | "negative"
  mood: string
  moodScore: string
  copingMethod: string
  location: string
  result: string
  notes: string
}

const sampleEntries: CBTEntry[] = [
  {
    id: 1,
    date: "2025-10-23",
    time: "09:43",
    emoji: "😊",
    title: "스마트폰을 계속 확인하고 싶은 충동",
    tags: ["출근", "집"],
    metadata: "관찰을 4-7-8 성공",
    status: "positive",
    mood: "좋음",
    moodScore: "관찰 실수 +3",
    copingMethod: "관찰을 4-7-8",
    location: "집",
    result: "성공",
    notes: "모든 것도 집중을을 하니 마음이 진정되었다",
  },
  {
    id: 2,
    date: "2025-10-22",
    time: "11:43",
    emoji: "😊",
    title: "완을 미루고 유튜브를 보고 싶음",
    tags: ["5분 산책", "성공"],
    metadata: "",
    status: "positive",
    mood: "좋음",
    moodScore: "관찰 실수 +2",
    copingMethod: "5분 산책",
    location: "사무실",
    result: "성공",
    notes: "짧은 산책으로 기분이 나아졌습니다",
  },
  {
    id: 3,
    date: "2025-10-21",
    time: "11:43",
    emoji: "😢",
    title: "하기 나서 물건을 던지고 싶음",
    tags: ["음악 듣기", "실패"],
    metadata: "",
    status: "negative",
    mood: "나쁨",
    moodScore: "관찰 실수 -2",
    copingMethod: "음악 듣기",
    location: "집",
    result: "실패",
    notes: "음악이 도움이 되지 않았습니다",
  },
  {
    id: 4,
    date: "2025-10-20",
    time: "11:43",
    emoji: "😊",
    title: "과식하고 싶은 충동",
    tags: ["톨 마시기", "성공"],
    metadata: "",
    status: "positive",
    mood: "좋음",
    moodScore: "관찰 실수 +1",
    copingMethod: "물 마시기",
    location: "집",
    result: "성공",
    notes: "물을 마시니 충동이 줄어들었습니다",
  },
]

// Group entries by date
function groupByDate(entries: CBTEntry[]) {
  const groups: Record<string, CBTEntry[]> = {}
  entries.forEach((entry) => {
    if (!groups[entry.date]) {
      groups[entry.date] = []
    }
    groups[entry.date].push(entry)
  })
  return groups
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  const dayOfWeek = days[date.getDay()]
  return `${month}월 ${day}일 (${dayOfWeek})`
}

export default function CBTPage() {
  const [activeTab, setActiveTab] = useState<"timeline" | "trends">("timeline")
  const [timePeriod, setTimePeriod] = useState<"today" | "week" | "month">("today")
  const [selectedEntry, setSelectedEntry] = useState<CBTEntry | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [quickRecordOpen, setQuickRecordOpen] = useState(false)

  const groupedEntries = groupByDate(sampleEntries)

  const handleEntryClick = (entry: CBTEntry) => {
    setSelectedEntry(entry)
    setDetailOpen(true)
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <main className="flex-1 md:ml-[200px]">
        <div className="mx-auto max-w-5xl p-6 pb-24 md:pb-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-text">CBT 기록</h1>
              <p className="text-sm text-text-sub">감정과 충동을 기록하고 대처법을 찾아보세요</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-border bg-card text-text">
                <Filter className="mr-2 h-4 w-4" />
                필터
              </Button>
              <Button className="bg-brand hover:bg-brand-strong" onClick={() => setQuickRecordOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                빠른 기록
              </Button>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "timeline" ? "default" : "ghost"}
                className={activeTab === "timeline" ? "bg-brand hover:bg-brand-strong" : "text-text-sub"}
                onClick={() => setActiveTab("timeline")}
              >
                타임라인
              </Button>
              <Button
                variant={activeTab === "trends" ? "default" : "ghost"}
                className={activeTab === "trends" ? "bg-brand hover:bg-brand-strong" : "text-text-sub"}
                onClick={() => setActiveTab("trends")}
              >
                목록
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={timePeriod === "today" ? "default" : "ghost"}
                size="sm"
                className={timePeriod === "today" ? "bg-brand hover:bg-brand-strong" : "text-text-sub"}
                onClick={() => setTimePeriod("today")}
              >
                오늘
              </Button>
              <Button
                variant={timePeriod === "week" ? "default" : "ghost"}
                size="sm"
                className={timePeriod === "week" ? "bg-brand hover:bg-brand-strong" : "text-text-sub"}
                onClick={() => setTimePeriod("week")}
              >
                주
              </Button>
              <Button
                variant={timePeriod === "month" ? "default" : "ghost"}
                size="sm"
                className={timePeriod === "month" ? "bg-brand hover:bg-brand-strong" : "text-text-sub"}
                onClick={() => setTimePeriod("month")}
              >
                월
              </Button>
            </div>
          </div>

          {activeTab === "timeline" ? (
            <div className="space-y-8">
              {Object.entries(groupedEntries).map(([date, entries]) => (
                <div key={date}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text">{formatDate(date)}</h2>
                    <span className="text-sm text-text-sub">{entries.length}건</span>
                  </div>

                  <div className="relative space-y-6 border-l-2 border-border pl-6">
                    {entries.map((entry, index) => (
                      <div key={entry.id} className="relative">
                        <div
                          className={`absolute -left-[29px] top-2 h-3 w-3 rounded-full ${
                            entry.status === "positive" ? "bg-success" : "bg-danger"
                          }`}
                        />

                        <div
                          className="group cursor-pointer rounded-lg bg-card p-4 transition-colors hover:bg-card-hover"
                          onClick={() => handleEntryClick(entry)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex gap-3">
                              <span className="text-2xl">{entry.emoji}</span>
                              <div className="flex-1">
                                <div className="mb-1 flex items-center gap-2 text-sm text-text-sub">
                                  <span>{entry.time}</span>
                                  {entry.tags.map((tag, i) => (
                                    <span key={i}>{tag}</span>
                                  ))}
                                </div>
                                <h3 className="mb-2 font-medium text-text">{entry.title}</h3>
                                {entry.metadata && <p className="text-sm text-text-sub">{entry.metadata}</p>}
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-text-sub opacity-0 transition-opacity group-hover:opacity-100" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {sampleEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="group cursor-pointer rounded-lg bg-card p-4 transition-colors hover:bg-card-hover"
                  onClick={() => handleEntryClick(entry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <span className="text-2xl">{entry.emoji}</span>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2 text-sm text-text-sub">
                          <span>
                            {formatDate(entry.date)} {entry.time}
                          </span>
                          {entry.tags.map((tag, i) => (
                            <span key={i}>{tag}</span>
                          ))}
                        </div>
                        <h3 className="mb-1 font-medium text-text">{entry.title}</h3>
                        {entry.metadata && <p className="text-sm text-text-sub">{entry.metadata}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.status === "negative" && <div className="h-2 w-2 rounded-full bg-danger" />}
                      <ChevronRight className="h-5 w-5 text-text-sub opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <MobileNav />

      <CBTDetailDialog open={detailOpen} onOpenChange={setDetailOpen} entry={selectedEntry} />
      <QuickRecordDialog open={quickRecordOpen} onOpenChange={setQuickRecordOpen} />
    </div>
  )
}
