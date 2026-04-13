import Link from "next/link"

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-[#f7f9fd] flex flex-col items-center justify-center px-4"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      <div className="text-center max-w-md w-full">
        {/* 404 숫자 */}
        <p className="text-[120px] font-black leading-none text-[#e8edf6] select-none mb-2">
          404
        </p>

        {/* 아이콘 */}
        <div className="flex items-center justify-center mb-6 -mt-4">
          <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#1e4fa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>

        <p className="text-xs font-bold tracking-widest text-[#1e4fa8] uppercase mb-3">Page Not Found</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          요청하신 페이지가 존재하지 않거나<br />
          이동되었을 수 있습니다.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
