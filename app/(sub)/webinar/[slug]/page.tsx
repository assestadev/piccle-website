import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWebinarBySlug, webinars } from "@/lib/webinars"
import { WEBINAR_CARD_MARK_ALT, WEBINAR_CARD_MARK_SRC } from "@/lib/webinar-brand-config"
import { WebinarBreadcrumb } from "@/components/webinar/webinar-breadcrumb"
import { RegistrationForm } from "@/components/webinar/registration-form"

const PREVIEW_BG: Record<string, string> = {
  blue: "bg-[#d6eefb]",
  peach: "bg-[#fbe2d4]",
}

const PREVIEW_BG_IMAGE: Record<string, string> = {
  blue: "/webinar-assets/banner-bg-detail-blue.png",
  peach: "/webinar-assets/banner-bg-card-peach.png",
}

export function generateStaticParams() {
  return webinars.map((w) => ({ slug: w.slug }))
}

export default async function WebinarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const webinar = getWebinarBySlug(slug)
  if (!webinar) notFound()

  const eventDate = webinar.eventDate ?? webinar.listDate
  const eventTime = webinar.eventTime ?? webinar.listTime
  const hasDetailContent = Boolean(webinar.eventInfo || webinar.agenda || webinar.program || webinar.recommend)

  return (
    <div style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}>
      <WebinarBreadcrumb title={webinar.title} />

      <main className="mx-auto max-w-[1280px] min-[900px]:px-6 min-[900px]:py-10 min-[1100px]:flex min-[1100px]:items-start min-[1100px]:gap-8">
        <article className="flex flex-1 flex-col gap-6 p-4 min-[900px]:p-0 min-[900px]:gap-6 min-[1100px]:min-w-0">
          <div className="flex items-center gap-3 text-[13px] text-[#6d7180]">
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#eef1fb] px-3 py-1 text-xs font-bold text-[#2f5eff]">
              {webinar.categoryTag}
            </span>
            <span>
              {webinar.listDate} {webinar.listTime}
            </span>
          </div>
          <h1 className="m-0 text-[22px] font-bold leading-tight text-[#15172b] min-[900px]:text-[30px]">{webinar.title}</h1>

          <div className={`relative flex h-[175px] flex-col justify-center gap-2 overflow-hidden rounded-2xl p-5 min-[900px]:h-[459px] min-[900px]:gap-4 min-[900px]:p-16 ${PREVIEW_BG[webinar.previewBg]}`}>
            <Image
              src={PREVIEW_BG_IMAGE[webinar.previewBg]}
              alt=""
              fill
              className="object-cover opacity-40"
            />
            <Image
              src={WEBINAR_CARD_MARK_SRC}
              alt={WEBINAR_CARD_MARK_ALT}
              width={98}
              height={28}
              className="relative h-auto w-[51px] min-[900px]:w-[98px]"
            />
            <p className="relative m-0 max-w-[60%] text-xs font-medium leading-tight min-[900px]:max-w-[290px] min-[900px]:text-2xl">
              {webinar.title}
            </p>
            <p className="relative m-0 text-base font-bold leading-tight min-[900px]:text-[32px]">
              {eventDate}
              <br />
              {eventTime}
            </p>
            <div className="absolute bottom-[18px] right-5 h-[78px] w-[78px] overflow-hidden rounded-full bg-white min-[900px]:bottom-10 min-[900px]:right-16 min-[900px]:h-[200px] min-[900px]:w-[200px]">
              <Image src={webinar.speakerPhoto} alt="" width={200} height={200} className="h-full w-full object-cover object-top" />
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-[20px] bg-[#f9f9f9] p-6 min-[900px]:gap-8 min-[900px]:p-10">
            {webinar.quoteDesc && (
              <div className="flex flex-col gap-2.5">
                {webinar.quoteTitle && <h2 className="m-0 text-xl font-bold text-[#222]">{webinar.quoteTitle}</h2>}
                <p className="m-0 text-[15px] leading-relaxed text-[#6d7180]">{webinar.quoteDesc}</p>
              </div>
            )}

            {!hasDetailContent && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                  이 웨비나의 상세 프로그램(행사 안내·아젠다·세부 프로그램·추천 대상)은 콘텐츠 담당자로부터 전달받는 대로 업데이트될 예정입니다.
                </p>
              </>
            )}

            {webinar.eventInfo && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <div className="flex flex-col gap-2.5">
                  <h2 className="m-0 text-lg font-bold text-[#15172b]">행사 안내</h2>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    일시 <span className="text-[#222]">{webinar.eventInfo.date}</span>
                  </p>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    진행 방식 <span className="text-[#222]">{webinar.eventInfo.format}</span>
                  </p>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    참석 대상 <span className="text-[#222]">{webinar.eventInfo.audience}</span>
                  </p>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    참가비 <span className="text-[#222]">{webinar.eventInfo.fee}</span>
                  </p>
                </div>
              </>
            )}

            {webinar.agenda && webinar.agenda.length > 0 && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <div className="flex flex-col gap-2.5">
                  <h2 className="m-0 text-lg font-bold text-[#15172b]">핵심 아젠다</h2>
                  <div className="flex flex-col gap-0.5 text-[15px] leading-relaxed text-[#222]">
                    {webinar.agenda.map((item, i) => (
                      <p key={i} className="m-0">
                        ✅ {item}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}

            {webinar.program && webinar.program.length > 0 && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <div className="flex flex-col gap-2.5">
                  <h2 className="m-0 text-lg font-bold text-[#15172b]">세부 프로그램</h2>
                  <div className="flex flex-col gap-5">
                    {webinar.program.map((item, i) => (
                      <div
                        key={i}
                        className={`flex flex-col gap-2 pb-4 ${i < webinar.program!.length - 1 ? "border-b border-dashed border-[#e3e5f0]" : ""}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <strong className="text-[17px] font-bold text-[#15172b]">{item.title}</strong>
                          <span className="whitespace-nowrap text-sm text-[#8b8b8b]">{item.time}</span>
                        </div>
                        <p className="m-0 text-[15px] leading-snug text-[#222]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {webinar.recommend && webinar.recommend.length > 0 && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <div className="flex flex-col gap-2.5">
                  <h2 className="m-0 text-lg font-bold text-[#15172b]">이런 분들께 추천해요</h2>
                  <div className="flex flex-col text-base leading-6 text-[#222]">
                    {webinar.recommend.map((item, i) => (
                      <p key={i} className="m-0">
                        ✓ {item}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <Link href="/webinar" className="flex items-center gap-1.5 pt-2 text-sm font-medium text-[#6d7180]">
            <Image src="/webinar-assets/icon-arrow-left.svg" alt="" width={16} height={16} />
            세미나 목록으로 돌아가기
          </Link>
        </article>

        <RegistrationForm
          slug={webinar.slug}
          categoryTag={webinar.categoryTag}
          title={webinar.title}
          listDate={webinar.listDate}
          listTime={webinar.listTime}
          durationSummary={webinar.durationSummary}
          seminarType={webinar.dataType}
          eventDate={`${eventDate} ${eventTime}`}
        />
      </main>
    </div>
  )
}
