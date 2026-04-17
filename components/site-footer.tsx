import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="bg-[#0b1f4a] pt-10 pb-6 px-5 sm:px-8">
      <div
        className="max-w-7xl mx-auto"
        style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
      >
        {/* 로고 */}
        <div className="mb-6">
          <Image
            src="https://img.assesta.com/piccle/logo_wh.png"
            alt="Piccle"
            width={100}
            height={36}
            style={{ width: "100px", height: "auto" }}
          />
        </div>

        {/* 사업자 정보 + 소셜 아이콘 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-x-0 gap-y-1 text-blue-200/60 text-sm">
            <span>대표이사 : 김명준</span>
            <span className="mx-3 text-blue-200/30">|</span>
            <span>개인정보 관리자 : 손성훈</span>
            <span className="mx-3 text-blue-200/30">|</span>
            <span>사업자등록번호 : 107-86-76668</span>
            <span className="mx-3 text-blue-200/30">|</span>
            <span>통신판매업신고 : 2022-서울영등포-0184</span>
            <span className="mx-3 text-blue-200/30">|</span>
            <a
              href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1078676668"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-blue-200/30 rounded px-2 py-0.5 text-xs text-blue-200/60 hover:text-blue-200 hover:border-blue-200/60 transition-colors"
            >
              사업자정보확인
            </a>
          </div>
          {/* 소셜 아이콘 */}
          {/* <div className="flex items-center gap-4 text-blue-200/50 shrink-0">
            <a href="#" aria-label="Instagram" className="hover:text-blue-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" aria-label="KakaoTalk" className="hover:text-blue-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.582 2 11c0 2.836 1.793 5.337 4.5 6.82L5.5 21l4.09-2.154C10.36 18.944 11.17 19 12 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-blue-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
              </svg>
            </a>
          </div> */}
        </div>

        {/* 주소 및 연락처 */}
        <div className="text-blue-200/50 text-sm space-y-1 mb-8">
          <p>서울시 영등포구 국회대로68길 11, 삼보호정빌딩 5, 6층(여의도동)</p>
          <p>
            <span>TEL (02)787-1400</span>
            <span className="mx-4">FAX (02)787-1408</span>
          </p>
          <p>assesta@assesta.com</p>
        </div>

        {/* 구분선 */}
        <div className="border-t border-blue-200/10 mb-5" />

        {/* 카피라이트 + 링크 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-blue-200/40 text-xs">
          <p>copyright ⓒ 2026 ASSESTAHRC All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-blue-200 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-blue-200 transition-colors">서비스 이용 약관</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
