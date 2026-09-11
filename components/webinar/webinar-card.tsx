import Image from "next/image"
import Link from "next/link"
import type { Webinar } from "@/lib/webinars"
import { WEBINAR_CARD_MARK_ALT, WEBINAR_CARD_MARK_SRC } from "@/lib/webinar-brand-config"

const PREVIEW_BG: Record<Webinar["previewBg"], string> = {
  blue: "bg-[#d6eefb]",
  peach: "bg-[#fbe2d4]",
}

export function WebinarCard({ webinar }: { webinar: Webinar }) {
  return (
    <article className="flex-1">
      <Link
        href={`/webinar/${webinar.slug}`}
        className="flex flex-col gap-3 min-[900px]:gap-0 min-[900px]:overflow-hidden min-[900px]:rounded-2xl min-[900px]:border min-[900px]:border-[#e3e5f0] min-[900px]:transition-shadow min-[900px]:hover:shadow-[0_8px_24px_-12px_rgba(18,25,63,0.15)]"
      >
        <div className="relative h-[193px] overflow-hidden rounded-xl min-[900px]:h-[338px] min-[900px]:rounded-none">
          <div className={`flex h-full flex-col justify-center gap-1.5 p-5 min-[900px]:gap-3 min-[900px]:p-14 ${PREVIEW_BG[webinar.previewBg]}`}>
            <Image src={WEBINAR_CARD_MARK_SRC} alt={WEBINAR_CARD_MARK_ALT} width={98} height={28} className="h-auto w-[51px] min-[900px]:w-[98px]" />
            <p className="m-0 max-w-[60%] text-xs font-medium leading-tight min-[900px]:max-w-[290px] min-[900px]:text-2xl">
              {webinar.title}
            </p>
            <p className="m-0 text-base font-bold leading-tight min-[900px]:text-[32px]">
              {webinar.listDate}
              <br />
              {webinar.listTime}
            </p>
            <div className="absolute bottom-[14px] right-4 h-[78px] w-[78px] overflow-hidden rounded-full bg-[#d9d9d9] min-[900px]:bottom-5 min-[900px]:right-10 min-[900px]:h-[150px] min-[900px]:w-[150px]">
              <Image src={webinar.speakerPhoto} alt="" width={150} height={150} className="h-full w-full object-cover object-top" />
            </div>
          </div>
          <span className="absolute left-2.5 top-2.5 inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-xs font-bold text-[#0f2d6e]">
            {webinar.dataType === "online" ? "온라인" : "오프라인"}
          </span>
        </div>

        <div className="flex flex-col gap-2 px-1 min-[900px]:gap-4 min-[900px]:p-6">
          <div className="flex items-center gap-2 text-xs font-bold min-[900px]:text-sm">
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#eef1fb] px-3 py-1 text-[#2f5eff]">
              {webinar.categoryTag}
            </span>
            <span className="text-[#6d7180]">
              {webinar.listDate} {webinar.listTime}
            </span>
          </div>
          <h3 className="m-0 text-lg font-bold leading-snug text-[#15172b] min-[900px]:text-xl">{webinar.title}</h3>
          <p className="m-0 hidden text-sm leading-relaxed text-[#6d7180] min-[900px]:block">
            {webinar.quoteDesc}
          </p>
        </div>
      </Link>
    </article>
  )
}
