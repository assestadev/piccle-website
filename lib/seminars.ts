// 웨비나 콘텐츠 단일 소스.
// 카드/히어로/상세/신청폼 헤더가 전부 이 배열의 값을 그대로 읽어서 렌더링한다 —
// 값을 하나만 바꾸면 노출되는 모든 위치가 자동으로 바뀐다.
// 새 웨비나를 추가/수정할 때는 piccle-webinar/webinar-content-template.yaml 을 참고해서
// 이 파일에 항목을 채우면 됨.
// slug 명명 규칙: 온라인 웨비나는 w01, w02 ... 순서로, 오프라인 세미나는 s01, s02 ... 순서로 부여.

export interface EventInfo {
  date: string
  format: string
  audience: string
  fee: string
  /** 오프라인 장소. 있으면 상세 "행사 안내"에 표시되고, 신청완료 메일의 "장소"에도 format 대신 이 값이 쓰인다 */
  location?: string
}

/** 상세 페이지 "세부 프로그램" 표의 한 줄 */
export interface ScheduleItem {
  /** "14:00–14:15" */
  time: string
  /** "15분" */
  duration: string
  title: string
  detail?: string
}

export interface Seminar {
  slug: string
  dataType: "online" | "offline"
  categoryTag: string
  title: string
  /** 목록/카드/신청폼 헤더에 쓰이는 날짜 (event_date와 다를 수 있음) */
  listDate: string
  listTime: string
  /** 히어로 자동 정렬용 ISO 날짜 (YYYY-MM-DD) */
  listDateISO: string
  /** 상세 페이지 본문(행사 안내, 히어로 이미지)에서만 쓰이는 실제 진행 날짜. 없으면 listDate/listTime을 그대로 사용 */
  eventDate?: string
  eventTime?: string
  durationSummary?: string
  speakerPhoto: string
  /** 신청완료 안내 메일 등에 쓰이는 연사 이름/직책 */
  speaker: string
  quoteTitle?: string
  quoteDesc: string
  /** 웨비나 목록(카드) 페이지 전용 짧은 설명. 없으면 quoteDesc를 그대로 씀 */
  listDesc?: string
  /** 배너 카드(히어로/카드/상세) 제목의 첫 줄(볼드 강조). 없으면 title을 그대로 한 문단으로 표시 */
  bannerTitleBold?: string
  /** bannerTitleBold 다음에 이어지는 나머지 줄들(일반 굵기) */
  bannerTitleLines?: string[]
  eventInfo?: EventInfo
  agenda?: string[]
  recommend?: string[]
  /** 세부 프로그램(시간표). 주로 오프라인 세미나용 */
  schedule?: ScheduleItem[]
  /** 참석자 혜택 */
  benefits?: string[]
  /** 진행 시간(분). 자동 "종료" 판정에 사용. 없으면 60분 */
  durationMinutes?: number
  previewBg: "blue" | "peach"
  /** 수동 마감 플래그. true면 일정 전이라도 신청을 받지 않음 (정원 초과 등 조기 마감용) */
  registrationClosed?: boolean
  /**
   * 외부 사이트(유료 결제 등)에서 신청받는 경우의 신청 링크. 있으면 상세 페이지 신청 영역에 폼 대신
   * "신청하기" 버튼만 노출되고, 자체 신청 API는 이 세미나의 신청을 거절한다.
   */
  externalRegistrationUrl?: string
  /**
   * 상세 내용 전달 전 예고 노출용. true면 카드/히어로는 보이지만 클릭되지 않고,
   * 상세·신청완료 페이지와 신청 API에서는 없는 세미나로 취급한다. 상세 내용을 채우면 이 플래그만 지우면 됨.
   */
  detailPending?: boolean
}

/** open: 신청 가능 / closed: 신청 마감(수동 마감 또는 시작 시각 경과) / ended: 웨비나 종료 */
export type RegistrationStatus = "open" | "closed" | "ended"

export const REGISTRATION_STATUS_LABEL: Record<Exclude<RegistrationStatus, "open">, string> = {
  closed: "신청 마감",
  ended: "종료",
}

export const REGISTRATION_STATUS_MESSAGE: Record<Exclude<RegistrationStatus, "open">, string> = {
  closed: "신청이 마감된 웨비나입니다.",
  ended: "해당 웨비나는 종료되었습니다.",
}

