"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

type LandingPopupItem = {
  id: string
  imageUrl: string
  linkUrl: string
  alt: string
  visible: boolean
  hideForHours?: number
}

const POPUP_HIDE_HOURS = 24

const LANDING_POPUPS: LandingPopupItem[] = [
  {
    id: "2026-holiday04",
    imageUrl: "https://img.assesta.com/popup/2026_holiday04_02.jpg",
    linkUrl: "https://www.career4u.net/Board/Board_View.asp?Seq=16590&nowPage=1&Board_Cd=A051",
    alt: "6월 휴무 안내 팝업",
    visible: false,
    hideForHours: 24,
  },
]

const getStorageKey = (id: string) => `landing-popup:${id}:hidden-until`

export function LandingPopup() {
  const [mounted, setMounted] = useState(false)
  const [closedIds, setClosedIds] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const activePopups = useMemo(() => {
    if (!mounted) return []

    const now = Date.now()

    return LANDING_POPUPS.filter((popup) => {
      if (!popup.visible) return false

      const hiddenUntil = window.localStorage.getItem(getStorageKey(popup.id))
      return !hiddenUntil || Number(hiddenUntil) <= now
    }).filter((popup) => !closedIds.includes(popup.id))
  }, [closedIds, mounted])

  const closePopup = (id: string) => {
    setClosedIds((prev) => [...prev, id])
  }

  const hideForToday = (id: string) => {
    const popup = LANDING_POPUPS.find((item) => item.id === id)
    const hideForHours = popup?.hideForHours ?? POPUP_HIDE_HOURS
    const hiddenUntil = Date.now() + hideForHours * 60 * 60 * 1000
    window.localStorage.setItem(getStorageKey(id), String(hiddenUntil))
    closePopup(id)
  }

  if (!mounted || activePopups.length === 0) return null

  return (
    <div className="pointer-events-none fixed left-3 top-24 z-[60] max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 sm:left-5 md:top-28">
      <div className="flex flex-col gap-4">
        {activePopups.map((popup) => (
          <div
            key={popup.id}
            className="pointer-events-auto w-[min(360px,calc(100vw-24px))] overflow-hidden border border-slate-900 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.28)]"
          >
            <a
              href={popup.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer"
              aria-label={popup.alt}
            >
              <Image
                src={popup.imageUrl}
                alt={popup.alt}
                width={360}
                height={520}
                priority
                className="h-auto w-full"
              />
            </a>

            <div className="flex items-center justify-between gap-3 bg-black px-3 py-2 text-white">
              <button
                type="button"
                onClick={() => hideForToday(popup.id)}
                className="cursor-pointer text-[13px] leading-none text-white transition-opacity hover:opacity-80"
              >
                오늘 하루 이 창 열지 않기
              </button>
              <button
                type="button"
                onClick={() => closePopup(popup.id)}
                className="cursor-pointer rounded border border-white/40 px-2 py-1 text-[12px] leading-none text-white transition-opacity hover:opacity-80"
              >
                닫기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
