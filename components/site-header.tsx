"use client"

import { useRouter, usePathname } from "next/navigation"

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div
        className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between"
        style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
      >
        <button
          onClick={() => router.push("/")}
          className="cursor-pointer text-xl font-bold tracking-tight text-slate-900 hover:text-[#1e4fa8] transition-colors"
        >
          Piccle
        </button>
        {/* 우측 메뉴 그룹 — 서비스 소개 숨기려면 아래 button에 hidden 추가하세요 */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => router.push("/service")}
            className={`cursor-pointer text-sm font-medium transition-colors ${
              pathname === "/service"
                ? "text-[#1e4fa8] font-semibold"
                : "text-slate-600 hover:text-[#1e4fa8]"
            }`}
          >
            서비스 소개
          </button>
          <button
            onClick={() => router.push("/inquiry")}
            className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white text-sm font-semibold px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-colors"
          >
            문의하기
          </button>
        </div>
      </div>
    </header>
  )
}
