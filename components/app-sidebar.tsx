"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "홈", href: "/", icon: "home" },
  { name: "플래너", href: "/planner", icon: "calendar_today" },
  { name: "루틴", href: "/routines", icon: "cached" },
  { name: "목표", href: "/goals", icon: "track_changes" },
  { name: "CBT", href: "/cbt", icon: "psychology" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-50 hidden md:flex h-screen w-72 flex-col py-8 px-4 bg-[#e8eff5]/70 backdrop-blur-3xl rounded-r-[3rem] shadow-[0px_12px_32px_rgba(36,50,61,0.06)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 mb-12">
        <span className="material-symbols-outlined text-3xl text-[#0b5c7a]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tighter text-[#0b5c7a]">Nudg</h1>
          <p className="text-xs text-[#6a7a8a]">The Cognitive Sanctuary</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-6 py-3 rounded-full font-medium transition-all duration-300 ease-out",
                isActive
                  ? "bg-white/50 text-[#083d52] font-semibold shadow-sm"
                  : "text-slate-500 hover:text-[#0b5c7a] hover:bg-white/40"
              )}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto space-y-3 px-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-full font-medium transition-all duration-300 ease-out",
            pathname === "/settings"
              ? "bg-white/50 text-[#083d52] font-semibold shadow-sm"
              : "text-slate-500 hover:text-[#0b5c7a] hover:bg-white/40"
          )}
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          설정
        </Link>
      </div>
    </aside>
  )
}
