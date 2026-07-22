export type LandingPopupItem = {
  id: string
  imageUrl: string
  linkUrl: string
  alt: string
  hideForHours?: number
  enabled?: boolean
}

export const LANDING_POPUPS: LandingPopupItem[] = [
  {
    id: "2026-holiday05",
    imageUrl: "https://img.assesta.com/popup/2026_notice_06.jpg",
    linkUrl: "#",
    alt: "서버교체안내",
    hideForHours: 24,
    enabled: true,
  },
]
