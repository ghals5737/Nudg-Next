"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { CBTDetailDialog } from "@/components/cbt-detail-dialog"
import { QuickRecordDialog } from "@/components/quick-record-dialog"
import { Plus, Filter, ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"

type CBTEntry = {
  id: number
  date: string
  time: string
  emoji: string
  mood: string
  moodColor: "green" | "orange" | "red"
  location?: string
  impulse: string
  copingMethod: string
  result: "success" | "failure"
}

const sampleEntries: CBTEntry[] = [
  {
    id: 1,
    date: "2025-12-11",
    time: "11:57",
    emoji: "😊",
    mood: "좋음",
    moodColor: "green",
    location: "집",
    impulse: "스마트폰을 계속 확인하고 싶은 충동",
    copingMethod: "김호흡 4-7-8",
    result: "success",
  },
  {
    id: 2,
    date: "2025-12-10",
    time: "13:57",
    emoji: "😐",
    mood: "나쁨",
    moodColor: "orange",
    location: "사무실",
    impulse: "일을 미루고 유튜브를 보고 싶음",
    copingMethod: "5분 산책",
    result: "success",
  },
  {
    id: 3,
    date: "2025-12-09",
    time: "15:30",
    emoji: "😩",
    mood: "매우 나쁨",
    moodColor: "red",
    impulse: "화가 나서 물건을 던지고 싶음",
    copingMethod: "음악 듣기",
    result: "failure",
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

function getMoodColor(moodColor: string) {
  switch (moodColor) {
    case "green":
      return "#4DB6AC"
    case "orange":
      return "#FF8A65"
    case "red":
      return "#E57373"
    default:
      return "#90A4AE"
  }
}

export default function CBTPage() {
  const [activeTab, setActiveTab] = useState<"timeline" | "list">("timeline")
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
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AppSidebar />

      <main className="flex-1 ml-[260px]">
        <div className="px-10 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-bold text-[#1A1B1E]">CBT 기록</h1>
              <p className="text-sm text-[#868E96]">감정과 충동을 기록하고 대처법을 찾아보세요</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="text-[#343A40] hover:bg-[#F8F9FA] border border-[#E9ECEF]"
              >
                <ChevronDown className="mr-2 h-4 w-4" />
                필터
              </Button>
              <Button
                className="bg-[#4DB6AC] hover:bg-[#3AA996] text-white h-9 px-4 rounded-lg font-semibold shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                onClick={() => setQuickRecordOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                빠른 기록
              </Button>
            </div>
          </div>

          {/* Tabs and Date Selection */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "timeline"
                    ? "bg-[#4DB6AC] text-white shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                    : "text-[#868E96] hover:bg-[#F8F9FA]"
                }`}
              >
                타임라인
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "list"
                    ? "bg-[#4DB6AC] text-white shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                    : "text-[#868E96] hover:bg-[#F8F9FA]"
                }`}
              >
                목록
              </button>
            </div>

            <div className="flex gap-2">
              {(["오늘", "주", "월"] as const).map((period) => {
                const periodKey = period === "오늘" ? "today" : period === "주" ? "week" : "month"
                return (
                  <button
                    key={period}
                    onClick={() => setTimePeriod(periodKey)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      timePeriod === periodKey
                        ? "bg-[#4DB6AC] text-white shadow-[0_2px_6px_rgba(77,182,172,0.2)]"
                        : "text-[#868E96] hover:bg-[#F8F9FA]"
                    }`}
                  >
                    {period}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Timeline View */}
          {activeTab === "timeline" ? (
            <div className="space-y-8">
              {Object.entries(groupedEntries).map(([date, entries]) => (
                <div key={date}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-[#1A1B1E]">{formatDate(date)}</h2>
                    <span className="text-sm text-[#868E96]">{entries.length}건</span>
                  </div>

                  <div className="relative space-y-4 border-l-2 border-[#E9ECEF] pl-6">
                    {entries.map((entry) => (
                      <div key={entry.id} className="relative">
                        {/* Color dot */}
                        <div
                          className="absolute -left-[29px] top-2 h-3 w-3 rounded-full"
                          style={{ backgroundColor: getMoodColor(entry.moodColor) }}
                        />

                        {/* Entry card */}
                        <div
                          className="group cursor-pointer rounded-lg bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:shadow-md"
                          onClick={() => handleEntryClick(entry)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Time */}
                              <div className="mb-2 text-sm text-[#868E96]">{entry.time}</div>

                              {/* Emotion and location */}
                              <div className="mb-2 flex items-center gap-2">
                                <span className="text-2xl">{entry.emoji}</span>
                                <span
                                  className="text-sm font-medium"
                                  style={{ color: getMoodColor(entry.moodColor) }}
                                >
                                  {entry.mood}
                                </span>
                                {entry.location && (
                                  <span className="text-sm text-[#868E96]">{entry.location}</span>
                                )}
                              </div>

                              {/* Impulse */}
                              <div className="mb-2 text-sm text-[#343A40]">{entry.impulse}</div>

                              {/* Coping method and result */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-[#343A40]">{entry.copingMethod}</span>
                                <span
                                  className={`text-sm font-medium ${
                                    entry.result === "success" ? "text-[#4DB6AC]" : "text-[#E57373]"
                                  }`}
                                >
                                  {entry.result === "success" ? "성공" : "실패"}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-[#868E96] opacity-0 transition-opacity group-hover:opacity-100 ml-4" />
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
                  className="group cursor-pointer rounded-lg bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:shadow-md"
                  onClick={() => handleEntryClick(entry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <span className="text-2xl">{entry.emoji}</span>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2 text-sm text-[#868E96]">
                          <span>
                            {formatDate(entry.date)} {entry.time}
                          </span>
                        </div>
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className="text-sm font-medium"
                            style={{ color: getMoodColor(entry.moodColor) }}
                          >
                            {entry.mood}
                          </span>
                          {entry.location && (
                            <span className="text-sm text-[#868E96]">{entry.location}</span>
                          )}
                        </div>
                        <h3 className="mb-1 text-sm font-medium text-[#343A40]">{entry.impulse}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#343A40]">{entry.copingMethod}</span>
                          <span
                            className={`text-sm font-medium ${
                              entry.result === "success" ? "text-[#4DB6AC]" : "text-[#E57373]"
                            }`}
                          >
                            {entry.result === "success" ? "성공" : "실패"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#868E96] opacity-0 transition-opacity group-hover:opacity-100 ml-4" />
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
