"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#f7f9fd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 1rem",
          fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "28rem", width: "100%" }}>
          <p style={{ fontSize: "7.5rem", fontWeight: 900, lineHeight: 1, color: "#e8edf6", userSelect: "none", marginBottom: "0.5rem" }}>
            500
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", marginTop: "-1rem" }}>
            <div style={{ width: "4rem", height: "4rem", borderRadius: "1rem", backgroundColor: "#fff0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", color: "#f87171", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Critical Error
          </p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>
            서비스에 문제가 발생했습니다
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            잠시 후 다시 시도해 주세요.<br />
            문제가 지속되면 담당자에게 문의해 주세요.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            <button
              onClick={reset}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                backgroundColor: "#0f2d6e", color: "#fff", fontWeight: 600,
                padding: "0.75rem 1.5rem", borderRadius: "0.75rem", fontSize: "0.875rem",
                border: "none", cursor: "pointer", width: "100%", maxWidth: "200px",
              }}
            >
              다시 시도
            </button>
            <a
              href="/"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                border: "1px solid #e2e8f0", backgroundColor: "#fff", color: "#334155",
                fontWeight: 600, padding: "0.75rem 1.5rem", borderRadius: "0.75rem",
                fontSize: "0.875rem", textDecoration: "none", width: "100%", maxWidth: "200px",
              }}
            >
              홈으로 돌아가기
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
