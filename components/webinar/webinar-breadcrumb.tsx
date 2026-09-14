import Link from "next/link"
import Image from "next/image"

export function WebinarBreadcrumb({ title }: { title: string }) {
  return (
    <div className="mx-auto mt-20 flex max-w-[1280px] items-center gap-1.5 border-b border-[#e3e5f0] px-4 py-3 text-[13px] text-[#6d7180] min-[900px]:px-6 min-[900px]:text-sm">
      <Link href="/webinar">세미나</Link>
      <Image src="/webinar-assets/icon-chevron-right.svg" alt="" width={12} height={12} />
      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[#15172b]">{title}</span>
    </div>
  )
}
