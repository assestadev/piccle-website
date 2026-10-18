export type LandingPopupItem = {
  id: string
  imageUrl: string
  /** 비워두거나 "#"이면 이미지만 노출되고 클릭되지 않음 */
  linkUrl?: string
  alt: string
  hideForHours?: number
  enabled?: boolean
}

// 배열 순서대로 겹쳐서 표시됨 (첫 번째가 맨 앞)
export const LANDING_POPUPS: LandingPopupItem[] = [
  {
    id: "2026-holiday10",
    imageUrl: "https://img.assesta.com/popup/2026_holiday08_02.jpg",
    linkUrl: "https://www.career4u.net/Board/Board_View.asp?Seq=17067&nowPage=1&Board_Cd=A051",
    alt: "10월 휴무안내",
    hideForHours: 24,
    enabled: false,
  },
  {
    id: "2026-10-18-system-maintenance",
    imageUrl: "https://img.assesta.com/popup/2026_notice_08.jpg",
    linkUrl: "#",
    alt: "시스템 점검에 따른 서비스 이용 제한 안내",
    hideForHours: 24,
    enabled: false,
  },
]
