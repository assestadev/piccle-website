"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

const MAIN_NAV = [
  // { label: "문제 제기", id: "problem" },
  { label: "솔루션",    id: "solution" },
  { label: "활용사례",  id: "usecase" },
  { label: "보안 정책", id: "trust" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const isMain = pathname === "/"

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div
        className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between"
        style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
      >
        <button
          onClick={() => { window.location.href = "/" }}
          className="cursor-pointer"
        >
          <Image
            src="https://img.assesta.com/piccle/logo.png"
            alt="Piccle"
            width={100}
            height={36}
            style={{ width: "100px", height: "auto" }}
          />
        </button>

        {/* 우측 메뉴 그룹 */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* 메인 페이지 전용 섹션 네비게이션 */}
          {isMain && (
            <nav className="hidden md:flex items-center gap-8">
              {MAIN_NAV.map(n => (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className="cursor-pointer text-sm text-slate-600 hover:text-[#1e4fa8] transition-colors font-medium"
                >
                  {n.label}
                </button>
              ))}
            </nav>
          )}
          <button
            onClick={() => { window.location.href = "/service" }}
            className={`cursor-pointer text-sm font-medium transition-colors ${
              pathname === "/service"
                ? "text-[#1e4fa8] font-semibold"
                : "text-slate-600 hover:text-[#1e4fa8]"
            }`}
          >
            서비스 소개
          </button>
          <button
            onClick={() => { window.location.href = "/inquiry" }}
            className="cursor-pointer inline-flex items-center gap-1.5 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white text-sm font-semibold px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-colors"
          >
            문의하기
          </button>
        </div>
      </div>
    </header>
  )
}
