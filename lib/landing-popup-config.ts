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
    linkUrl: "https://www.career4u.net/Board/Board_View.asp?Seq=16807&nowPage=1&Board_Cd=A051&Board_Sub_Cd=0&fb_t=%BC%AD%B9%F6%B1%B3%C3%BC+%BE%C8%B3%BB",
    alt: "서버교체안내",
    hideForHours: 24,
    enabled: true,
  },
]
