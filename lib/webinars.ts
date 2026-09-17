// 웨비나 콘텐츠 단일 소스.
// 카드/히어로/상세/신청폼 헤더가 전부 이 배열의 값을 그대로 읽어서 렌더링한다 —
// 값을 하나만 바꾸면 노출되는 모든 위치가 자동으로 바뀐다.
// 새 웨비나를 추가/수정할 때는 piccle-webinar/webinar-content-template.yaml 을 참고해서
// 이 파일에 항목을 채우면 됨.

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
  /** 웨비나 목록(카드) 페이지 전용 짧은 설명. 없으면 quoteDesc를 그대로 씀 */
  listDesc?: string
  /** 배너 카드(히어로/카드/상세) 제목의 첫 줄(볼드 강조). 없으면 title을 그대로 한 문단으로 표시 */
  bannerTitleBold?: string
  /** bannerTitleBold 다음에 이어지는 나머지 줄들(일반 굵기) */
  bannerTitleLines?: string[]
  eventInfo?: EventInfo
  agenda?: string[]
  recommend?: string[]
  previewBg: "blue" | "peach"
}

export const webinars: Webinar[] = [
  {
    slug: "team-discovery",
    dataType: "online",
    categoryTag: "[조직문화/진단]",
    title: "'측정'을 넘어 '변화'로: 조직문화를 바꾸고 팀 실행력을 높이는 '팀의 발견'",
    bannerTitleBold: "'측정'을 넘어 '변화'로",
    bannerTitleLines: ["조직문화를 바꾸고", "팀 실행력을 높이는 '팀의 발견'"],
    listDate: "2026.10.15(목)",
    listTime: "14:00",
    listDateISO: "2026-10-15",
    eventDate: "2026.10.15(목)",
    eventTime: "14:00",
    durationSummary: "온라인 · 60분 (발표 40분 · Q&A 20분)",
    speakerPhoto: "/webinar-assets/photo-male.png",
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
    slug: "cpi-fit-talent",
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
    speakerPhoto: "/webinar-assets/photo-female.png",
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
