"use client"

import { Home, Calendar, Target, RotateCcw, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "홈", href: "/", icon: Home },
  { name: "캘린더", href: "/planner", icon: Calendar },
  { name: "CBT", href: "/cbt", icon: Heart },
  { name: "루틴", href: "/routines", icon: RotateCcw },
  { name: "목표", href: "/goals", icon: Target },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-elev md:hidden">
      <div className="flex items-center justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
                isActive ? "text-brand" : "text-text-sub",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
