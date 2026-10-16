import Image from "next/image"
import { DownloadForm, type DownloadUtm } from "@/components/seminar/download-form"
import { DOWNLOAD_POSITION_OPTIONS, getActiveDownloadResources } from "@/lib/download-resources"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function firstParam(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.slice(0, 100)
}

export default async function DownloadFormPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  // pdfUrl은 화면에 필요 없으므로 자료명만 클라이언트로 전달
  const resources = getActiveDownloadResources().map(({ slug, title }) => ({ slug, title }))
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
            무료 자료집
          </span>
          <h1 className="m-0 text-2xl font-bold leading-tight text-[#15172b] min-[900px]:text-[30px]">PICCLE 자료집 받아보기 📂</h1>
          <p className="m-0 text-[15px] leading-relaxed text-[#6d7180]">
            아래 정보를 남겨주시면
            <br />
            입력하신 메일로 자료집 다운로드 링크를 바로 보내드려요.
          </p>
        </div>

        {resources.length > 0 ? (
          <DownloadForm
            resources={resources}
            positions={DOWNLOAD_POSITION_OPTIONS}
            defaultTopic={firstParam(params.topic)}
            utm={utm}
          />
        ) : (
          <p className="m-0 rounded-xl bg-[#f9f9f9] px-5 py-8 text-center text-base font-bold text-[#15172b]">
            지금은 신청 가능한 자료집이 없어요.
          </p>
        )}
      </main>
    </div>
  )
}
