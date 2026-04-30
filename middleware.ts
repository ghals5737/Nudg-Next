import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/login", "/api/oauth2", "/api/auth"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get("accessToken")?.value ?? null
  const refreshToken = request.cookies.get("refreshToken")?.value ?? null
  // accessToken이 만료(15분)돼서 사라져도 refreshToken이 살아있으면(7일)
  // 인증된 세션으로 간주 — 클라이언트가 첫 API 호출 시 refresh 처리
  const hasSession = !!accessToken || !!refreshToken

  console.log(
    `[middleware] ${pathname} | access: ${accessToken ? "있음" : "없음"} | refresh: ${refreshToken ? "있음" : "없음"}`
  )

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!isPublic && !hasSession) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 세션 있는데 로그인 페이지 접근 → 홈으로
  if (isPublic && hasSession) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}
