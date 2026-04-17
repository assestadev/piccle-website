// import type { Metadata } from 'next' // TODO: 메타데이터 확정 후 주석 해제
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

// TODO: 아래 항목 확정 후 주석 해제
// - BASE_URL: 실제 도메인 확정 필요
// - title / description: 카피 문구 확정 필요
// - og-image.png: 이미지 파일 제작 필요
// - openGraph / twitter: 위 항목 확정 후 함께 반영
//
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://piccle.assesta.com'
//
// export const metadata: Metadata = {
//   title: 'Piccle | AI 기반 역량 모델 HR 솔루션',
//   description: 'AI와 HR 전문가의 협업으로 채용부터 육성까지 연결되는 역량 기준을 제공합니다. 피클(Piccle)로 조직의 일 잘하는 기준을 3초 만에 도출하세요.',
//   metadataBase: new URL(BASE_URL),
//   openGraph: {
//     type: 'website',
//     url: BASE_URL,
//     siteName: 'Piccle',
//     title: 'Piccle | AI 기반 역량 모델 HR 솔루션',
//     description: 'AI와 HR 전문가의 협업으로 채용부터 육성까지 연결되는 역량 기준을 제공합니다. 피클(Piccle)로 조직의 일 잘하는 기준을 3초 만에 도출하세요.',
//     images: [
//       {
//         url: '/og-image.png',
//         width: 1200,
//         height: 630,
//         alt: 'Piccle — AI 기반 역량 모델 HR 솔루션',
//       },
//     ],
//     locale: 'ko_KR',
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'Piccle | AI 기반 역량 모델 HR 솔루션',
//     description: 'AI와 HR 전문가의 협업으로 채용부터 육성까지 연결되는 역량 기준을 제공합니다.',
//     images: ['/og-image.png'],
//   },
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="https://img.assesta.com/piccle/favicon.png" type="image/png" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