// 자동 "종료" 판정에 쓰는 기본 진행 시간 — durationMinutes가 없으면 60분(온라인 웨비나 기준)
const DEFAULT_DURATION_MINUTES = 60

/** 시작 시각(KST)의 epoch ms */
function getStartMs(seminar: Seminar): number {
  const startTime = seminar.eventTime ?? seminar.listTime
  return new Date(`${seminar.listDateISO}T${startTime}:00+09:00`).getTime()
}

/**
 * 세미나 목록(카드) 정렬 — 온라인/오프라인 구분 없이 하나의 목록.
 * 예정된 세미나(신청 가능 + 신청 마감)는 가까운 일정순, 종료된 세미나는 그 뒤에 최근에 끝난 순.
 * 배열에 추가하는 순서와 상관없이 항상 이 규칙으로 노출된다.
 */
export function sortSeminarsForList(list: Seminar[], now: Date | null): Seminar[] {
  const isEnded = (s: Seminar) => getRegistrationStatus(s, now) === "ended"
  const upcoming = list.filter((s) => !isEnded(s)).sort((a, b) => getStartMs(a) - getStartMs(b))
  const ended = list.filter(isEnded).sort((a, b) => getStartMs(b) - getStartMs(a))
  return [...upcoming, ...ended]
}

/**
 * 신청 가능 여부 단일 판정 함수 — 신청폼/배지/API가 전부 이 함수만 사용한다.
 * 자동: 시작 시각(KST)이 지나면 closed, 시작 + 진행 시간이 지나면 ended.
 * 수동: registrationClosed가 true면 일정 전이라도 closed.
 * now가 null이면(정적 렌더링 등 현재 시각을 모를 때) 수동 플래그만 반영.
 */
export function getRegistrationStatus(seminar: Seminar, now: Date | null): RegistrationStatus {
  if (now) {
    const startMs = getStartMs(seminar)
    const durationMs = (seminar.durationMinutes ?? DEFAULT_DURATION_MINUTES) * 60 * 1000
    if (now.getTime() >= startMs + durationMs) return "ended"
    if (now.getTime() >= startMs) return "closed"
  }
  return seminar.registrationClosed ? "closed" : "open"
}

