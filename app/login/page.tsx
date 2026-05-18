"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { authApi } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EEF1F5]" />}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Spring Boot OAuth 콜백: /login?token=xxx
  useEffect(() => {
    const token = searchParams.get("token")
    const refresh = searchParams.get("refreshToken")
    console.log("[login] OAuth callback check:", {
      url: typeof window !== "undefined" ? window.location.href : "(ssr)",
      hasToken: !!token,
      tokenPreview: token ? `${token.slice(0, 20)}…` : null,
      hasRefresh: !!refresh,
      refreshPreview: refresh ? `${refresh.slice(0, 20)}…` : null,
    })
    if (token) {
      apiClient.setToken(token)
      if (refresh) apiClient.setRefreshToken(refresh)
      console.log("[login] cookies after setToken/setRefreshToken:", document.cookie)
      console.log("[login] navigating to /")
      router.replace("/")
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = mode === "login"
        ? await authApi.login({ email, password })
        : await authApi.signup({ name, email, password })
      apiClient.setToken(res.accessToken)
      if (res.refreshToken) apiClient.setRefreshToken(res.refreshToken)
      router.replace("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF1F5] flex items-center justify-center px-4 selection:bg-[#E8F0FC] selection:text-[#00534d]">

      {/* 배경 블러 오브 */}
      <div className="pointer-events-none fixed -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#E8F0FC] opacity-10 blur-[100px]" />
      <div className="pointer-events-none fixed -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-[#1F76EB] opacity-10 blur-[120px]" />

      <div className="relative w-full max-w-md">

        {/* 로고 */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-[#1F76EB] flex items-center justify-center shadow-[0px_12px_32px_rgba(31,118,235,0.25)] mb-4">
            <span className="material-symbols-outlined text-3xl text-[#ffffff]" style={{ fontVariationSettings: "'FILL' 1" }}>
              self_improvement
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Nudg</h1>
          <p className="text-[#6B7280] mt-1 text-sm">하루를 부드럽게 이어가세요</p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-[2rem] shadow-[0px_24px_64px_rgba(31,41,55,0.08)] p-8">

          {/* 탭 */}
          <div className="flex bg-[#EEF1F5] rounded-xl p-1 mb-8">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  mode === m
                    ? "bg-white text-[#1F76EB] shadow-[0px_4px_12px_rgba(31,41,55,0.08)]"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                {m === "login" ? "로그인" : "회원가입"}
              </button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-sm rounded-xl px-4 py-3 mb-2">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* 이름 (회원가입만) */}
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">이름</label>
                <div className="flex items-center gap-3 bg-[#EEF1F5] rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#1F76EB]/20 transition-all">
                  <span className="material-symbols-outlined text-xl text-[#6B7280]">person</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    required
                    className="flex-1 bg-transparent text-[#1F2937] placeholder:text-[#6B7280] text-base outline-none"
                  />
                </div>
              </div>
            )}

            {/* 이메일 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">이메일</label>
              <div className="flex items-center gap-3 bg-[#EEF1F5] rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#1F76EB]/20 transition-all">
                <span className="material-symbols-outlined text-xl text-[#6B7280]">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  required
                  className="flex-1 bg-transparent text-[#1F2937] placeholder:text-[#6B7280] text-base outline-none"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">비밀번호</label>
                {mode === "login" && (
                  <button type="button" className="text-xs text-[#1F76EB] hover:text-[#1F76EB] font-medium transition-colors">
                    비밀번호 찾기
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 bg-[#EEF1F5] rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#1F76EB]/20 transition-all">
                <span className="material-symbols-outlined text-xl text-[#6B7280]">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8자 이상"
                  required
                  minLength={8}
                  className="flex-1 bg-transparent text-[#1F2937] placeholder:text-[#6B7280] text-base outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#6B7280] hover:text-[#6B7280] transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-4 rounded-xl bg-[#1F76EB] text-[#ffffff] font-bold text-base shadow-[0px_12px_32px_rgba(31,118,235,0.2)] hover:shadow-[0px_16px_40px_rgba(31,118,235,0.28)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-[#ffffff]/30 border-t-[#ffffff] animate-spin" />
                  처리 중...
                </>
              ) : (
                <>
                  {mode === "login" ? "로그인" : "시작하기"}
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* 구분선 */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#EEF1F5]" />
            <span className="text-xs text-[#6B7280] font-medium">또는</span>
            <div className="flex-1 h-px bg-[#EEF1F5]" />
          </div>

          {/* 소셜 로그인 */}
          <button
            type="button"
            onClick={() => { window.location.href = "/api/oauth2/authorization/google" }}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-[#EEF1F5] bg-white hover:bg-[#EEF1F5] text-[#1F2937] font-semibold text-sm transition-colors duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path d="M43.6 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11c-.5 2.4-1.9 4.5-4 5.9v4.9h6.5c3.8-3.5 6.1-8.7 6.1-14.8z" fill="#4285F4"/>
              <path d="M24 44c5.4 0 10-1.8 13.3-4.8l-6.5-5c-1.8 1.2-4.1 1.9-6.8 1.9-5.2 0-9.6-3.5-11.2-8.3H5.1v5.2C8.4 39.1 15.7 44 24 44z" fill="#34A853"/>
              <path d="M12.8 27.8c-.4-1.2-.6-2.5-.6-3.8s.2-2.6.6-3.8v-5.2H5.1C3.8 17.5 3 20.7 3 24s.8 6.5 2.1 9z" fill="#FBBC05"/>
              <path d="M24 10.8c2.9 0 5.5 1 7.6 3l5.7-5.7C33.9 4.8 29.3 3 24 3 15.7 3 8.4 7.9 5.1 15l7.7 5.2c1.6-4.8 6-8.4 11.2-8.4z" fill="#EA4335"/>
            </svg>
            Google로 계속하기
          </button>
        </div>

        {/* 하단 텍스트 */}
        <p className="text-center text-xs text-[#6B7280] mt-6 leading-relaxed">
          계속하면 Nudg의{" "}
          <Link href="#" className="text-[#6B7280] underline underline-offset-2 hover:text-[#1F76EB] transition-colors">
            서비스 약관
          </Link>
          {" "}및{" "}
          <Link href="#" className="text-[#6B7280] underline underline-offset-2 hover:text-[#1F76EB] transition-colors">
            개인정보처리방침
          </Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  )
}
