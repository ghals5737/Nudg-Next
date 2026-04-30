import { useEffect, useRef } from "react"
import type { ScheduleBlock } from "@/types/api"
import { notify } from "@/lib/notifications"

const toDurationStr = (hours: number) => {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}분`
  if (m === 0) return `${h}시간`
  return `${h}시간 ${m}분`
}

const toTimeStr = (t: number) => {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
}

const ONE_DAY_MS = 24 * 3600 * 1000
const FIVE_MIN_HOURS = 5 / 60

/**
 * 오늘 일정 블록들에 대해 시작 시각 / 종료 5분 전 알림을 스케줄링.
 * blocks가 바뀌면 자동으로 재계산. 컴포넌트 언마운트 시 모두 클리어.
 */
export function useBlockAlarms(blocks: ScheduleBlock[], isToday: boolean) {
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    timersRef.current.forEach((id) => clearTimeout(id))
    timersRef.current = []

    if (!isToday) return
    if (typeof window === "undefined") return
    if (!("Notification" in window) || Notification.permission !== "granted") return

    const now = new Date()
    const nowDecimal = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600

    blocks.forEach((block) => {
      if (block.status === "completed") return

      // 시작 시각 알림
      const msUntilStart = (block.startTime - nowDecimal) * 3600 * 1000
      if (msUntilStart > 0 && msUntilStart < ONE_DAY_MS) {
        const id = window.setTimeout(() => {
          notify(`⏰ ${block.title}`, {
            body: `${toTimeStr(block.startTime)} · ${toDurationStr(block.duration)} 예정`,
            tag: `block-start-${block.id}`,
          })
        }, msUntilStart)
        timersRef.current.push(id)
      }

      // 종료 5분 전 알림 (5분 이상 블록만)
      if (block.duration > FIVE_MIN_HOURS) {
        const fiveBeforeEnd = block.endTime - FIVE_MIN_HOURS
        const msUntilWarn = (fiveBeforeEnd - nowDecimal) * 3600 * 1000
        if (msUntilWarn > 0 && msUntilWarn < ONE_DAY_MS) {
          const id = window.setTimeout(() => {
            notify(`⏳ ${block.title}`, {
              body: "5분 남았어요",
              tag: `block-warn-${block.id}`,
            })
          }, msUntilWarn)
          timersRef.current.push(id)
        }
      }

      // 종료 시각 알림
      const msUntilEnd = (block.endTime - nowDecimal) * 3600 * 1000
      if (msUntilEnd > 0 && msUntilEnd < ONE_DAY_MS) {
        const id = window.setTimeout(() => {
          notify(`✅ ${block.title}`, {
            body: "시간 끝났어요. 완료 체크하세요",
            tag: `block-end-${block.id}`,
          })
        }, msUntilEnd)
        timersRef.current.push(id)
      }
    })

    return () => {
      timersRef.current.forEach((id) => clearTimeout(id))
      timersRef.current = []
    }
  }, [blocks, isToday])
}