export const seminars: Seminar[] = [
  {
    slug: "w01",
    dataType: "online",
    categoryTag: "[조직문화/진단]",
    title: "'측정'을 넘어 '변화'로: 조직문화를 바꾸고 팀 실행력을 높이는 '팀의 발견'",
    bannerTitleBold: "'측정'을 넘어 '변화'로",
    bannerTitleLines: ["조직문화를 바꾸고", "팀 실행력을 높이는 '팀의 발견'"],
    listDate: "2026.10.15(목)",
    listTime: "14:00",
    listDateISO: "2026-10-15",
    registrationClosed: true,
    eventDate: "2026.10.15(목)",
    eventTime: "14:00",
    durationSummary: "온라인 · 60분 (발표 40분 · Q&A 20분)",
    speakerPhoto: "/seminar-assets/photo-male.png",
    speaker: "어세스타 김영재 AX사업 본부장",
    quoteTitle: "진단 결과를 '팀 행동 규칙'으로 바꾸는 방법",
    quoteDesc:
      "진단 후 단순 결과 설명으로 끝내지 않고, 진단 → 팀 대화 → 행동 합의 → 실행 → Follow-up 으로 연결하는 방법을 제시합니다. 조직문화는 구성원들의 반복되는 상호작용에서 만들어집니다. 그 상호작용 속에는 얼마나 참여시키는가(Inclusion), 누가 영향력을 행사하는가(Control), 얼마나 신뢰와 관심을 표현하는가(Affection)라는 관계 패턴이 존재합니다. 그리고 FIRO-B를 활용하면 이를 진단하는 것에서 끝나는 것이 아니라, \"우리 팀이 앞으로 어떻게 함께 일할 것인가?\"라는 구체적인 행동 변화로 연결할 수 있습니다.",
    listDesc:
      "FIRO-B로 조직문화의 상호작용 진단을 넘어, 팀 대화·행동 합의·실행·Follow-up까지 이어가며 \"우리 팀은 앞으로 어떻게 일할 것인가\"에 대한 구체적 행동 변화를 만들어보세요.",
    eventInfo: {
      date: "2026.10.15(목) 14:00",
      format: "Zoom 온라인",
      audience: "HR 담당자, 피플/조직문화 리더 및 부서 관리자",
      fee: "무료 (사전 등록 필수)",
    },
    agenda: [
      "팀 성과를 가로막는 보이지 않는 동기와 관계이해의 필요성",
      "국내 기업 적용 진단 툴 & 코칭 성공 사례",
      "개인 결과보다 중요한 '팀 프로파일'의 이해",
      "리더의 관계 스타일과 팀 문화",
    ],
    recommend: [
      "팀 내 소통과 협업 문제를 진단하고 실제 행동 변화까지 만들어내고 싶은 HR·조직개발 담당자",
      "팀원들의 서로 다른 관계 방식과 기대를 이해하고 팀 실행력을 높이고 싶은 리더",
      "조직문화 진단 이후 구성원들의 행동 변화와 팀 단위 Intervention을 고민하고 있는 HR 담당자",
      "FIRO-B를 리더십, 팀빌딩, 조직개발 프로그램에 보다 실질적으로 활용하고 싶은 HRD·코칭·퍼실리테이션 전문가",
    ],
    previewBg: "blue",
  },
  {
    slug: "w02",
    dataType: "online",
    categoryTag: "[채용/인성검사]",
    title: "더 FIT한 인재 찾기: CPI 인성검사의 우리 조직 활용법",
    bannerTitleBold: "더 FIT한 인재 찾기",
    bannerTitleLines: ["CPI 인성검사의 우리 조직 활용법"],
    listDate: "2026.10.29(목)",
    listTime: "14:00",
    listDateISO: "2026-10-29",
    eventDate: "2026.10.29(목)",
    eventTime: "14:00",
    durationSummary: "온라인 · 60분 (발표 40분 · Q&A 20분)",
    speakerPhoto: "/seminar-assets/photo-female.png",
    speaker: "어세스타 최윤희 책임연구원",
    quoteTitle: "“우리 조직에 맞는 사람”은 어떻게 정의할 수 있을까?",
    quoteDesc:
      "조직의 성공 프로파일(Success Profile) 설계부터 CPI 결과 해석, FIT 분석까지 우리 조직만의 인재 프로파일을 만드는 전략을 소개합니다. 인성검사를 하나의 점수가 아닌 '인재를 더 깊이 이해하는 데이터'로 활용하여 우리 조직만의 FIT 기반 채용/승진 체계를 만드는 핵심 포인트를 정리합니다.",
    listDesc:
      "조직의 성공 프로파일(Success Profile) 설계부터 CPI 결과 해석, FIT 분석까지 우리 조직만의 인재 프로파일을 만드는 전략을 소개합니다.",
    eventInfo: {
      date: "2026.10.29(목) 14:00",
      format: "Zoom 온라인",
      audience: "HR 담당자, 채용/승진 담당부서 관리자",
      fee: "무료 (사전 등록 필수)",
    },
    agenda: [
      "좋은 인재보다 '우리 조직에 맞는 인재'를 찾아야 하는 이유",
      "이력서와 면접만으로는 보이지 않는 '행동 성향' 발견하기",
      "\"우리 조직에 맞는 사람\"은 어떻게 정의할 수 있을까?",
      "CPI를 채용에서 배치 & 육성까지 연결하기",
    ],
    recommend: [
      "면접만으로는 확인하기 어려운 지원자의 행동 특성과 잠재 리스크를 보다 체계적으로 파악하고 싶은 채용 담당자",
      "직무와 조직 특성에 맞는 인재 기준을 만들고 데이터 기반 채용/승진을 구축하고 싶은 HR 담당자",
      "고성과자 데이터를 활용하여 우리 조직만의 Success Profile과 인재 기준을 만들고 싶은 인사 & HR Analytics 담당자",
      "인성검사를 채용뿐 아니라 배치, 온보딩, 리더십 개발 및 인재육성까지 확장하여 활용하고 싶은 HRD 담당자",
    ],
    previewBg: "peach",
  },
  {
    // PICCLE SHARE 오프라인 세미나 — 2026-10-21 상세 내용 반영(참고: piccle-webinar.vercel.app/webinar/piccle-share-01)
    slug: "s01",
    dataType: "offline",
    categoryTag: "[HR전략/진단활용]",
    title: "흩어진 진단 결과를 2027년 채용·육성 계획으로 연결하기",
    bannerTitleBold: "흩어진 진단 결과를",
    bannerTitleLines: ["2027년 채용·육성 계획으로 연결하기"],
    listDate: "2026.11.18(수)",
    listTime: "14:00",
    listDateISO: "2026-11-18",
    eventDate: "2026.11.18(수)",
    eventTime: "14:00",
    durationSummary: "오프라인 · 180분 (14:00~17:00)",
    durationMinutes: 180,
    // 유료(4만원) 세미나라 커리어포유 결제 페이지에서 신청받음
    externalRegistrationUrl: "https://bit.ly/4dT3LmF",
    speakerPhoto: "/seminar-assets/photo-male.png",
    speaker: "어세스타 김영재 AX사업 본부장",
    quoteTitle: "2027년 HR 계획, 흩어진 진단 결과로 세울 수 있을까요?",
    quoteDesc:
      "채용부터 온보딩, 리더십, 조직문화까지 각 단계에서 따로 쌓아온 진단 결과를 하나의 흐름으로 연결하는 전략을 소개합니다. PICCLE 실제 도입 사례와 소그룹 토의를 통해, 2027년 계획서에 바로 쓸 수 있는 실행안까지 함께 만들어갑니다.",
    listDesc:
      "채용부터 조직문화까지 따로 쌓아온 진단 결과를 하나의 흐름으로 연결하고, 소그룹 토의를 통해 2027년 계획서에 바로 쓸 실행안까지 함께 만들어갑니다.",
    eventInfo: {
      date: "2026.11.18(수) 14:00",
      format: "오프라인 현장 참석",
      location: "어세스타 본사",
      audience: "HR·HRD 담당자, 채용 담당자, 조직문화 담당자",
      fee: "4만원 (선착순 30명)",
    },
    agenda: [
      "2026 HR 이슈 리뷰와 2027 트렌드, 단계별 진단 활용법, PICCLE 실제 도입 사례",
      "흩어진 검사 결과를 하나의 프로파일로 모으는 과정 시연",
      "관심 주제별 테이블에서 다른 회사 담당자들과 고민 나누고 12월 실행 계획 정리",
      "플랫폼 데모 체험, 1:1 상담 및 자유 네트워킹",
    ],
    recommend: [
      "2027년 HRD 계획과 예산을 준비하며 진단 활용 방안을 정리하고 싶으신 HR 담당자",
      "스펙 대신 무엇으로 지원자를 검증할지, 인적성검사 결과를 면접에 어떻게 쓸지 고민 중이신 채용 담당자",
      "신임 팀장 육성과 진단 디브리핑 이후의 행동 변화를 확인하고 싶으신 HRD 담당자",
      "워크숍이 끝난 뒤에도 팀빌딩 효과가 현장에서 이어지게 하고 싶으신 조직문화 담당자",
    ],
    schedule: [
      { time: "14:00–14:15", duration: "15분", title: "오프닝" },
      { time: "14:15–14:55", duration: "40분", title: "Session 1. 2026 리뷰 & 2027 트렌드", detail: "HR 이슈 및 진단의 역할" },
      { time: "14:55–15:20", duration: "25분", title: "Session 2. PICCLE 실제 도입 사례" },
      { time: "15:20–15:55", duration: "35분", title: "Session 3. HR AI 워크플레이스" },
      { time: "15:55–16:25", duration: "30분", title: "참여형 소그룹 토의 & 발표" },
      { time: "16:25–16:40", duration: "15분", title: "클로징 & 사내 적용 지원" },
      { time: "16:40–17:00", duration: "20분", title: "자유 네트워킹 & 데모 체험" },
    ],
    benefits: ["핑거푸드 & 음료", "참석자 한정 2027 굿즈"],
    previewBg: "blue",
  },
]

