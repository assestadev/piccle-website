import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

//26.9.15 네이버,GA tag삽입
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://hr.assesta.com'
const GA_ID = 'G-1H518NNWT3'
const NAVER_VERIFICATION = '0986f1451b775fbf109ec7e4e950edbdd4915ded'
// 

export const metadata: Metadata = {
  title: 'Piccle | HR-AI 워크스페이스',
  description:
    '역량모델링부터 채용·진단·인적성검사·배치·교육·개발·코칭 까지 HR의 모든 과정을 잇는 HR–AI 통합 워크스페이스',
  metadataBase: new URL(BASE_URL),
  verification: {
    google: [
      'X67Aqf0oigPLAkwFLLsHBnVctTXBdQnjWLeTljPMv5s',
      'zEG3wNg_gjRlGli7X3Ng2abmqNPET3V79R6cs8oaKRo',
    ],
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'Piccle',
    title: 'Piccle | HR-AI 워크스페이스',
    description:
      '역량모델링부터 채용·진단·인적성검사·배치·교육·개발·코칭 까지 HR의 모든 과정을 잇는 HR–AI 통합 워크스페이스',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Piccle | HR-AI 워크스페이스',
      },
    ],
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piccle | HR-AI 워크스페이스',
    description:
      '역량모델링부터 채용·진단·인적성검사·배치·교육·개발·코칭 까지 HR의 모든 과정을 잇는 HR–AI 통합 워크스페이스',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content={NAVER_VERIFICATION} />
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="hH11kSTPlKeDg6A+TMhtSA"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
