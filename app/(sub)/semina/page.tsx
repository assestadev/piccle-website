"use client"

import { useMemo, useState } from "react"
import { WebinarHero } from "@/components/webinar/webinar-hero"
import { WebinarFilterTabs, type WebinarFilterType } from "@/components/webinar/webinar-filter-tabs"
import { WebinarCard } from "@/components/webinar/webinar-card"
import { OfflinePanel } from "@/components/webinar/offline-panel"
import { getUpcomingWebinars, webinars } from "@/lib/webinars"

export default function WebinarListPage() {
  const [filter, setFilter] = useState<WebinarFilterType>("all")
  const heroSlides = useMemo(() => getUpcomingWebinars(), [])
  const visibleWebinars = webinars.filter((w) => filter === "all" || filter === w.dataType)

  return (
    <div
      className="pt-20"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      <WebinarHero webinars={heroSlides} />
      <WebinarFilterTabs active={filter} onChange={setFilter} />

      <section className="mx-auto max-w-[1280px] px-4 py-6 min-[900px]:px-6 min-[900px]:py-8">
        {(filter === "all" || filter === "online") && (
          <div className="mb-8 flex flex-col gap-8 min-[900px]:flex-row">
            {visibleWebinars
              .filter((w) => w.dataType === "online")
              .map((w) => (
                <WebinarCard key={w.slug} webinar={w} />
              ))}
          </div>
        )}

        {(filter === "all" || filter === "offline") && <OfflinePanel />}
      </section>
    </div>
  )
}
