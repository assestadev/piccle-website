import Image from "next/image"
import Link from "next/link"
import { DownloadForm, type DownloadUtm } from "@/components/seminar/download-form"
import { DOWNLOAD_POSITION_OPTIONS, getActiveDownloadResources } from "@/lib/download-resources"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function firstParam(value: string | string[] | undefined, maxLength = 100) {
  return (Array.isArray(value) ? value[0] : value)?.slice(0, maxLength)
}

export default async function DownloadFormPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  // 홍보메일 링크(?topic=doc-001 또는 ?topic=doc-001,doc-002)로 들어오면 그 자료들만 보여준다 — 다른 자료는 고를 수 없고,
  // 지정된 자료가 숨김(N)이 됐으면 다른 자료로 바꿔치기하지 않고 빼거나(전부 숨김이면 마감 안내) 한다.
  // topic 없이 들어오면 노출 중인 자료 전체에서 고른다.
  // 여러 자료를 묶은 링크가 잘리지 않도록 topic은 넉넉히 받는다 (API는 최대 10개까지 허용)
  const topicSlugs = [...new Set((firstParam(params.topic, 500) ?? "").split(",").map((t) => t.trim()).filter(Boolean))].slice(0, 10)
  const active = await getActiveDownloadResources()
  const matched = topicSlugs.length > 0 ? active.filter((r) => topicSlugs.includes(r.slug)) : active
  const topicClosed = topicSlugs.length > 0 && matched.length === 0
  // pdfUrl은 화면에 필요 없으므로 자료명만 클라이언트로 전달
  const resources = matched.map(({ slug, title }) => ({ slug, title }))
  const utm: DownloadUtm = {
    source: firstParam(params.utm_source),
    medium: firstParam(params.utm_medium),
    campaign: firstParam(params.utm_campaign),
    content: firstParam(params.utm_content),
  }

  return (
    <div
      className="pt-20"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      {/* 화면 폭에 비례해 커지면 넓은 모니터에서 폼이 밀려 내려가므로 높이를 고정하고, 이미지 배경색(#17181a)으로 좌우를 채운다 */}
      <div className="relative h-[120px] w-full overflow-hidden bg-[#17181a] min-[600px]:h-[200px] min-[900px]:h-[272px]">
        <Image src="/seminar-assets/download-header.png" alt="PICCLE" fill priority sizes="100vw" className="object-contain" />
      </div>

      <main className="mx-auto flex max-w-[560px] flex-col gap-8 px-4 py-12 min-[900px]:py-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#eef1fb] px-3 py-1 text-xs font-bold text-[#2f5eff]">
            무료 리소스
          </span>
          <h1 className="m-0 text-2xl font-bold leading-tight text-[#15172b] min-[900px]:text-[30px]">PICCLE 리소스 받아보기 📂</h1>
          <p className="m-0 text-[15px] leading-relaxed text-[#6d7180]">
            아래 정보를 남겨주시면
            <br />
            입력하신 메일로 리소스 다운로드 링크를 바로 보내드려요.
          </p>
        </div>

        {resources.length > 0 ? (
          // key: 다른 자료 링크로 이동하면 선택 상태를 새로 시작하도록 폼을 다시 만든다
          <DownloadForm key={resources.map((r) => r.slug).join(",")} resources={resources} positions={DOWNLOAD_POSITION_OPTIONS} utm={utm} />
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-xl bg-[#f9f9f9] px-5 py-8 text-center">
            <p className="m-0 text-base font-bold text-[#15172b]">
              {topicClosed ? "신청이 마감된 리소스예요." : "지금은 신청 가능한 리소스가 없어요."}
            </p>
            <Link
              href="/seminar"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[#e1e1e1] bg-white px-5 py-2.5 text-sm font-bold text-[#222]"
            >
              PICCLE 세미나 보러가기
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
