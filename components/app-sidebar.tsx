"use client"

import { Home, Calendar, Target, RotateCcw, Heart, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "홈", href: "/", icon: Home },
  { name: "플래너", href: "/planner", icon: Calendar },
  { name: "루틴", href: "/routines", icon: RotateCcw },
  { name: "CBT", href: "/cbt", icon: Heart },
  { name: "목표", href: "/goals", icon: Target },
  { name: "설정", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] bg-[#F7F8FA]">
      <div className="flex h-full flex-col">
        <div className="px-6 pt-6 pb-8">
          <h1 className="text-xl font-bold text-[#1A1B1E]">Nudg</h1>
          <p className="mt-1 text-xs text-[#868E96]">ADHD 친화적 플래너</p>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#4DB6AC] text-white shadow-[0_4px_12px_rgba(77,182,172,0.25)]"
                    : "text-[#495057] hover:bg-[#E9ECEF] hover:text-[#212529]",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[#E9ECEF] px-4 py-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#495057] hover:bg-[#E9ECEF] hover:text-[#212529]">
            <Settings className="h-5 w-5" />
            설정
          </button>
        </div>
      </div>
    </aside>
  )
}
