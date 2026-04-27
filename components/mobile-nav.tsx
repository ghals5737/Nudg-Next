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

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg pb-safe">
      <ul className="flex items-center justify-around p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 transition-colors",
                  isActive ? "text-[#1F76EB]" : "text-[#6B7280]"
                )}
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
