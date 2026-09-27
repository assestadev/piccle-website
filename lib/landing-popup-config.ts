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
    id: "2026-holiday10",
    imageUrl: "https://img.assesta.com/popup/2026_holiday08_02.jpg",
    linkUrl: "https://www.career4u.net/Board/Board_View.asp?Seq=17067&nowPage=1&Board_Cd=A051",
    alt: "10월 휴무안내",
    hideForHours: 24,
    enabled: true,
  },
]
