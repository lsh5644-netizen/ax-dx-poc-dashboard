import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AX/DX PoC 통합 관리 대시보드",
  description: "사내 현업 부서들이 발굴 및 수행하는 AX/DX PoC(시범 운영) 과제들의 실시간 현황 모니터링 및 관리 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col justify-between">
        <div>
          {/* Header */}
          <header className="sticky top-0 z-50 glass-panel border-b border-card-border backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-2.5 group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-between p-1.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                    <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors duration-200">
                      AX/DX PoC Dashboard
                    </h1>
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">K-CORP POC PORTAL</p>
                  </div>
                </Link>
              </div>

              <nav className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/40 px-3.5 py-2 rounded-lg transition-all duration-200"
                >
                  과제 현황판
                </Link>
                <Link
                  href="/project/new"
                  className="inline-flex items-center justify-between text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 px-4 py-2 rounded-lg transition-all duration-200 group gap-1.5"
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  신규 과제 등록
                </Link>
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="border-t border-card-border bg-slate-950/40 py-6 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} K-Corp AX/DX 시범운영 관리 포털. All rights reserved.
              </p>
              <p className="text-[10px] text-slate-600 mt-1">
                본 웹 어플리케이션은 Next.js Standalone 빌드 아키텍처 및 Supabase API Route Gateway 구조로 제작되어 사내 오프라인 폐쇄망 수동 이관에 최적화되어 있습니다.
              </p>
            </div>
            <div className="flex gap-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SaaS PoC Sandbox Mode
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50">
                Next.js v15 Standalone
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
