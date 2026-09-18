"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { Seminar } from "@/lib/seminars"
import { weekOfMonthLabel } from "@/lib/seminars"
import { SEMINAR_BANNER_MARK_ALT, SEMINAR_BANNER_MARK_SRC } from "@/lib/seminar-brand-config"

const AUTOPLAY_MS = 6000
const FADE_MS = 220

const PREVIEW_BG: Record<Seminar["previewBg"], string> = {
  blue: "bg-[#d6eefb]",
  peach: "bg-[#fbe2d4]",
}

const PREVIEW_BG_IMAGE: Record<Seminar["previewBg"], string> = {
  blue: "/seminar-assets/banner-bg-hero-blue.png",
  peach: "/seminar-assets/banner-bg-card-peach.png",
}

export function SeminarHero({ seminars }: { seminars: Seminar[] }) {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const current = seminars[index]
  const hasMultiple = seminars.length > 1

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!hasMultiple || paused || reducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % seminars.length)
    }, AUTOPLAY_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [hasMultiple, paused, seminars.length])

  const goTo = (nextIndex: number) => {
    if (!hasMultiple || nextIndex === index) return
    setFading(true)
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)
    fadeTimeoutRef.current = setTimeout(() => {
      setIndex(nextIndex)
      setFading(false)
    }, FADE_MS)
  }

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)
    }
  }, [])

  if (!current) return null

  return (
    <section
      className="mx-auto max-w-[1280px] px-4 py-8 min-[900px]:flex min-[900px]:justify-center min-[900px]:px-6 min-[900px]:py-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex w-full max-w-[1232px] flex-col gap-6 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-10">
        <div
          className="flex flex-col gap-4 transition-opacity duration-200 min-[900px]:max-w-[600px] min-[900px]:flex-1 min-[900px]:gap-[18px]"
          style={{ opacity: fading ? 0 : 1 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/[0.08] px-3 py-1 text-xs font-medium text-[#222]">
              {weekOfMonthLabel(current.listDateISO)}
            </span>
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#27afd2] px-3 py-1 text-xs font-bold text-white">
              {current.categoryTag}
            </span>
          </div>

          <h1 className="text-[26px] font-bold leading-[1.25] text-[#15172b] min-[900px]:text-[40px]">
            {current.title}
          </h1>
          <p className="text-[15px] leading-relaxed text-[#222] min-[900px]:text-lg">
            {current.listDesc ?? current.quoteDesc}
          </p>

          {hasMultiple && (
            <div className="mt-1 flex gap-2">
              <button
                aria-label="이전 웨비나"
                onClick={() => goTo((index - 1 + seminars.length) % seminars.length)}
                className="flex h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-full border border-black/25 bg-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                aria-label="다음 웨비나"
                onClick={() => goTo((index + 1) % seminars.length)}
                className="flex h-[41px] w-[41px] cursor-pointer items-center justify-center rounded-full border border-black/25 bg-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="mt-2 min-[900px]:mt-0 min-[900px]:w-[600px] min-[900px]:shrink-0">
          <Link
            href={`/seminar/${current.slug}`}
            className={`relative flex h-[175px] flex-col justify-center gap-1.5 overflow-hidden rounded-[15px] p-5 transition-opacity duration-200 min-[900px]:h-[336px] min-[900px]:rounded-[20px] ${PREVIEW_BG[current.previewBg]}`}
            style={{ opacity: fading ? 0 : 1 }}
          >
            <Image
              src={PREVIEW_BG_IMAGE[current.previewBg]}
              alt=""
              fill
              className="object-cover opacity-40"
            />
            <Image src={SEMINAR_BANNER_MARK_SRC} alt={SEMINAR_BANNER_MARK_ALT} width={194} height={20} className="relative h-auto w-[100px] min-[900px]:absolute min-[900px]:left-12 min-[900px]:top-14 min-[900px]:w-[194px]" />
            <p className="relative m-0 max-w-[60%] text-xs font-medium leading-tight min-[900px]:hidden">
              {current.title}
            </p>
            <div className="hidden min-[900px]:absolute min-[900px]:left-12 min-[900px]:top-24 min-[900px]:block min-[900px]:max-w-[360px]">
              <p className="m-0 text-2xl font-bold leading-tight">{current.bannerTitleBold ?? current.title}</p>
              {current.bannerTitleLines?.map((line) => (
                <p key={line} className="m-0 whitespace-nowrap text-2xl font-medium leading-tight">
                  {line}
                </p>
              ))}
            </div>
            <p className="relative m-0 text-base font-bold leading-tight min-[900px]:absolute min-[900px]:left-12 min-[900px]:top-[216px] min-[900px]:text-[32px]">
              {current.listDate}
              <br />
              {current.listTime}
            </p>
            <div className="absolute bottom-[14px] right-4 h-[78px] w-[78px] overflow-hidden rounded-full bg-white min-[900px]:bottom-8 min-[900px]:right-10 min-[900px]:h-[150px] min-[900px]:w-[150px]">
              <Image
                src={current.speakerPhoto}
                alt=""
                width={150}
                height={150}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
