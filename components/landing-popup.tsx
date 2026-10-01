"use client"

import Image from "next/image"
import { type CSSProperties, useEffect, useMemo, useState } from "react"

import { LANDING_POPUPS } from "@/lib/landing-popup-config"

const POPUP_HIDE_HOURS = 24
// 모바일에서 팝업이 여러 개일 때 뒤 팝업을 오른쪽 아래로 밀어 카드처럼 겹치는 간격(px)
const POPUP_CASCADE_OFFSET = 32

const hasLink = (linkUrl?: string): linkUrl is string => !!linkUrl && linkUrl !== "#"

const getStorageKey = (id: string) => `landing-popup:${id}:hidden-until`

const isPopupHidden = (id: string, now: number) => {
  const hiddenUntil = window.localStorage.getItem(getStorageKey(id))
  if (!hiddenUntil) return false

  const hiddenUntilNumber = Number(hiddenUntil)

  if (!Number.isFinite(hiddenUntilNumber)) {
    window.localStorage.removeItem(getStorageKey(id))
    return false
  }

  return hiddenUntilNumber > now
}

export function LandingPopup() {
  const [mounted, setMounted] = useState(false)
  const [closedIds, setClosedIds] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const activePopups = useMemo(() => {
    if (!mounted) return []

    const now = Date.now()

    return LANDING_POPUPS.filter((popup) => popup.enabled !== false)
      .filter((popup) => !closedIds.includes(popup.id))
      .filter((popup) => !isPopupHidden(popup.id, now))
  }, [closedIds, mounted])

  const closePopup = (id: string) => {
    setClosedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const hideForToday = (id: string) => {
    const popup = LANDING_POPUPS.find((item) => item.id === id)
    const hideForHours = popup?.hideForHours ?? POPUP_HIDE_HOURS
    const hiddenUntil = Date.now() + hideForHours * 60 * 60 * 1000

    window.localStorage.setItem(getStorageKey(id), String(hiddenUntil))
    closePopup(id)
  }

  if (!mounted || activePopups.length === 0) return null

  const cascadeSpread = (activePopups.length - 1) * POPUP_CASCADE_OFFSET

  return (
    <div className="pointer-events-none fixed left-3 top-24 z-[60] max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 sm:left-5 md:top-28">
      {/* 모바일: 카드처럼 겹침 / md 이상: 가로로 나란히 */}
      <div className="grid items-start md:flex md:gap-[5px]">
        {activePopups.map((popup, index) => (
          <div
            key={popup.id}
            className="pointer-events-auto ml-[var(--cascade)] mt-[var(--cascade)] w-[min(360px,calc(100vw-24px-var(--spread)))] shrink-0 overflow-hidden border border-slate-900 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.28)] [grid-area:1/1] md:ml-0 md:mt-0 md:w-[360px]"
            style={
              {
                "--cascade": `${index * POPUP_CASCADE_OFFSET}px`,
                "--spread": `${cascadeSpread}px`,
                zIndex: activePopups.length - index,
              } as CSSProperties
            }
          >
            {hasLink(popup.linkUrl) ? (
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
            ) : (
              <Image
                src={popup.imageUrl}
                alt={popup.alt}
                width={360}
                height={520}
                priority
                className="block h-auto w-full"
              />
            )}

            <div className="flex items-center justify-between gap-3 bg-black px-3 py-2 text-white">
              <button
                type="button"
                onClick={() => hideForToday(popup.id)}
                className="cursor-pointer text-[13px] leading-none text-white transition-opacity hover:opacity-80"
              >
                오늘 하루 보지 않기
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
