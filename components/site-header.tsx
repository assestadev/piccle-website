"use client"

import { useRouter } from "next/navigation"

export function SiteHeader() {
  const router = useRouter()

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
          ASTRA
        </button>
        <button
          onClick={() => router.push("/inquiry")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          문의하기
        </button>
      </div>
    </header>
  )
}
