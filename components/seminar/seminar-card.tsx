import Image from "next/image"
import Link from "next/link"
import type { Seminar } from "@/lib/seminars"
import { SEMINAR_BANNER_MARK_ALT, SEMINAR_BANNER_MARK_SRC } from "@/lib/seminar-brand-config"

const PREVIEW_BG: Record<Seminar["previewBg"], string> = {
  blue: "bg-[#d6eefb]",
  peach: "bg-[#fbe2d4]",
}

const PREVIEW_BG_IMAGE: Record<Seminar["previewBg"], string> = {
  blue: "/seminar-assets/banner-bg-card-blue.png",
  peach: "/seminar-assets/banner-bg-card-peach.png",
}

export function SeminarCard({ seminar }: { seminar: Seminar }) {
  return (
    <article className="flex-1">
      <Link
        href={`/seminar/${seminar.slug}`}
        className="flex flex-col gap-3 min-[900px]:gap-0 min-[900px]:overflow-hidden min-[900px]:rounded-2xl min-[900px]:border min-[900px]:border-[#e3e5f0] min-[900px]:transition-shadow min-[900px]:hover:shadow-[0_8px_24px_-12px_rgba(18,25,63,0.15)]"
      >
        <div className="relative h-[193px] overflow-hidden rounded-xl min-[900px]:h-[338px] min-[900px]:rounded-none">
          <div className={`relative flex h-full flex-col justify-center gap-1.5 p-5 ${PREVIEW_BG[seminar.previewBg]}`}>
            <Image
              src={PREVIEW_BG_IMAGE[seminar.previewBg]}
              alt=""
              fill
              className="object-cover opacity-40"
            />
            <Image src={SEMINAR_BANNER_MARK_SRC} alt={SEMINAR_BANNER_MARK_ALT} width={194} height={20} className="relative h-auto w-[100px] min-[900px]:absolute min-[900px]:left-12 min-[900px]:top-14 min-[900px]:w-[194px]" />
            <p className="relative m-0 max-w-[60%] text-xs font-bold leading-tight min-[900px]:hidden">
              {seminar.title}
            </p>
            <div className="hidden min-[900px]:absolute min-[900px]:left-12 min-[900px]:top-24 min-[900px]:block min-[900px]:max-w-[360px]">
              <p className="m-0 text-2xl font-bold leading-tight">{seminar.bannerTitleBold ?? seminar.title}</p>
              {seminar.bannerTitleLines?.map((line) => (
                <p key={line} className="m-0 whitespace-nowrap text-2xl font-medium leading-tight">
                  {line}
                </p>
              ))}
            </div>
            <p className="relative m-0 text-base font-bold leading-tight min-[900px]:absolute min-[900px]:left-12 min-[900px]:top-[216px] min-[900px]:text-[32px]">
              {seminar.listDate}
              <br />
              {seminar.listTime}
            </p>
            <div className="absolute bottom-[14px] right-4 h-[78px] w-[78px] overflow-hidden rounded-full bg-white min-[900px]:bottom-12 min-[900px]:right-10 min-[900px]:h-[150px] min-[900px]:w-[150px]">
              <Image src={seminar.speakerPhoto} alt="" width={150} height={150} className="h-full w-full object-cover object-top" />
            </div>
          </div>
          <span className="absolute left-2.5 top-2.5 inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0f2d6e]">
            {seminar.dataType === "online" ? "온라인" : "오프라인"}
          </span>
        </div>

        <div className="flex flex-col gap-2 px-1 min-[900px]:gap-4 min-[900px]:p-6">
          <div className="flex items-center gap-2 text-xs font-bold min-[900px]:text-sm">
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#eef1fb] px-3 py-1 text-[#2f5eff]">
              {seminar.categoryTag}
            </span>
            <span className="text-[#6d7180]">
              {seminar.listDate} {seminar.listTime}
            </span>
          </div>
          <h3 className="m-0 text-lg font-bold leading-snug text-[#15172b]">{seminar.title}</h3>
          <p className="m-0 hidden min-h-[46px] text-sm leading-relaxed text-[#6d7180] min-[900px]:line-clamp-2 min-[900px]:block">
            {seminar.listDesc ?? seminar.quoteDesc}
          </p>
        </div>
      </Link>
    </article>
  )
}
