"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { authApi } from "@/lib/api/auth"
import { userApi } from "@/lib/api/user"
import { apiClient } from "@/lib/api/client"
import type { User } from "@/types/api"

const themeLabel = (t: User["theme"]) =>
  t === "dark" ? "다크" : t === "light" ? "라이트" : "시스템"

const langLabel = (l: string) => {
  const map: Record<string, string> = { ko: "한국어", en: "English", ja: "日本語" }
  return map[l] ?? l
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    userApi.get()
      .then((res) => setUser(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await authApi.logout()
    } catch {
      // ignore
    } finally {
      apiClient.clearToken()
      apiClient.clearRefreshToken()
      router.replace("/login")
    }
  }

  const accountItems = [
    {
      icon: "notifications",
      label: "알림",
      desc: "푸시 알림, 소리, 진동 설정",
      value: user?.notificationsEnabled ? "활성" : "비활성",
    },
    {
      icon: "security",
      label: "개인정보",
      desc: "데이터 보호 및 개인정보 설정",
      value: "안전",
    },
  ]

  const appItems = [
    {
      icon: "palette",
      label: "테마",
      desc: "다크 모드, 색상, 글꼴 크기",
      value: user ? themeLabel(user.theme) : "—",
    },
    {
      icon: "language",
      label: "언어",
      desc: "앱 표시 언어 설정",
      value: user ? langLabel(user.language) : "—",
    },
    {
      icon: "schedule",
      label: "시간대",
      desc: "표준 시간대 설정",
      value: user?.timezone ?? "—",
    },
  ]

  const initial = user?.name?.charAt(0) ?? ""

  return (
    <div className="min-h-screen bg-[#EEF1F5] text-[#1F2937] flex">
      <AppSidebar />

      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="hidden md:flex justify-end items-center px-8 pt-6 pb-4">
          <div className="flex items-center gap-4 text-[#6B7280]">
            <button className="p-2 rounded-full hover:bg-[#EEF1F5] transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
          </div>
        </header>

        <div className="flex-1 px-6 md:px-12 py-6 md:py-8 pb-24 md:pb-12 max-w-3xl mx-auto w-full">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1F2937] mb-2">설정</h2>
            <p className="text-lg text-[#6B7280]">앱 환경을 개인화하고 계정을 관리하세요</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] shadow-[0px_12px_32px_rgba(31,41,55,0.06)] p-6 mb-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E8F0FC] rounded-full opacity-10 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              {loading ? (
                <div className="w-20 h-20 rounded-[1.5rem] bg-[#EEF1F5] animate-pulse flex-shrink-0" />
              ) : user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-20 h-20 rounded-[1.5rem] object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-[1.5rem] bg-[#1F76EB] flex items-center justify-center text-3xl font-bold text-[#ffffff] flex-shrink-0">
                  {initial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-5 w-28 bg-[#EEF1F5] rounded animate-pulse" />
                    <div className="h-4 w-44 bg-[#EEF1F5] rounded animate-pulse" />
                    <div className="h-4 w-36 bg-[#EEF1F5] rounded animate-pulse" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-[#1F2937] mb-0.5 truncate">{user?.name}</h3>
                    <p className="text-sm text-[#6B7280] mb-3 truncate">{user?.email}</p>
                    <div className="flex items-center gap-4 text-sm text-[#6B7280] flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        {user?.timezone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">translate</span>
                        {user ? langLabel(user.language) : ""}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">계정</h3>
            <div className="space-y-3">
              {accountItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between bg-white rounded-xl shadow-[0px_4px_12px_rgba(31,41,55,0.04)] p-5 hover:bg-[#EEF1F5] hover:shadow-[0px_8px_20px_rgba(31,41,55,0.06)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF1F5] group-hover:bg-white transition-colors">
                      <span className="material-symbols-outlined text-[#6B7280]">{item.icon}</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-[#1F2937]">{item.label}</h4>
                      <p className="text-sm text-[#6B7280]">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    {loading ? (
                      <div className="h-4 w-12 bg-[#EEF1F5] rounded animate-pulse" />
                    ) : (
                      <span className="text-sm">{item.value}</span>
                    )}
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* App Settings Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">앱 설정</h3>
            <div className="space-y-3">
              {appItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between bg-white rounded-xl shadow-[0px_4px_12px_rgba(31,41,55,0.04)] p-5 hover:bg-[#EEF1F5] hover:shadow-[0px_8px_20px_rgba(31,41,55,0.06)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF1F5] group-hover:bg-white transition-colors">
                      <span className="material-symbols-outlined text-[#6B7280]">{item.icon}</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-[#1F2937]">{item.label}</h4>
                      <p className="text-sm text-[#6B7280]">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    {loading ? (
                      <div className="h-4 w-16 bg-[#EEF1F5] rounded animate-pulse" />
                    ) : (
                      <span className="text-sm">{item.value}</span>
                    )}
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-4 bg-white rounded-xl shadow-[0px_4px_12px_rgba(31,41,55,0.04)] p-5 hover:bg-[#fef2f2] transition-all duration-300 group disabled:opacity-50"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fef2f2] group-hover:bg-white transition-colors">
              <span className="material-symbols-outlined text-[#b91c1c]">logout</span>
            </div>
            <span className="font-semibold text-[#b91c1c]">
              {loggingOut ? "로그아웃 중..." : "로그아웃"}
            </span>
          </button>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
