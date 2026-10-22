// 웨비나 카드/히어로/상세 안의 브랜드 마크 이미지 설정.
// 헤더/푸터 로고는 사이트 전역 설정인 lib/brand-config.ts에서 관리함(웨비나 페이지도 그걸 그대로 씀).
// 헤더/푸터는 ASSESTA를 쓰지만, 카드/히어로/상세 안의 브랜드 마크는 PICCLE 로고를 쓰기로 확정됨(2026-09-11).
// ASSESTA로 다시 바꾸고 싶으면 아래 두 상수만 "/brand/assesta-logo-dark.svg" / "ASSESTA"로 바꾸면 됨.
export const SEMINAR_CARD_MARK_SRC = "/seminar-assets/piccle-logo-mark.svg"
export const SEMINAR_CARD_MARK_ALT = "PICCLE"

// 히어로 배너 / 상세페이지 배너 전용 마크 (2026-09-17 Figma 업데이트 반영: "PICCLE HOUR" 풀 워드마크, 194x20 비율)
export const SEMINAR_BANNER_MARK_SRC = "/seminar-assets/piccle-hour-logo-mark.svg"
export const SEMINAR_BANNER_MARK_ALT = "PICCLE HOUR"

// 오프라인 세미나 배너 전용 마크 (2026-10-21 Figma '추가' 섹션: "PICCLE SHARE" 워드마크, 203x21 비율)
export const SEMINAR_OFFLINE_BANNER_MARK_SRC = "/seminar-assets/piccle-share-logo-mark.svg"
export const SEMINAR_OFFLINE_BANNER_MARK_ALT = "PICCLE SHARE"

/** 온라인 = PICCLE HOUR, 오프라인 = PICCLE SHARE. 카드/히어로/상세 배너가 전부 이 함수로 마크를 고른다 */
export function getSeminarBannerMark(dataType: "online" | "offline") {
  return dataType === "offline"
    ? { src: SEMINAR_OFFLINE_BANNER_MARK_SRC, alt: SEMINAR_OFFLINE_BANNER_MARK_ALT, width: 203, height: 21 }
    : { src: SEMINAR_BANNER_MARK_SRC, alt: SEMINAR_BANNER_MARK_ALT, width: 194, height: 20 }
}

// 되돌릴 때 참고용 원본 값 (삭제하지 말 것)
export const PICCLE_LOGO_MARK_SRC = "/seminar-assets/piccle-logo-mark.svg"
