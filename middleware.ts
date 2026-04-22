import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/login", "/api/oauth2", "/api/auth"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get("accessToken")?.value ?? null

  console.log(`[middleware] ${pathname} | token: ${token ? "있음" : "없음"}`)

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 토큰 있는데 로그인 페이지 접근 → 홈으로
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}
