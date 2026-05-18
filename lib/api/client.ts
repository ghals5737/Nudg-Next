import type { ApiError } from "@/types/api"

// 클라이언트는 항상 상대경로 /api 로 자기 origin 호출 → Mixed Content 원천 차단.
// Next.js rewrite 가 서버 사이드에서 API_URL(런타임 env) 로 프록시.
// 절대 URL 을 빌드에 박지 말 것 — http/https 불일치 시 브라우저가 요청 자체를 차단함.
const BASE_URL = "/api"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? match[1] : null
}

function setCookie(name: string, value: string, maxAgeSec: number) {
  document.cookie = `${name}=${value}; max-age=${maxAgeSec}; path=/; SameSite=Lax`
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/`
}

class ApiClient {
  private baseUrl: string
  private refreshing: Promise<void> | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private get accessToken(): string | null {
    return getCookie("accessToken")
  }

  private get refreshToken(): string | null {
    return getCookie("refreshToken")
  }

  // access token: 15분 (900s)
  setToken(token: string) {
    setCookie("accessToken", token, 900)
  }

  clearToken() {
    deleteCookie("accessToken")
  }

  // refresh token: 7일 (604800s)
  setRefreshToken(token: string) {
    setCookie("refreshToken", token, 604800)
  }

  clearRefreshToken() {
    deleteCookie("refreshToken")
  }

  private async tryRefresh(): Promise<boolean> {
    const rt = this.refreshToken
    if (!rt) {
      console.warn("[auth] refresh skipped: no refreshToken cookie")
      return false
    }
    try {
      console.info("[auth] attempting token refresh…")
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rt }),
      })
      const ct = res.headers.get("content-type") ?? ""
      const isJson = ct.includes("application/json")
      if (!res.ok) {
        let detail = ""
        if (isJson) {
          const body = await res.json().catch(() => null)
          detail = body?.error ? ` (${body.error})` : ""
        }
        console.warn(`[auth] refresh failed: ${res.status}${detail}`)
        return false
      }
      if (!isJson) {
        console.warn(`[auth] refresh response not JSON (content-type: ${ct || "none"})`)
        return false
      }
      const data = await res.json()
      if (!data?.accessToken) {
        console.warn("[auth] refresh response missing accessToken", data)
        return false
      }
      this.setToken(data.accessToken)
      if (data.refreshToken) this.setRefreshToken(data.refreshToken)
      console.info("[auth] refresh succeeded")
      return true
    } catch (err) {
      console.warn("[auth] refresh threw:", err)
      return false
    }
  }

  private async ensureRefreshed(): Promise<boolean> {
    if (!this.refreshing) {
      this.refreshing = this.tryRefresh().then((ok) => {
        this.refreshing = null
        if (!ok) {
          this.clearToken()
          this.clearRefreshToken()
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            console.warn("[auth] redirecting to /login (refresh failed)")
            window.location.href = "/login"
          }
        }
      })
    }
    await this.refreshing
    return !!this.accessToken
  }

  private async request<T>(path: string, init?: RequestInit, retried = false): Promise<T> {
    // accessToken이 없는데 refreshToken은 있으면 사전 refresh
    if (!this.accessToken && this.refreshToken && !retried) {
      const ok = await this.ensureRefreshed()
      if (!ok) throw new Error("Unauthorized")
    }

    const makeHeaders = (): HeadersInit => ({
      "Content-Type": "application/json",
      ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      ...init?.headers,
    })

    const res = await fetch(`${this.baseUrl}${path}`, { ...init, headers: makeHeaders() })
    const contentType = res.headers.get("content-type") ?? ""
    const isJson = contentType.includes("application/json")
    const isHtml = contentType.includes("text/html")

    // 401, 또는 (응답 실패 && HTML — 로그인 리다이렉트 추정) → refresh 후 1회 재시도
    // 성공(2xx) + 비-JSON(204 No Content, 빈 body 등)은 정상 응답으로 처리해야 함
    if ((res.status === 401 || (!res.ok && isHtml)) && !retried) {
      const ok = await this.ensureRefreshed()
      if (!ok) throw new Error("Unauthorized")
      return this.request<T>(path, init, true)
    }

    if (!res.ok) {
      let errMsg = `Request failed: ${res.status}`
      if (isJson) {
        const err: ApiError = await res.json().catch(() => ({ error: errMsg, statusCode: res.status }))
        errMsg = err.error ?? errMsg
      }
      throw new Error(errMsg)
    }

    if (res.status === 204) return null as T
    if (!isJson) {
      // 성공이지만 JSON이 아닐 때 (빈 body 등) — null 반환
      return null as T
    }
    return res.json()
  }

  get<T>(path: string) {
    return this.request<T>(path, { method: "GET" })
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(body) })
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, { method: "PATCH", body: JSON.stringify(body) })
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(BASE_URL)
