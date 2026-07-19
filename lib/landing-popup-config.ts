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
    imageUrl: "https://img.assesta.com/popup/2026_holiday05_02.jpg",
    linkUrl: "https://www.career4u.net/Board/Board_View.asp?Seq=16756&nowPage=1&Board_Cd=A051",
    alt: "7월 휴무 안내 팝업",
    hideForHours: 24,
    enabled: false,
  },
]
