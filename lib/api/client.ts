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

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private get accessToken(): string | null {
    return getCookie("accessToken")  // 인코딩 없이 저장하므로 그대로 읽기
  }

  // 15분 (Spring Boot access-token-expiry: 900)
  setToken(token: string) {
    setCookie("accessToken", token, 900)
  }

  clearToken() {
    deleteCookie("accessToken")
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
      ...init?.headers,
    }

    const res = await fetch(`${this.baseUrl}${path}`, { ...init, headers })

    if (!res.ok) {
      if (res.status === 401) {
        this.clearToken()
        window.location.href = "/login"
        throw new Error("Unauthorized")
      }
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
