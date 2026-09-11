// 웨비나 카드/히어로/상세 안의 브랜드 마크 이미지 설정.
// 헤더/푸터 로고는 사이트 전역 설정인 lib/brand-config.ts에서 관리함(웨비나 페이지도 그걸 그대로 씀).
// 헤더/푸터는 ASSESTA를 쓰지만, 카드/히어로/상세 안의 브랜드 마크는 PICCLE 로고를 쓰기로 확정됨(2026-09-11).
// ASSESTA로 다시 바꾸고 싶으면 아래 두 상수만 "/brand/assesta-logo-dark.svg" / "ASSESTA"로 바꾸면 됨.
export const WEBINAR_CARD_MARK_SRC = "/webinar-assets/piccle-logo-mark.svg"
export const WEBINAR_CARD_MARK_ALT = "PICCLE"

// 되돌릴 때 참고용 원본 값 (삭제하지 말 것)
export const PICCLE_LOGO_MARK_SRC = "/webinar-assets/piccle-logo-mark.svg"
