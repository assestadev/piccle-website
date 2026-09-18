import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSeminarBySlug, getSeminarEmailFields, seminars } from "@/lib/seminars"
import { SEMINAR_BANNER_MARK_ALT, SEMINAR_BANNER_MARK_SRC } from "@/lib/seminar-brand-config"
import { SeminarBreadcrumb } from "@/components/seminar/seminar-breadcrumb"
import { RegistrationForm } from "@/components/seminar/registration-form"

const PREVIEW_BG: Record<string, string> = {
  blue: "bg-[#d6eefb]",
  peach: "bg-[#fbe2d4]",
}

const PREVIEW_BG_IMAGE: Record<string, string> = {
  blue: "/seminar-assets/banner-bg-detail-blue.png",
  peach: "/seminar-assets/banner-bg-card-peach.png",
}

export function generateStaticParams() {
  return seminars.map((s) => ({ slug: s.slug }))
}

export default async function SeminarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const seminar = getSeminarBySlug(slug)
  if (!seminar) notFound()

  const eventDate = seminar.eventDate ?? seminar.listDate
  const eventTime = seminar.eventTime ?? seminar.listTime
  const hasDetailContent = Boolean(seminar.eventInfo || seminar.agenda || seminar.recommend)
  const emailFields = getSeminarEmailFields(seminar)

  return (
    <div style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}>
      <SeminarBreadcrumb title={seminar.title} />

      <main className="mx-auto max-w-[1280px] min-[900px]:px-6 min-[900px]:py-10 min-[1100px]:flex min-[1100px]:items-start min-[1100px]:gap-8">
        <article className="flex flex-1 flex-col gap-6 p-4 min-[900px]:p-0 min-[900px]:gap-6 min-[1100px]:min-w-0">
          <div className="flex items-center gap-3 text-[13px] text-[#6d7180]">
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#eef1fb] px-3 py-1 text-xs font-bold text-[#2f5eff]">
              {seminar.categoryTag}
            </span>
            <span>
              {seminar.listDate} {seminar.listTime}
            </span>
          </div>
          <h1 className="m-0 text-[22px] font-bold leading-tight text-[#15172b] min-[900px]:text-[28px]">{seminar.title}</h1>

          <div className={`relative flex h-[175px] flex-col justify-center gap-2 overflow-hidden rounded-2xl p-5 min-[900px]:h-[459px] ${PREVIEW_BG[seminar.previewBg]}`}>
            <Image
              src={PREVIEW_BG_IMAGE[seminar.previewBg]}
              alt=""
              fill
              className="object-cover opacity-40"
            />
            <Image
              src={SEMINAR_BANNER_MARK_SRC}
              alt={SEMINAR_BANNER_MARK_ALT}
              width={194}
              height={20}
              className="relative h-auto w-[100px] min-[900px]:absolute min-[900px]:left-[66px] min-[900px]:top-[77px] min-[900px]:w-[265px]"
            />
            <p className="relative m-0 max-w-[60%] text-xs font-medium leading-tight min-[900px]:hidden">
              {seminar.title}
            </p>
            <div className="hidden min-[900px]:absolute min-[900px]:left-[66px] min-[900px]:top-[131px] min-[900px]:block min-[900px]:max-w-[490px]">
              <p className="m-0 text-[33px] font-bold leading-tight">{seminar.bannerTitleBold ?? seminar.title}</p>
              {seminar.bannerTitleLines?.map((line) => (
                <p key={line} className="m-0 whitespace-nowrap text-[33px] font-medium leading-tight">
                  {line}
                </p>
              ))}
            </div>
            <p className="relative m-0 text-base font-bold leading-tight min-[900px]:absolute min-[900px]:left-[66px] min-[900px]:top-[295px] min-[900px]:text-[44px]">
              {eventDate}
              <br />
              {eventTime}
            </p>
            <div className="absolute bottom-[18px] right-5 h-[78px] w-[78px] overflow-hidden rounded-full bg-white min-[900px]:bottom-[96px] min-[900px]:right-[55px] min-[900px]:h-[205px] min-[900px]:w-[205px]">
              <Image src={seminar.speakerPhoto} alt="" width={205} height={205} className="h-full w-full object-cover object-top" />
            </div>
            <p className="hidden min-[900px]:absolute min-[900px]:bottom-[54px] min-[900px]:right-[55px] min-[900px]:block min-[900px]:w-[205px] min-[900px]:text-center min-[900px]:text-base min-[900px]:text-[#666]">
              {seminar.speaker}
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-[20px] bg-[#f9f9f9] p-6 min-[900px]:gap-8 min-[900px]:p-10">
            {seminar.quoteDesc && (
              <div className="flex flex-col gap-2.5">
                {seminar.quoteTitle && <h2 className="m-0 text-xl font-bold text-[#222]">{seminar.quoteTitle}</h2>}
                <p className="m-0 text-[15px] leading-relaxed text-[#6d7180]">{seminar.quoteDesc}</p>
              </div>
            )}

            {!hasDetailContent && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                  이 웨비나의 상세 프로그램(행사 안내·아젠다·추천 대상)은 콘텐츠 담당자로부터 전달받는 대로 업데이트될 예정입니다.
                </p>
              </>
            )}

            {seminar.eventInfo && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <div className="flex flex-col gap-2.5">
                  <h2 className="m-0 text-lg font-bold text-[#15172b]">📢 행사 안내</h2>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    연사 <span className="text-[#222]">{seminar.speaker}</span>
                  </p>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    일시 <span className="text-[#222]">{seminar.eventInfo.date}</span>
                  </p>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    진행 방식 <span className="text-[#222]">{seminar.eventInfo.format}</span>
                  </p>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    참석 대상 <span className="text-[#222]">{seminar.eventInfo.audience}</span>
                  </p>
                  <p className="m-0 text-[15px] leading-relaxed text-[#9296a6]">
                    참가비 <span className="text-[#222]">{seminar.eventInfo.fee}</span>
                  </p>
                </div>
              </>
            )}

            {seminar.agenda && seminar.agenda.length > 0 && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <div className="flex flex-col gap-2.5">
                  <h2 className="m-0 text-lg font-bold text-[#15172b]">🎯 핵심 아젠다</h2>
                  <div className="flex flex-col gap-0.5 text-[15px] leading-relaxed text-[#222]">
                    {seminar.agenda.map((item, i) => (
                      <p key={i} className="m-0">
                        • {item}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}

            {seminar.recommend && seminar.recommend.length > 0 && (
              <>
                <hr className="m-0 w-full border-t border-[#e3e5f0]" />
                <div className="flex flex-col gap-2.5">
                  <h2 className="m-0 text-lg font-bold text-[#15172b]">🙋‍♀️🙋‍♂️ 이런 분들께 추천해요</h2>
                  <div className="flex flex-col text-base leading-6 text-[#222]">
                    {seminar.recommend.map((item, i) => (
                      <p key={i} className="m-0">
                        ✓ {item}
                      </p>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <Link href="/seminar" className="flex items-center gap-1.5 pt-2 text-sm font-medium text-[#6d7180]">
            <Image src="/seminar-assets/icon-arrow-left.svg" alt="" width={16} height={16} />
            세미나 목록으로 돌아가기
          </Link>
        </article>

        <RegistrationForm
          slug={seminar.slug}
          categoryTag={seminar.categoryTag}
          title={seminar.title}
          listDate={seminar.listDate}
          listTime={seminar.listTime}
          durationSummary={seminar.durationSummary}
          seminarType={seminar.dataType}
          eventDate={emailFields.eventDate}
          speaker={emailFields.speaker}
          location={emailFields.location}
          audience={emailFields.audience}
          closingDate={emailFields.closingDate}
          emailHeading={emailFields.emailHeading}
        />
      </main>
    </div>
  )
}
