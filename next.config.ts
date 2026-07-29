import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // ✨ 'standalone'을 'export'로 변경
  images: {
    unoptimized: true, // 정적 내보내기 시 Next Image 최적화 비활성화 필수
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
