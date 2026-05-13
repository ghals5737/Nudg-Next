import type { NextConfig } from "next";

// API_URL: Next.js 서버가 Spring Boot 로 프록시할 URL (서버 전용, 런타임 env).
// 로컬 개발: http://localhost:4000/api (.env.local)
// 운영: https://nudg.kr/api (컨테이너 실행 시 -e API_URL=... 로 주입)
const API_URL = process.env.API_URL ?? "https://nudg.kr/api";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
