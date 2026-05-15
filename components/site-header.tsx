"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"

const isServicePreviewEnabled = process.env.NEXT_PUBLIC_SERVICE_PREVIEW === "true"

const MAIN_NAV = [
  { label: "솔루션", id: "solution" },
  { label: "활용사례", id: "usecase" },
  { label: "보안 정책", id: "trust" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const isMain = pathname === "/"
  const isServicePage = pathname === "/service"

  const scrollTo = (id: string) => {
    if (isMain) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
      return
    }

    window.location.href = `/#${id}`
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/60 bg-white/96 shadow-sm backdrop-blur-xl">
      <div
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
      >
        <button onClick={() => { window.location.href = "/" }} className="cursor-pointer">
          <Image
            src="https://img.assesta.com/piccle/logo.png"
            alt="Piccle"
            width={100}
            height={36}
            style={{ width: "100px", height: "auto" }}
          />
        </button>

        <div className="flex items-center gap-3 sm:gap-6">
          {isMain && (
            <nav className="hidden items-center gap-8 md:flex">
              {MAIN_NAV.map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => scrollTo(nav.id)}
                  className="cursor-pointer text-sm font-medium text-slate-600 transition-colors hover:text-[#1e4fa8]"
                >
                  {nav.label}
                </button>
              ))}
            </nav>
          )}

          {isServicePreviewEnabled && (isMain || isServicePage) && (
            <button
              onClick={() => { window.location.href = "/service" }}
              className="hidden cursor-pointer text-sm font-semibold text-[#1e4fa8] transition-colors hover:text-[#0f2d6e] md:inline-flex"
            >
              서비스 소개
            </button>
          )}

          <button
            onClick={() => { window.location.href = "/inquiry" }}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-[#0f2d6e] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e4fa8] sm:px-5 sm:py-2.5"
          >
            문의하기
          </button>
        </div>
      </div>
    </header>
  )
}
