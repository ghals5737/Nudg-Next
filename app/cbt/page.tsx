"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { cbtApi } from "@/lib/api/cbt"
import type { CBTEntry, CreateCBTEntryRequest } from "@/types/api"

const formatTime = (iso: string) => {
  const date = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  const timeStr = date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
  if (diffDays === 0) return `오늘, ${timeStr}`
  if (diffDays === 1) return `어제, ${timeStr}`
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"]
  return `${weekdays[date.getDay()]}, ${timeStr}`
}

const MOOD_PRESETS = [
  { mood: "안도", emoji: "😊", moodBg: "#E8F0FC", moodText: "#1F2937" },
  { mood: "기쁨", emoji: "😄", moodBg: "#fef9c3", moodText: "#854d0e" },
  { mood: "압도됨", emoji: "🌊", moodBg: "#E8F0FC", moodText: "#24566a" },
  { mood: "불안", emoji: "😰", moodBg: "#fce7f3", moodText: "#9d174d" },
  { mood: "안정됨", emoji: "🧘", moodBg: "#E4E9F0", moodText: "#1F2937" },
  { mood: "피곤함", emoji: "😴", moodBg: "#f3e8ff", moodText: "#6b21a8" },
  { mood: "우울", emoji: "🌧️", moodBg: "#dbeafe", moodText: "#1e40af" },
  { mood: "슬픔", emoji: "😢", moodBg: "#e0e7ff", moodText: "#3730a3" },
  { mood: "무기력함", emoji: "🪫", moodBg: "#f1f5f9", moodText: "#475569" },
]

