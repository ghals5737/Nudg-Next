import type { ApiError } from "@/types/api"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"

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
    if (!rt) return false
    try {
      const res = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rt }),
      })
      if (!res.ok) return false
      const data = await res.json()
      this.setToken(data.accessToken)
      if (data.refreshToken) this.setRefreshToken(data.refreshToken)
      return true
    } catch {
      return false
    }
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const makeHeaders = (): HeadersInit => ({
      "Content-Type": "application/json",
      ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      ...init?.headers,
    })

    let res = await fetch(`${this.baseUrl}${path}`, { ...init, headers: makeHeaders() })

    if (res.status === 401) {
      // serialize concurrent refresh attempts
      if (!this.refreshing) {
        this.refreshing = this.tryRefresh().then((ok) => {
          this.refreshing = null
          if (!ok) {
            this.clearToken()
            this.clearRefreshToken()
            window.location.href = "/login"
          }
        })
      }
      await this.refreshing
      if (!this.accessToken) throw new Error("Unauthorized")
      // retry with new token
      res = await fetch(`${this.baseUrl}${path}`, { ...init, headers: makeHeaders() })
    }

    if (!res.ok) {
      const err: ApiError = await res.json().catch(() => ({
        error: "Unknown error",
        statusCode: res.status,
      }))
      throw new Error(err.error ?? `Request failed: ${res.status}`)
    }

    const contentType = res.headers.get("content-type")
    if (!contentType || res.status === 204) return null as T
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
