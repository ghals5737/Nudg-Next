"use client"

import { Home, Calendar, Target, RotateCcw, Heart, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "홈", href: "/", icon: Home },
  { name: "캘린더", href: "/planner", icon: Calendar },
  { name: "루틴", href: "/routines", icon: RotateCcw },
  { name: "CBT", href: "/cbt", icon: Heart },
  { name: "목표", href: "/goals", icon: Target },
  { name: "설정", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[200px] border-r border-border bg-bg-elev">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <h1 className="text-xl font-bold text-text">TimeFlow</h1>
          <p className="mt-1 text-xs text-text-sub">시간 관리와 새로운 습관</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-brand text-white" : "text-text-sub hover:bg-secondary hover:text-text",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-sub hover:bg-secondary hover:text-text">
            <Settings className="h-5 w-5" />
            설정
          </button>
        </div>
      </div>
    </aside>
  )
}
