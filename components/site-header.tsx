"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { isServicePreviewEnabled } from "@/lib/service-preview"
import { SITE_HEADER_LOGO_ALT, SITE_HEADER_LOGO_SRC } from "@/lib/brand-config"

const SCROLL_NAV = [
  { label: "솔루션", id: "solution" },
  { label: "활용사례", id: "usecase" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const isMain = pathname === "/"
  const isServicePage = pathname === "/service"
  const isSeminarSection = pathname === "/seminar" || pathname.startsWith("/seminar/")
  const servicePreviewEnabled = isServicePreviewEnabled()

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
            src={SITE_HEADER_LOGO_SRC}
            alt={SITE_HEADER_LOGO_ALT}
            width={100}
            height={36}
            style={{ width: "100px", height: "auto" }}
          />
        </button>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* 메인 페이지에서만 솔루션/활용사례/보안정책 노출, "세미나"는 모든 페이지에서 항상 노출.
              서브페이지(메인이 아닐 때)에서는 "홈"을 맨 앞에 추가로 노출 — 로고 클릭만으로는
              홈 이동이 잘 안 보인다는 피드백 반영. 메인 페이지 자체에는 "홈"을 넣지 않음. */}
          <nav className="hidden items-center gap-8 md:flex">
            {!isMain && (
              <Link
                href="/"
                className="cursor-pointer text-sm font-medium text-slate-600 transition-colors hover:text-[#1e4fa8]"
              >
                홈
              </Link>
            )}
            {isMain && (
              <button
                onClick={() => scrollTo(SCROLL_NAV[0].id)}
                className="cursor-pointer text-sm font-medium text-slate-600 transition-colors hover:text-[#1e4fa8]"
              >
                {SCROLL_NAV[0].label}
              </button>
            )}
            {isMain && (
              <button
                onClick={() => scrollTo(SCROLL_NAV[1].id)}
                className="cursor-pointer text-sm font-medium text-slate-600 transition-colors hover:text-[#1e4fa8]"
              >
                {SCROLL_NAV[1].label}
              </button>
            )}
            {isMain && (
              <button
                onClick={() => scrollTo("trust")}
                className="cursor-pointer text-sm font-medium text-slate-600 transition-colors hover:text-[#1e4fa8]"
              >
                보안 정책
              </button>
            )}
            <Link
              href="/seminar"
              className={`cursor-pointer text-sm font-medium transition-colors ${
                isSeminarSection ? "font-bold text-[#0f2d6e]" : "text-slate-600 hover:text-[#1e4fa8]"
              }`}
            >
              세미나
            </Link>
          </nav>

          {servicePreviewEnabled && (isMain || isServicePage) && (
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
