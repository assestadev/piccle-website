"use client"

import { useEffect, useState } from "react"
import { REGISTRATION_STATUS_LABEL, getRegistrationStatus, type RegistrationStatus, type Seminar } from "@/lib/seminars"

// 상세/목록 페이지는 빌드 시점에 정적으로 만들어지므로 "지금 시각"은 브라우저에서 마운트된 뒤에만 알 수 있음.
// 마운트 전(null)에는 수동 마감 플래그만 반영되고, 마운트 후 일정 기준 자동 마감이 적용된다.
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
  }, [])

  return now
}

export function useRegistrationStatus(seminar: Seminar): RegistrationStatus {
  return getRegistrationStatus(seminar, useNow())
}

export function SeminarStatusBadge({ seminar }: { seminar: Seminar }) {
  const status = useRegistrationStatus(seminar)
  if (status === "open") return null

  return (
    <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[#222] px-3 py-1 text-xs font-bold text-white">
      {REGISTRATION_STATUS_LABEL[status]}
    </span>
  )
}
