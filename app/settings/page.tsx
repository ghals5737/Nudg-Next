"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, Moon, Globe, Clock, Trash2, Download, User } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <main className="flex-1 md:ml-[200px]">
        <div className="mx-auto max-w-5xl p-6 pb-24 md:pb-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-1 text-2xl font-bold text-text">설정</h1>
            <p className="text-sm text-text-sub">앱 설정을 관리하세요</p>
          </div>

          {/* Profile Section */}
          <Card className="mb-6 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-text" />
              <h2 className="text-lg font-semibold text-text">프로필</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white">
                사
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-text">사용자</h3>
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              <Button variant="outline">프로필 수정</Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="mb-6 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-text" />
              <h2 className="text-lg font-semibold text-text">알림</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">푸시 알림</h3>
                  <p className="text-sm text-muted-foreground">일정과 루틴 알림을 받습니다</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">이메일 알림</h3>
                  <p className="text-sm text-muted-foreground">주간 리포트를 이메일로 받습니다</p>
                </div>
                <Switch checked={false} onCheckedChange={() => {}} />
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="mb-6 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Moon className="h-5 w-5 text-text" />
              <h2 className="text-lg font-semibold text-text">화면</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">다크 모드</h3>
                  <p className="text-sm text-muted-foreground">어두운 테마를 사용합니다</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </Card>

          {/* Language & Region */}
          <Card className="mb-6 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-text" />
              <h2 className="text-lg font-semibold text-text">언어 및 지역</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">언어</h3>
                  <p className="text-sm text-muted-foreground">한국어</p>
                </div>
                <Button variant="outline" size="sm">
                  변경
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">시간대</h3>
                  <p className="text-sm text-muted-foreground">서울 (GMT+9)</p>
                </div>
                <Button variant="outline" size="sm">
                  변경
                </Button>
              </div>
            </div>
          </Card>

          {/* Data & Privacy */}
          <Card className="mb-6 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-text" />
              <h2 className="text-lg font-semibold text-text">데이터 및 개인정보</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">자동 저장</h3>
                  <p className="text-sm text-muted-foreground">변경사항을 자동으로 저장합니다</p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">데이터 내보내기</h3>
                  <p className="text-sm text-muted-foreground">모든 데이터를 JSON 파일로 다운로드</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  내보내기
                </Button>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border-danger/50 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-danger" />
              <h2 className="text-lg font-semibold text-danger">위험 구역</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-text">모든 데이터 삭제</h3>
                  <p className="text-sm text-muted-foreground">모든 기록과 설정이 영구적으로 삭제됩니다</p>
                </div>
                <Button variant="destructive" size="sm">
                  삭제
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
