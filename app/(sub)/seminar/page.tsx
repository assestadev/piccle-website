"use client"

import { useMemo, useState } from "react"
import { SeminarHero } from "@/components/seminar/seminar-hero"
import { SeminarFilterTabs, type SeminarFilterType } from "@/components/seminar/seminar-filter-tabs"
import { SeminarCard } from "@/components/seminar/seminar-card"
import { OfflinePanel } from "@/components/seminar/offline-panel"
import { useNow } from "@/components/seminar/seminar-status-badge"
import { getRegistrationStatus, getUpcomingSeminars, seminars, sortSeminarsForList } from "@/lib/seminars"

export default function SeminarListPage() {
  const [filter, setFilter] = useState<SeminarFilterType>("all")
  const now = useNow()
  // 종료된 웨비나는 히어로 슬라이드에서 제외 (신청 마감이어도 아직 열리기 전이면 배지와 함께 노출).
  // 전부 종료되면 히어로 자체가 렌더링되지 않는다.
  // 신청 가능한 웨비나를 앞에, 신청 마감된 웨비나를 뒤에 둔다 (각 그룹 안에서는 가까운 일정순 유지).
  const heroSlides = useMemo(() => {
    const upcoming = getUpcomingSeminars().filter((s) => getRegistrationStatus(s, now) !== "ended")
    const isOpen = (s: (typeof upcoming)[number]) => getRegistrationStatus(s, now) === "open"
    return [...upcoming.filter(isOpen), ...upcoming.filter((s) => !isOpen(s))]
  }, [now])
  const visibleSeminars = useMemo(
    () => sortSeminarsForList(seminars.filter((s) => filter === "all" || filter === s.dataType), now),
    [filter, now],
  )
  // 예정된 오프라인 세미나가 생기기 전까지는 "오프라인 세미나, 곧 만나요" 안내를 목록 아래에 유지
  const hasUpcomingOffline = seminars.some((s) => s.dataType === "offline" && getRegistrationStatus(s, now) !== "ended")

  return (
    <div
      className="pt-20"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      <SeminarHero seminars={heroSlides} />
      <SeminarFilterTabs active={filter} onChange={setFilter} />

      <section className="mx-auto max-w-[1280px] px-4 py-6 min-[900px]:px-6 min-[900px]:py-8">
        {visibleSeminars.length > 0 && (
          <div className="mb-8 grid grid-cols-1 gap-8 min-[900px]:grid-cols-2">
            {visibleSeminars.map((s) => (
              <SeminarCard key={s.slug} seminar={s} />
            ))}
          </div>
        )}

        {(filter === "all" || filter === "offline") && !hasUpcomingOffline && <OfflinePanel />}
      </section>
    </div>
  )
}
