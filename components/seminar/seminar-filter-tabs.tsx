"use client"

export type SeminarFilterType = "all" | "online" | "offline"

const TABS: { type: SeminarFilterType; label: string }[] = [
  { type: "all", label: "전체" },
  { type: "online", label: "온라인 웨비나" },
  { type: "offline", label: "오프라인 세미나" },
]

export function SeminarFilterTabs({
  active,
  onChange,
}: {
  active: SeminarFilterType
  onChange: (type: SeminarFilterType) => void
}) {
  return (
    <nav className="mx-auto flex max-w-[1280px] gap-6 overflow-x-auto border-b border-[#e3e5f0] px-4 min-[900px]:gap-8 min-[900px]:px-6">
      {TABS.map((tab) => {
        const isActive = tab.type === active
        return (
          <button
            key={tab.type}
            onClick={() => onChange(tab.type)}
            className={`cursor-pointer whitespace-nowrap border-b-2 pb-4 text-base font-medium transition-colors min-[900px]:text-[19px] ${
              isActive
                ? "border-[#0f2d6e] font-black text-[#0f2d6e]"
                : "border-transparent text-[#9296a6] hover:text-[#6d7180]"
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