/** 상세/신청완료 페이지와 신청 API용 조회 — 상세 내용 전달 전(detailPending)인 세미나는 없는 것으로 취급 */
export function getSeminarBySlug(slug: string): Seminar | undefined {
  return seminars.find((s) => s.slug === slug && !s.detailPending)
}

/** 상세 페이지 정적 생성 대상 slug 목록 */
export function getDetailSeminarParams(): { slug: string }[] {
  return seminars.filter((s) => !s.detailPending).map((s) => ({ slug: s.slug }))
}

/** 앞으로 열리는 가까운 일정순 정렬 (히어로 슬라이드용) */
export function getUpcomingSeminars(): Seminar[] {
  return [...seminars].sort((a, b) => a.listDateISO.localeCompare(b.listDateISO))
}

/** "10월 3주차 웨비나" 형태 라벨(오프라인은 "세미나"). 일자만 보고 계산(1~7일=1주차 ...) */
export function weekOfMonthLabel(isoDate: string, dataType: Seminar["dataType"] = "online"): string {
  const [, monthStr, dayStr] = isoDate.split("-")
  const month = parseInt(monthStr, 10)
  const day = parseInt(dayStr, 10)
  const week = Math.ceil(day / 7)
  return `${month}월 ${week}주차 ${dataType === "offline" ? "세미나" : "웨비나"}`
}

