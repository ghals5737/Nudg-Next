import { NextResponse } from "next/server"

// Spring Boot OAuth 시작점 — 브라우저가 이 URL 로 직접 리다이렉트되므로
// 반드시 외부 접근 가능한 절대 URL 이어야 함.
// 로컬: http://localhost:4000  /  운영: https://nudg.kr
const SPRING_URL = process.env.API_URL?.replace(/\/api\/?$/, "") ?? "https://nudg.kr"

export function GET() {
  return NextResponse.redirect(`${SPRING_URL}/oauth2/authorization/google`)
}
