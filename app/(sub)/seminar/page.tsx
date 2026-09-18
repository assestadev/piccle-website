"use client"

import { useMemo, useState } from "react"
import { SeminarHero } from "@/components/seminar/seminar-hero"
import { SeminarFilterTabs, type SeminarFilterType } from "@/components/seminar/seminar-filter-tabs"
import { SeminarCard } from "@/components/seminar/seminar-card"
import { OfflinePanel } from "@/components/seminar/offline-panel"
import { getUpcomingSeminars, seminars } from "@/lib/seminars"

export default function SeminarListPage() {
  const [filter, setFilter] = useState<SeminarFilterType>("all")
  const heroSlides = useMemo(() => getUpcomingSeminars(), [])
  const visibleSeminars = seminars.filter((s) => filter === "all" || filter === s.dataType)

  return (
    <div
      className="pt-20"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      <SeminarHero seminars={heroSlides} />
      <SeminarFilterTabs active={filter} onChange={setFilter} />

      <section className="mx-auto max-w-[1280px] px-4 py-6 min-[900px]:px-6 min-[900px]:py-8">
        {(filter === "all" || filter === "online") && (
          <div className="mb-8 flex flex-col gap-8 min-[900px]:flex-row">
            {visibleSeminars
              .filter((s) => s.dataType === "online")
              .map((s) => (
                <SeminarCard key={s.slug} seminar={s} />
              ))}
          </div>
        )}

        {(filter === "all" || filter === "offline") && <OfflinePanel />}
      </section>
    </div>
  )
}
