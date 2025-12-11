"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Globe, User, Bell, Shield, Palette, ChevronRight, Pencil } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AppSidebar />

      <main className="flex-1 ml-[260px]">
        <div className="px-10 py-8 pb-24 md:pb-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold text-[#1A1B1E]">설정</h1>
            <p className="text-sm text-[#868E96]">앱 환경을 개인화하고 계정을 관리하세요</p>
          </div>

          {/* User Account Information Card */}
          <div className="mb-8 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#4DB6AC] text-3xl font-bold text-white">
                  김
                </div>
                <div>
                  <h2 className="mb-1 text-xl font-semibold text-[#343A40]">김민수</h2>
                  <p className="mb-3 text-sm text-[#868E96]">minsu.kim@example.com</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-[#868E96]">
                      <Globe className="h-4 w-4" />
                      <span>Asia/Seoul</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#868E96]">
                      <Globe className="h-4 w-4" />
                      <span>한국어</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-[#868E96] hover:text-[#343A40] hover:bg-[#F8F9FA] rounded-lg transition-colors">
                <Pencil className="h-4 w-4" />
                편집
              </button>
            </div>
          </div>

          {/* Account Section */}
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-[#1A1B1E]">계정</h2>
            <div className="space-y-2">
              {/* Profile */}
              <button className="w-full flex items-center justify-between bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F3F5]">
                    <User className="h-5 w-5 text-[#868E96]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#343A40]">프로필</h3>
                    <p className="text-sm text-[#868E96]">이름, 이메일, 프로필 사진 관리</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#868E96]">김민수</span>
                  <ChevronRight className="h-5 w-5 text-[#868E96]" />
                </div>
              </button>

              {/* Notifications */}
              <button className="w-full flex items-center justify-between bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F3F5]">
                    <Bell className="h-5 w-5 text-[#868E96]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#343A40]">알림</h3>
                    <p className="text-sm text-[#868E96]">푸시 알림, 소리, 진동 설정</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#868E96]">6개 활성</span>
                  <ChevronRight className="h-5 w-5 text-[#868E96]" />
                </div>
              </button>

              {/* Personal Information */}
              <button className="w-full flex items-center justify-between bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F3F5]">
                    <Shield className="h-5 w-5 text-[#868E96]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#343A40]">개인정보</h3>
                    <p className="text-sm text-[#868E96]">데이터 보호 및 개인정보 설정</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#868E96]">안전</span>
                  <ChevronRight className="h-5 w-5 text-[#868E96]" />
                </div>
              </button>
            </div>
          </div>

          {/* App Settings Section */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[#1A1B1E]">앱 설정</h2>
            <div className="space-y-2">
              {/* Theme */}
              <button className="w-full flex items-center justify-between bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F3F5]">
                    <Palette className="h-5 w-5 text-[#868E96]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-[#343A40]">테마</h3>
                    <p className="text-sm text-[#868E96]">다크 모드, 색상, 글꼴 크기</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#868E96]">라이트</span>
                  <ChevronRight className="h-5 w-5 text-[#868E96]" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