export default function CBTPage() {
  const [entries, setEntries] = useState<CBTEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [quickRecordOpen, setQuickRecordOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<CreateCBTEntryRequest>({
    emoji: "😊",
    mood: "안도",
    moodBg: "#E8F0FC",
    moodText: "#1F2937",
    content: "",
    tags: [],
  })
  const [tagInput, setTagInput] = useState("")

  const fetchEntries = (p = 1) => {
    setLoading(true)
    cbtApi.list(p)
      .then((res) => {
        setEntries(p === 1 ? res.data : (prev) => [...prev, ...res.data])
        setTotal(res.total)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchEntries(1) }, [])

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    fetchEntries(next)
  }

  const handleMoodSelect = (preset: typeof MOOD_PRESETS[0]) => {
    setForm((f) => ({ ...f, ...preset }))
  }

  const handleTagAdd = () => {
    const tag = tagInput.trim()
    if (tag && !form.tags?.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...(f.tags ?? []), tag] }))
    }
    setTagInput("")
  }

  const handleTagRemove = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags?.filter((t) => t !== tag) }))
  }

  const handleSubmit = async () => {
    if (!form.content.trim()) return
    setSubmitting(true)
    try {
      await cbtApi.create(form)
      setQuickRecordOpen(false)
      setForm({ emoji: "😊", mood: "안도", moodBg: "#E8F0FC", moodText: "#1F2937", content: "", tags: [] })
      setTagInput("")
      setPage(1)
      fetchEntries(1)
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  const hasMore = entries.length < total

  return (
    <div className="min-h-screen bg-[#EEF1F5] text-[#1F2937] flex">
      <AppSidebar />

      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="hidden md:flex justify-end items-center px-8 pt-6 pb-4">
          <button className="p-2 rounded-full hover:bg-[#EEF1F5] transition-colors">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </header>

        <div className="flex-1 px-4 md:px-12 py-6 md:py-8 max-w-4xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1F2937] mb-2">감정 기록</h2>
              <p className="text-lg text-[#6B7280]">인지 여정을 부드럽게 기록해보세요.</p>
            </div>
            <button
              onClick={() => setQuickRecordOpen(true)}
              className="py-4 px-8 rounded-xl bg-[#1F76EB] text-[#ffffff] font-semibold hover:opacity-90 transition-opacity duration-300 flex items-center gap-2 shadow-[0px_12px_32px_rgba(31,41,55,0.06)] self-start md:self-auto"
            >
              <span className="material-symbols-outlined">edit_note</span>
              기록 추가
            </button>
          </div>

          {loading && entries.length === 0 && <p className="text-[#6B7280]">불러오는 중...</p>}
          {!loading && entries.length === 0 && (
            <p className="text-[#6B7280] text-center py-16">아직 감정 기록이 없어요. 첫 기록을 남겨보세요!</p>
          )}

          <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-[8.5rem] md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E4E9F0] before:to-transparent">
            {entries.map((entry, index) => (
              <div key={entry.id} className={`relative flex items-start gap-6 md:gap-12 ${index < entries.length - 1 ? "mb-12" : ""}`}>
                <div className="hidden md:block w-24 text-right pt-4 shrink-0">
                  <span className="text-sm font-semibold text-[#6B7280]">{formatTime(entry.createdAt)}</span>
                </div>
                <div className="absolute left-0 md:relative md:left-auto flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-[0px_12px_32px_rgba(31,41,55,0.06)] ring-4 ring-[#EEF1F5] z-10 shrink-0 text-xl">
                  {entry.emoji}
                </div>
                <div className="ml-14 md:ml-0 flex-1 bg-white rounded-xl p-6 shadow-[0px_12px_32px_rgba(31,41,55,0.06)] hover:bg-[#EEF1F5]/80 transition-colors duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: entry.moodBg, color: entry.moodText }}>
                      {entry.mood}
                    </span>
                    <span className="text-sm text-[#6B7280] md:hidden">{formatTime(entry.createdAt)}</span>
                  </div>
                  <p className="text-[#1F2937] text-lg leading-relaxed">{entry.content}</p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#EEF1F5] flex gap-2 flex-wrap">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-xs text-[#6B7280] bg-[#EEF1F5] px-2 py-1 rounded-md">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-12 text-center">
              <button onClick={handleLoadMore} className="text-[#1F76EB] font-medium hover:text-[#1F76EB] transition-colors duration-300">
                이전 기록 더 보기
              </button>
            </div>
          )}
        </div>
      </main>

      <MobileNav />

      {quickRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#E4E9F0]/40 backdrop-blur-md px-4">
          <div className="bg-white rounded-[3rem] shadow-[0px_12px_32px_rgba(31,41,55,0.06)] p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#1F2937]">감정 기록하기</h3>
              <button onClick={() => setQuickRecordOpen(false)} className="text-[#6B7280] hover:text-[#1F2937] p-2 rounded-full hover:bg-[#EEF1F5] transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* 감정 선택 */}
            <p className="text-sm font-semibold text-[#6B7280] mb-3">지금 기분이 어때요?</p>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {MOOD_PRESETS.map((preset) => (
                <button
                  key={preset.mood}
                  onClick={() => handleMoodSelect(preset)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl text-sm font-medium transition-all ${
                    form.mood === preset.mood
                      ? "ring-2 ring-[#1F76EB] scale-95"
                      : "hover:bg-[#EEF1F5]"
                  }`}
                  style={form.mood === preset.mood ? { backgroundColor: preset.moodBg, color: preset.moodText } : {}}
                >
                  <span className="text-2xl">{preset.emoji}</span>
                  {preset.mood}
                </button>
              ))}
            </div>

            {/* 내용 */}
            <textarea
              className="w-full bg-[#EEF1F5] rounded-xl p-4 text-[#1F2937] placeholder:text-[#6B7280] border-none outline-none focus:ring-2 focus:ring-[#1F76EB]/20 resize-none mb-4"
              rows={4}
              placeholder="오늘 어떤 감정을 느끼셨나요?"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            />

            {/* 태그 */}
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 bg-[#EEF1F5] rounded-xl px-4 py-2 text-sm text-[#1F2937] placeholder:text-[#6B7280] outline-none focus:ring-2 focus:ring-[#1F76EB]/20"
                placeholder="태그 추가 (Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTagAdd()}
              />
              <button onClick={handleTagAdd} className="px-3 py-2 rounded-xl bg-[#EEF1F5] text-[#6B7280] text-sm font-medium hover:bg-[#EEF1F5] transition-colors">
                추가
              </button>
            </div>
            {form.tags && form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-[#6B7280] bg-[#EEF1F5] px-2 py-1 rounded-md">
                    {tag}
                    <button onClick={() => handleTagRemove(tag)} className="hover:text-[#a83836]">×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setQuickRecordOpen(false)} className="px-6 py-3 rounded-full text-[#6B7280] font-semibold hover:bg-[#EEF1F5] transition-colors">취소</button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !form.content.trim()}
                className="px-8 py-3 rounded-full bg-[#1F76EB] text-[#ffffff] font-bold shadow-[0px_8px_24px_rgba(31,118,235,0.15)] hover:shadow-[0px_12px_32px_rgba(31,118,235,0.2)] transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
