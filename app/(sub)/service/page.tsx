"use client"

import Link from "next/link"

const SOLUTIONS = [
  {
    badge: "AI 기반 성공 DNA 추출",
    title: "데이터로 정밀하게 추출하는 우리 조직의 성공 공식",
    description:
      "수만 개의 데이터 포인트를 딥러닝하여 상위 1% 고성과자의 행동 패턴을 정밀하게 추출합니다. 정적인 모델에서 벗어나 실시간 트렌드를 반영하는 동적인 역량 체계를 구축하세요.",
    points: ["고성과자 행동 패턴 분석", "실시간 역량 업데이트", "직무별 맞춤형 모델링"],
    accent: "#0f2d6e",
    demoLabel: "Demo Image",
    demoTitle: "역량모델링 대시보드",
    demoDesc: "추후 실제 이미지 또는 영상이 들어갈 영역",
  },
  {
    badge: "심리학 X AI 정밀 선발",
    title: "이면의 심리 특성까지 파악하는 데이터 기반 채용",
    description:
      "CPI 인성검사를 통해 지원자의 내적 동기와 가치관을 읽어냅니다. AI가 직무 적합도를 분석하고, 보완이 필요한 부분을 파고드는 날카로운 행동 기반 면접(BEI) 질문을 자동 생성합니다.",
    points: ["직무 적합도 점수화", "심층 심리 특성 진단", "AI 기반 표적 질문 생성"],
    accent: "#1e4fa8",
    demoLabel: "Demo Video",
    demoTitle: "후보자 분석 리포트",
    demoDesc: "추후 실제 이미지 또는 영상이 들어갈 영역",
  },
  {
    badge: "실전 역량 강화 시뮬레이션",
    title: "AI 코치와 함께하는 1:1 롤플레이와 즉각적 피드백",
    description:
      "진짜 행동의 변화는 실전 같은 연습에서 시작됩니다. AI와 대화하며 실제 현장 시나리오를 연습하세요. 연습 직후 제공되는 피드백은 개인별 맞춤 성장 계획(IDP)으로 이어집니다.",
    points: ["표준화된 상황 연습", "실시간 피드백 시스템", "데이터 기반 IDP 수립"],
    accent: "#2563eb",
    demoLabel: "Demo Preview",
    demoTitle: "AI 코칭 시뮬레이션",
    demoDesc: "추후 실제 이미지 또는 영상이 들어갈 영역",
  },
] as const

function DemoVisual({
  accent,
  label,
  title,
  description,
}: {
  accent: string
  label: string
  title: string
  description: string
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-24px_rgba(15,45,110,0.28)]">
      <div
        className="absolute inset-x-0 top-0 h-28 opacity-90"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, #dbeafe 100%)` }}
      />
      <div className="relative p-6 sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
            style={{ backgroundColor: accent }}
          >
            {label}
          </span>
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-[#f7f9fd] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800">{title}</p>
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg"
              style={{ backgroundColor: accent }}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.86-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
              </svg>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-4 py-3">
                <div className="h-3 w-28 rounded-full bg-slate-200" />
              </div>
              <div className="space-y-3 p-4">
                <div className="h-32 rounded-2xl" style={{ background: `linear-gradient(135deg, ${accent}22 0%, #eff6ff 100%)` }} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 rounded-xl bg-slate-100" />
                  <div className="h-16 rounded-xl bg-slate-100" />
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[20px] border border-slate-200 bg-white p-4">
                <div className="mb-3 h-3 w-20 rounded-full bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-slate-100" />
                  <div className="h-2.5 w-5/6 rounded-full bg-slate-100" />
                  <div className="h-2.5 w-2/3 rounded-full bg-slate-100" />
                </div>
              </div>
              <div
                className="rounded-[20px] border border-dashed p-4 text-center"
                style={{ borderColor: `${accent}55`, backgroundColor: `${accent}10` }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
                  Media Placeholder
                </p>
                <p className="mt-2 text-sm text-slate-500">새 이미지 또는 비디오 교체 예정</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SolutionSection({
  badge,
  title,
  description,
  points,
  accent,
  demoLabel,
  demoTitle,
  demoDesc,
  reverse = false,
}: {
  badge: string
  title: string
  description: string
  points: readonly string[]
  accent: string
  demoLabel: string
  demoTitle: string
  demoDesc: string
  reverse?: boolean
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className={reverse ? "lg:order-2" : ""}>
          <DemoVisual accent={accent} label={demoLabel} title={demoTitle} description={demoDesc} />
        </div>

        <div className={`space-y-6 ${reverse ? "lg:order-1" : ""}`}>
          <span
            className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]"
            style={{ color: accent, backgroundColor: `${accent}12` }}
          >
            {badge}
          </span>
          <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{title}</h2>
          <p className="text-base leading-8 text-slate-500 sm:text-lg">{description}</p>
          <ul className="space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm font-medium text-slate-700 sm:text-base">
                <span
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${accent}14` }}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth="2.5">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default function ServicePage() {
  return (
    <div
      className="min-h-screen bg-[#f7f9fd] text-slate-900"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-28 -right-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <span className="inline-flex items-center rounded-full bg-[#1e4fa8]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#1e4fa8]">
            Our Solution
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            데이터와 심리학, AI로 완성하는
            <br />
            정교한 HR 솔루션
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-500 sm:text-lg">
            채용부터 육성까지, 고성과자의 성공 DNA를 기반으로 조직의 성장을 가속화합니다.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/inquiry"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-[#0f2d6e] px-8 text-base font-semibold text-white shadow-xl shadow-blue-900/20 transition-colors hover:bg-[#1e4fa8]"
            >
              무료 데모 신청
            </Link>
            <a
              href="#service-sections"
              className="inline-flex h-14 items-center justify-center rounded-xl border border-[#0f2d6e] px-8 text-base font-semibold text-[#0f2d6e] transition-colors hover:bg-[#0f2d6e] hover:text-white"
            >
              자세히 알아보기
            </a>
          </div>
        </div>
      </section>

      <div id="service-sections">
        {SOLUTIONS.map((solution, index) => (
          <div key={solution.title} className={index % 2 === 0 ? "bg-[#f7f9fd]" : "bg-white"}>
            <SolutionSection {...solution} reverse={index % 2 === 1} />
          </div>
        ))}
      </div>

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            지금 바로 우리 조직만의
            <br />
            HR AI 거버넌스를 완성하세요.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
            PICCLE과 함께 데이터 기반의 과학적 인재 관리를 시작하세요.
          </p>
          <Link
            href="/inquiry"
            className="mt-10 inline-flex h-14 items-center justify-center rounded-xl bg-[#0f2d6e] px-10 text-base font-semibold text-white shadow-xl shadow-blue-900/20 transition-colors hover:bg-[#1e4fa8]"
          >
            PICCLE 도입 문의하기
          </Link>
        </div>
      </section>
    </div>
  )
}
