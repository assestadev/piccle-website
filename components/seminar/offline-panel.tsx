import Image from "next/image"

export function OfflinePanel() {
  return (
    <div className="flex flex-col gap-4 border-t-8 border-[#f6f6f6] px-4 py-8 min-[900px]:flex-row min-[900px]:overflow-hidden min-[900px]:rounded-2xl min-[900px]:border min-[900px]:border-[#e3e5f0] min-[900px]:bg-[#fafbfd] min-[900px]:p-0">
      <div className="flex h-[95px] items-center justify-center rounded-2xl bg-[#f6f6f6] min-[900px]:h-auto min-[900px]:w-56 min-[900px]:shrink-0 min-[900px]:rounded-none">
        <Image src="/seminar-assets/icon-offline.svg" alt="" width={36} height={36} />
      </div>
      <div className="flex flex-col gap-2 min-[900px]:flex-1 min-[900px]:p-8">
        <span className="inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full bg-[#eef1fb] px-3 py-1 text-xs font-bold text-[#2f5eff]">
          준비중
        </span>
        <p className="m-0 text-lg font-bold text-[#6d7180]">오프라인 세미나, 곧 만나요</p>
        <p className="m-0 text-sm leading-relaxed text-[#9296a6]">
          현장에서 나누는 HR 인사이트 세미나를 준비하고 있습니다. 일정이 정해지는 대로 가장 먼저 알려드릴게요.
        </p>
      </div>
    </div>
  )
}
