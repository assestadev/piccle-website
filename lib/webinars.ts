// 웨비나 콘텐츠 단일 소스.
// 카드/히어로/상세/신청폼 헤더가 전부 이 배열의 값을 그대로 읽어서 렌더링한다 —
// 값을 하나만 바꾸면 노출되는 모든 위치가 자동으로 바뀐다.
// 새 웨비나를 추가/수정할 때는 piccle-webinar/webinar-content-template.yaml 을 참고해서
// 이 파일에 항목을 채우면 됨.

export interface ProgramItem {
  title: string
  time: string
  desc: string
}

export interface EventInfo {
  date: string
  format: string
  audience: string
  fee: string
}

export interface Webinar {
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
  quoteTitle?: string
  quoteDesc: string
  eventInfo?: EventInfo
  agenda?: string[]
  program?: ProgramItem[]
  recommend?: string[]
  previewBg: "blue" | "peach"
}

export const webinars: Webinar[] = [
  {
    slug: "ai-hr-platform",
    dataType: "online",
    categoryTag: "[채용/선발]",
    title: "AI 플랫폼 활용 인적성검사 및 채용 혁신 사례",
    listDate: "2026.10.15(목)",
    listTime: "14:00",
    listDateISO: "2026-10-15",
    eventDate: "2026.10.15(목)",
    eventTime: "14:00",
    durationSummary: "온라인 · 60분 (발표 40분 · Q&A 20분)",
    speakerPhoto: "/webinar-assets/photo-male.png",
    quoteTitle: "인적성검사에 활용되는 'AI 플랫폼' 활용법",
    quoteDesc:
      "반복되는 채용 업무는 줄이고, 지원자의 숨은 핵심 역량을 읽어 조직에 꼭 맞는 적합 인재만 정확하게 채용하는 실전 전략을 공개합니다.",
    eventInfo: {
      date: "2026.10.15(목) 14:00",
      format: "Zoom 온라인 실시간 스트리밍",
      audience: "HR 담당자, 피플/조직문화 리더 및 부서 관리자",
      fee: "무료 (사전 등록 필수)",
    },
    agenda: [
      "팀 성과를 가로막는 보이지 않는 동기와 진단의 필요성",
      "국내 기업 적용 진단 툴 & 코칭 성공 사례",
      "HR 관점의 팀 간 협업 촉진 및 정렬(Alignment) 가이드",
      "실시간 질의응답 및 팀 자가진단표 배포",
    ],
    program: [
      {
        title: "오프닝",
        time: "14:00–14:05(5분)",
        desc: "팀 성과를 가로막는 '보이지 않는 동기'와 데이터 기반 진단의 필요성",
      },
      {
        title: "사례 공유",
        time: "14:05–14:30(25분)",
        desc: "국내 A사 서베이·진단 도구 진행 인사이트 도출, HR 관점의 팀 간 협업 촉진, 액션 플랜과 리더십 가이드라인 배포",
      },
      {
        title: "실행 가이드",
        time: "14:30–14:40(10분)",
        desc: "팀 정렬(Alignment)을 위한 HR 개입 프레임워크",
      },
      {
        title: "Q&A 및 클로징",
        time: "14:40–15:00(20분)",
        desc: "실시간 질의응답 및 후속 안내 (팀 자가진단표 배포 / 1:1 맞춤 상담)",
      },
    ],
    recommend: [
      "채용 과정의 반복 업무를 줄이고 싶은 HR 담당자",
      "지원자의 숨은 역량과 조직 적합도를 파악하고 싶은 채용 담당자",
      "AI 기반 진단을 채용과 인재 관리에 활용하고 싶은 인사 담당자",
      "데이터 기반으로 팀과 조직의 협업을 강화하고 싶은 리더",
    ],
    previewBg: "blue",
  },
  {
    slug: "org-culture-diagnosis",
    dataType: "online",
    categoryTag: "[조직문화/진단]",
    title: "진단을 활용한 조직문화 및 팀 실행력 강화 우수사례",
    listDate: "2026.10.22(목)",
    listTime: "14:00",
    listDateISO: "2026-10-22",
    speakerPhoto: "/webinar-assets/photo-female.png",
    quoteDesc:
      "진단 결과를 바탕으로 구성원의 정렬을 이끌고, 리더의 개입 없이도 팀이 스스로 실행하는 조직을 만든 실제 사례와 실전 전략을 공개합니다.",
    // 상세 콘텐츠(행사 안내/아젠다/프로그램/추천 대상 등)는 아직 콘텐츠 담당자로부터
    // webinar-content-template.yaml 이 전달되지 않아 비어있음 — 상세 페이지에서 안내 문구로 대체.
    previewBg: "peach",
  },
]

export function getWebinarBySlug(slug: string): Webinar | undefined {
  return webinars.find((w) => w.slug === slug)
}

/** 앞으로 열리는 가까운 일정순 정렬 (히어로 슬라이드용) */
export function getUpcomingWebinars(): Webinar[] {
  return [...webinars].sort((a, b) => a.listDateISO.localeCompare(b.listDateISO))
}

/** "10월 3주차" 형태 라벨. 일자만 보고 계산(1~7일=1주차 ...) */
export function weekOfMonthLabel(isoDate: string): string {
  const [, monthStr, dayStr] = isoDate.split("-")
  const month = parseInt(monthStr, 10)
  const day = parseInt(dayStr, 10)
  const week = Math.ceil(day / 7)
  return `${month}월 ${week}주차 웨비나`
}
