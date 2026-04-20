"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"

const accountItems = [
  { icon: "person", label: "프로필", desc: "이름, 이메일, 프로필 사진 관리", value: "김민수" },
  { icon: "notifications", label: "알림", desc: "푸시 알림, 소리, 진동 설정", value: "6개 활성" },
  { icon: "security", label: "개인정보", desc: "데이터 보호 및 개인정보 설정", value: "안전" },
]

const appItems = [
  { icon: "palette", label: "테마", desc: "다크 모드, 색상, 글꼴 크기", value: "라이트" },
  { icon: "language", label: "언어", desc: "앱 표시 언어 설정", value: "한국어" },
  { icon: "schedule", label: "시간대", desc: "표준 시간대 설정", value: "Asia/Seoul" },
]

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#f6faf8] text-[#2a3433] flex">
      <AppSidebar />

      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <header className="hidden md:flex justify-end items-center px-8 pt-6 pb-4">
          <div className="flex items-center gap-4 text-[#56615f]">
            <button className="p-2 rounded-full hover:bg-[#eef5f3] transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
          </div>
        </header>

        <div className="flex-1 px-6 md:px-12 py-6 md:py-8 pb-24 md:pb-12 max-w-3xl mx-auto w-full">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#2a3433] mb-2">설정</h2>
            <p className="text-lg text-[#56615f]">앱 환경을 개인화하고 계정을 관리하세요</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] shadow-[0px_12px_32px_rgba(42,52,51,0.06)] p-6 mb-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#7fe6db] rounded-full opacity-10 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-[#006b64] to-[#7fe6db] flex items-center justify-center text-3xl font-bold text-[#e2fffa] flex-shrink-0">
                김
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#2a3433] mb-0.5">김민수</h3>
                <p className="text-sm text-[#56615f] mb-3">minsu.kim@example.com</p>
                <div className="flex items-center gap-4 text-sm text-[#56615f]">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">language</span>
                    Asia/Seoul
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">translate</span>
                    한국어
                  </span>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-[#56615f] hover:text-[#2a3433] hover:bg-[#eef5f3] rounded-xl transition-colors">
                <span className="material-symbols-outlined text-base">edit</span>
                편집
              </button>
            </div>
          </div>

          {/* Account Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-[#2a3433] mb-4">계정</h3>
            <div className="space-y-3">
              {accountItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between bg-white rounded-xl shadow-[0px_4px_12px_rgba(42,52,51,0.04)] p-5 hover:bg-[#eef5f3] hover:shadow-[0px_8px_20px_rgba(42,52,51,0.06)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5f3] group-hover:bg-white transition-colors">
                      <span className="material-symbols-outlined text-[#56615f]">{item.icon}</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-[#2a3433]">{item.label}</h4>
                      <p className="text-sm text-[#56615f]">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#56615f]">
                    <span className="text-sm">{item.value}</span>
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* App Settings Section */}
          <div>
            <h3 className="text-lg font-bold text-[#2a3433] mb-4">앱 설정</h3>
            <div className="space-y-3">
              {appItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between bg-white rounded-xl shadow-[0px_4px_12px_rgba(42,52,51,0.04)] p-5 hover:bg-[#eef5f3] hover:shadow-[0px_8px_20px_rgba(42,52,51,0.06)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef5f3] group-hover:bg-white transition-colors">
                      <span className="material-symbols-outlined text-[#56615f]">{item.icon}</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-[#2a3433]">{item.label}</h4>
                      <p className="text-sm text-[#56615f]">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#56615f]">
                    <span className="text-sm">{item.value}</span>
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
