// 사이트 전역(헤더/푸터) 로고 설정.
// 기존엔 피클(Piccle) 로고를 썼으나, 요청에 따라 ASSESTA 로고로 교체함.
// 원본 피클 로고는 삭제하지 않고 URL을 아래 주석으로 보존 — 되돌릴 땐 이 값을
// SITE_HEADER_LOGO_SRC / SITE_FOOTER_LOGO_SRC 자리에 다시 넣으면 됨.
// 원본 헤더 로고: https://img.assesta.com/piccle/logo.png (alt="Piccle")
// 원본 푸터 로고: https://img.assesta.com/piccle/logo_wh.png (alt="Piccle")

export const SITE_HEADER_LOGO_SRC = "/brand/assesta-logo-dark.svg"
export const SITE_HEADER_LOGO_ALT = "ASSESTA"

export const SITE_FOOTER_LOGO_SRC = "/brand/assesta-logo-white.svg"
export const SITE_FOOTER_LOGO_ALT = "ASSESTA"

// 되돌릴 때 참고용 원본 값 (지우지 말 것)
export const PICCLE_HEADER_LOGO_SRC = "https://img.assesta.com/piccle/logo.png"
export const PICCLE_FOOTER_LOGO_SRC = "https://img.assesta.com/piccle/logo_wh.png"
