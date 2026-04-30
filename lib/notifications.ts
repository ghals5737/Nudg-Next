export type PermissionState = "default" | "granted" | "denied" | "unsupported"

export function getPermission(): PermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported"
  return Notification.permission
}

export async function requestPermission(): Promise<PermissionState> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported"
  if (Notification.permission === "default") {
    const result = await Notification.requestPermission()
    return result
  }
  return Notification.permission
}

interface NotifyOptions {
  body?: string
  tag?: string
  icon?: string
  onClick?: () => void
}

export function notify(title: string, options: NotifyOptions = {}) {
  if (typeof window === "undefined" || !("Notification" in window)) return
  if (Notification.permission !== "granted") return
  const n = new Notification(title, {
    body: options.body,
    tag: options.tag,
    icon: options.icon ?? "/favicon.ico",
  })
  if (options.onClick) {
    n.onclick = () => {
      window.focus()
      options.onClick?.()
      n.close()
    }
  }
}
