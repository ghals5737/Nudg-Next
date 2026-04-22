import { NextResponse } from "next/server"

const SPRING_URL = process.env.API_URL?.replace("/api", "") ?? "http://localhost:4000"

export function GET() {
  return NextResponse.redirect(`${SPRING_URL}/oauth2/authorization/google`)
}