const WEEKDAY_KO = ["일", "월", "화", "수", "목", "금", "토"]

/**
 * ISO 날짜(YYYY-MM-DD) + 24시간 시각(HH:mm) → "10월 15일 목요일 오후 2시" 형태로 변환.
 * 신청완료 메일 마지막 인사말("~ 웨비나에서 뵙겠습니다.")에 사용.
 */
export function formatEventDateForClosing(isoDate: string, time24: string): string {
  const [year, monthStr, dayStr] = isoDate.split("-")
  const [hourStr, minuteStr] = time24.split(":")
  const month = parseInt(monthStr, 10)
  const day = parseInt(dayStr, 10)
  const hour24 = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)

  const weekday = WEEKDAY_KO[new Date(parseInt(year, 10), month - 1, day).getDay()]
  const period = hour24 < 12 ? "오전" : "오후"
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  const minuteText = minute > 0 ? ` ${minute}분` : ""

  return `${month}월 ${day}일 ${weekday}요일 ${period} ${hour12}시${minuteText}`
}

/**
 * 온라인 웨비나는 "PICCLE HOUR" 시리즈 회차(#1, #2 ...)로 진행된다 (오프라인 웨비나는 아직 이 시리즈에
 * 속하는지 미정이라 번호를 매기지 않음). seminars 배열에서 online 타입만 추려 등록 순서대로 번호를 매김 —
 * 배열에 웨비나를 추가/삭제해도 이 함수가 항상 다시 계산하므로 번호를 따로 관리할 필요 없음.
 */
function getHourNumber(seminar: Seminar): number | null {
  if (seminar.dataType !== "online") return null
  const onlineSeminars = seminars.filter((s) => s.dataType === "online")
  const index = onlineSeminars.findIndex((s) => s.slug === seminar.slug)
  return index === -1 ? null : index + 1
}

/**
 * 신청완료 안내 메일에 필요한 필드를 세미나 데이터 한 곳에서 파생시키는 단일 매핑 함수.
 * 상세페이지 "행사 안내"(eventInfo)를 수정하면 이 함수를 거치는 메일 내용도 함께 바뀐다 —
 * 이메일 쪽에 값을 따로 하드코딩하지 말고 항상 이 함수를 통해서만 가져올 것.
 */
export function getSeminarEmailFields(seminar: Seminar) {
  const eventTime = seminar.eventTime ?? seminar.listTime
  const hourNumber = getHourNumber(seminar)

  return {
    seminarTitle: seminar.title,
    speaker: seminar.speaker,
    // "행사 안내" 카드와 동일한 일시 표기. eventInfo가 없으면 listDate/listTime으로 대체.
    eventDate: seminar.eventInfo?.date ?? `${seminar.eventDate ?? seminar.listDate} ${eventTime}`,
    // 메일의 "장소" — 오프라인은 "행사 안내"의 장소, 온라인은 진행 방식(Zoom 온라인)과 동일한 값.
    location: seminar.eventInfo?.location ?? seminar.eventInfo?.format ?? "",
    audience: seminar.eventInfo?.audience ?? "",
    closingDate: formatEventDateForClosing(seminar.listDateISO, eventTime),
    emailHeading: hourNumber != null ? `PICCLE HOUR #${hourNumber} 신청 완료 안내` : "세미나 신청 완료 안내",
  }
}
