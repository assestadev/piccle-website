# Piccle HR Project — Architecture

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript 5.7 |
| 스타일링 | Tailwind CSS 4 |
| UI 컴포넌트 | Radix UI (shadcn/ui) |
| 폰트 | Pretendard (CDN) |
| 배포/분석 | Vercel + Vercel Analytics |

---

## 디렉토리 구조

```
hr_project/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (메타데이터, 폰트, Analytics)
│   ├── globals.css         # 전역 CSS 변수 (Tailwind 테마, 색상 토큰)
│   └── page.tsx            # 랜딩 페이지 (유일한 페이지)
│
├── components/
│   ├── fade-in.tsx         # 스크롤 등장 애니메이션 컴포넌트
│   ├── animated-underline.tsx  # SVG 언더라인 드로잉 애니메이션 컴포넌트
│   ├── intel-graph.tsx     # 인터랙티브 파티클 캔버스 (격자 + 노드 + 마우스 반응)
│   ├── theme-provider.tsx  # 다크/라이트 모드 프로바이더
│   └── ui/                 # shadcn/ui 자동 생성 컴포넌트 (57개)
│       ├── button.tsx
│       ├── card.tsx
│       ├── use-mobile.tsx  # 모바일 감지 훅
│       ├── use-toast.ts    # 토스트 알림 훅
│       └── ...
│
├── lib/
│   └── utils.ts            # cn() 유틸 함수 (clsx + tailwind-merge)
│
├── hooks/                  # (비어있음 — 중복 파일 정리 후)
│
└── public/
    ├── logo.png
    ├── icon.svg
    ├── icon-light-32x32.png
    ├── icon-dark-32x32.png
    └── apple-icon.png
```

---

## 컴포넌트 설명

### `components/fade-in.tsx`
스크롤 시 요소가 나타나는 애니메이션 컴포넌트.
- `IntersectionObserver`로 뷰포트 진입 감지
- `direction` prop으로 등장 방향 지정 (`up` / `left` / `right` / `none`)
- `delay` prop으로 딜레이 조정 (ms)

```tsx
<FadeIn delay={200} direction="left">
  <SomeContent />
</FadeIn>
```

### `components/animated-underline.tsx`
타이틀 핵심어에 SVG 물결 언더라인을 그리는 컴포넌트.
- `IntersectionObserver`로 뷰포트 진입 시 `stroke-dashoffset` 애니메이션 실행
- 모바일(`< sm`)에서는 숨김 처리 (`hidden sm:block`)
- `color` prop으로 색상 및 opacity 조정

```tsx
<AnimatedUnderline color="rgba(59,130,246,0.4)" delay={300}>
  <span className="text-[#1e4fa8]">강조 텍스트</span>
</AnimatedUnderline>
```

### `components/intel-graph.tsx`
히어로 섹션 인터랙티브 배경 캔버스.
- Canvas API로 격자선, 부유 노드, 노드 연결선 렌더링
- 마우스 위치에 반응하여 노드가 커서 방향으로 당겨짐
- `requestAnimationFrame` 기반 60fps 루프
- 리사이즈 이벤트 대응

---

## 페이지 구조 (`app/page.tsx`)

단일 랜딩 페이지. 6개 섹션 + 헤더 + 푸터로 구성.

```
Page
├── Header (fixed, scroll-aware)
├── Hero        — 인터랙티브 배경 + 메인 카피 + CTA 버튼
├── Problem     #problem — 문제 제기 3-card 그리드
├── Solution    #solution — 솔루션 3-card 그리드 (Trust / What / How)
├── Use Case    #usecase — 활용사례 3-card 그리드
├── Trust       #trust — 보안 정책 (다크 섹션)
├── CTA         #cta — 도입 문의
└── Footer
```

섹션 데이터(카드 내용, 이미지 URL 등)는 파일 상단 상수로 분리:
- `PROBLEM_CARDS`
- `SOLUTION_CARDS`
- `USECASE_CARDS`
- `TRUST_CARDS`

---

## 디자인 토큰

| 용도 | 값 |
|------|----|
| 브랜드 네이비 (주) | `#0f2d6e` |
| 브랜드 블루 (보조) | `#1e4fa8` |
| 브랜드 블루 (라이트) | `#2563eb` |
| 배경 (연청) | `#f4f7fc`, `#f7f9fd` |
| 배경 (다크) | `#0b1f4a` |
| 언더라인 파랑 | `rgba(59,130,246,0.4)` |
| 언더라인 노랑 | `rgba(245,158,11,0.5)` |

---

## 제거된 중복 파일

리팩토링 과정에서 아래 파일들이 제거되었습니다.

| 제거 파일 | 이유 | 정본 위치 |
|-----------|------|-----------|
| `hooks/use-toast.ts` | `components/ui/use-toast.ts`와 완전 동일 | `components/ui/use-toast.ts` |
| `hooks/use-mobile.ts` | `components/ui/use-mobile.tsx`와 완전 동일 | `components/ui/use-mobile.tsx` |
| `styles/globals.css` | `app/globals.css`가 실제 사용되며 폰트 설정이 올바름 | `app/globals.css` |
