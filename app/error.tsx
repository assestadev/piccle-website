"use client"

import { useEffect } from "react"

export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      className="min-h-screen bg-[#f7f9fd] flex flex-col items-center justify-center px-4"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      <div className="text-center max-w-md w-full">
        {/* 500 숫자 */}
        <p className="text-[120px] font-black leading-none text-[#e8edf6] select-none mb-2">
          500
        </p>

        {/* 아이콘 */}
        <div className="flex items-center justify-center mb-6 -mt-4">
          <div className="w-16 h-16 rounded-2xl bg-[#fff0f0] flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        <p className="text-xs font-bold tracking-widest text-red-400 uppercase mb-3">Server Error</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          오류가 발생했습니다
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          일시적인 오류가 발생했습니다.<br />
          잠시 후 다시 시도해 주세요.
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          홈으로 돌아가기
        </a>
      </div>
    </div>
  )
}
