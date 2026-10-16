import Image from "next/image"
import Link from "next/link"
import { SeminarBreadcrumb } from "@/components/seminar/seminar-breadcrumb"

export default function DownloadCompletePage() {
  return (
    <div style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}>
      <SeminarBreadcrumb title="PICCLE 자료집 신청" />

      <main className="flex flex-col items-center gap-2.5 px-6 py-20 text-center min-[900px]:min-h-[420px] min-[900px]:justify-center min-[900px]:py-16">
        <Image src="/seminar-assets/icon-check-circle.svg" alt="" width={32} height={32} />
        <h1 className="m-0 text-2xl font-bold text-[#15172b] min-[900px]:text-[30px]">자료집을 메일로 보내드렸어요</h1>
        <p className="m-0 text-base leading-snug text-[#15172b] min-[900px]:text-lg">
          입력하신 메일함에서 다운로드 링크를 확인해 주세요😊
        </p>
        <p className="m-0 text-sm text-[#9296a6]">메일이 보이지 않으면 스팸함도 함께 확인해 주세요.</p>
        <Link
          href="/seminar"
          className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#e1e1e1] bg-white px-5 py-2.5 text-sm font-bold text-[#222]"
        >
          PICCLE 세미나 보러가기
        </Link>
      </main>
    </div>
  )
}
