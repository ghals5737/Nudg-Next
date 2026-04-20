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
    <aside className="fixed left-0 top-0 z-50 hidden md:flex h-screen w-72 flex-col py-8 px-4 bg-teal-50/70 backdrop-blur-3xl rounded-r-[3rem] shadow-[0px_12px_32px_rgba(42,52,51,0.06)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 mb-12">
        <span className="material-symbols-outlined text-3xl text-[#006b64]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
        <div>
          <h1 className="text-xl font-extrabold tracking-tighter text-[#006b64]">Nudg</h1>
          <p className="text-xs text-[#56615f]">The Cognitive Sanctuary</p>
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
                  ? "bg-white/50 text-[#1a4341] font-semibold shadow-sm"
                  : "text-slate-500 hover:text-teal-700 hover:bg-white/40"
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
              ? "bg-white/50 text-[#1a4341] font-semibold shadow-sm"
              : "text-slate-500 hover:text-teal-700 hover:bg-white/40"
          )}
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          설정
        </Link>
        <button className="w-full py-4 rounded-[2rem] bg-gradient-to-br from-[#006b64] to-[#7fe6db] text-[#e2fffa] font-bold shadow-[0px_12px_32px_rgba(42,52,51,0.06)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
          <span className="material-symbols-outlined text-lg">add</span>
          새 항목
        </button>
      </div>
    </aside>
  )
}
