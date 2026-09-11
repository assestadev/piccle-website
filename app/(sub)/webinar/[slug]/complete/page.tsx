import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWebinarBySlug, webinars } from "@/lib/webinars"
import { WebinarBreadcrumb } from "@/components/webinar/webinar-breadcrumb"

export function generateStaticParams() {
  return webinars.map((w) => ({ slug: w.slug }))
}

export default async function WebinarCompletePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const webinar = getWebinarBySlug(slug)
  if (!webinar) notFound()

  return (
    <div style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}>
      <WebinarBreadcrumb title={webinar.title} />

      <main className="flex flex-col items-center gap-2.5 px-6 py-20 text-center min-[900px]:min-h-[420px] min-[900px]:justify-center min-[900px]:py-16">
        <Image src="/webinar-assets/icon-check-circle.svg" alt="" width={32} height={32} />
        <h1 className="m-0 text-2xl font-bold text-[#15172b] min-[900px]:text-[30px]">신청이 완료되었어요</h1>
        <p className="m-0 text-base leading-snug text-[#15172b] min-[900px]:text-lg">
          웨비나 하루 전, 입력하신 이메일로
          <br />
          참여 링크를 보내드릴게요
        </p>
        <Link
          href="/webinar"
          className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#e1e1e1] bg-white px-5 py-2.5 text-sm font-bold text-[#222]"
        >
          다른 세미나 보러가기
        </Link>
      </main>
    </div>
  )
}
