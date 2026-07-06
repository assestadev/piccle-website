import Link from "next/link"
import { notFound } from "next/navigation"

import { HrAiSimulation } from "@/components/hr-ai-simulation"
import { HrCoachingSimulation } from "@/components/hr-coaching-simulation"
import { HrInterviewSimulation } from "@/components/hr-interview-simulation"
import { ScrollReveal } from "@/components/scroll-reveal"
import { isServicePreviewEnabledOnServer } from "@/lib/service-preview"

const SOLUTIONS = [
  {
    badge: "AI 역량 진단 DNA 분석",
    title: "행동 특성 리포트 기반의 정밀한 역량 진단",
    description:
      "지원자의 응답 패턴과 조직 적합 신호를 시각화해 핵심 역량을 빠르게 파악합니다. 첫 섹션의 그래프처럼 실시간으로 움직이는 화면을 통해 데이터 분석 흐름을 직관적으로 전달합니다.",
    points: ["행동 특성 리포트 자동 생성", "핵심 역량 및 적합도 시각화", "실시간 변화형 대시보드"],
    accent: "#0f2d6e",
    demoVariant: "competency",
  },
  {
    badge: "면접 질문 X AI 분석",
    title: "면접 응답을 구조화해 반복적으로 분석하는 인터뷰 시뮬레이션",
    description:
      "면접 대화 흐름, 후속 질문, 행동 특성 리포트를 하나의 인터페이스로 연결해 면접관이 지원자의 강점과 리스크를 더 빠르게 읽을 수 있도록 돕습니다.",
    points: ["응답별 행동 특성 포착", "핵심 태그 순환 강조", "AI 기반 후속 질문 추천"],
    accent: "#1e4fa8",
    demoVariant: "interview",
  },
  {
    badge: "코칭 기반 성장 피드백",
    title: "AI 코칭 리포트가 지속적으로 갱신되는 1:1 피드백 화면",
    description:
      "코칭 포인트와 다음 액션을 고정된 정적 카드가 아니라 살아있는 흐름처럼 보여 주어, 성장 피드백과 실행 계획이 계속 업데이트되는 느낌을 강화했습니다.",
    points: ["피드백 우선순위 순환 표시", "코칭 카드 강조 상태 반복", "개인별 액션 플랜 시각화"],
    accent: "#2563eb",
    demoVariant: "coaching",
  },
] as const

function DemoVisual({ variant }: { variant: "competency" | "interview" | "coaching" }) {
  if (variant === "competency") return <HrAiSimulation />
  if (variant === "interview") return <HrInterviewSimulation />
  return <HrCoachingSimulation />
}

function SolutionSection({
  badge,
  title,
  description,
  points,
  accent,
  demoVariant,
  reverse = false,
}: {
  badge: string
  title: string
  description: string
  points: readonly string[]
  accent: string
  demoVariant: "competency" | "interview" | "coaching"
  reverse?: boolean
}) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal className={reverse ? "lg:order-2" : ""}>
          <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_-24px_rgba(15,45,110,0.28)]">
            <DemoVisual variant={demoVariant} />
          </div>
        </ScrollReveal>

        <div className={`space-y-6 ${reverse ? "lg:order-1" : ""}`}>
          <ScrollReveal delay={40}>
            <span
              className="inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: accent, backgroundColor: `${accent}12` }}
            >
              {badge}
            </span>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{title}</h2>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <p className="text-base leading-8 text-slate-500 sm:text-lg">{description}</p>
          </ScrollReveal>

          <div className="space-y-3">
            {points.map((point, index) => (
              <ScrollReveal key={point} delay={240 + index * 70}>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700 sm:text-base">
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${accent}14` }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={accent} strokeWidth="2.5">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  {point}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function ServicePage() {
  if (!isServicePreviewEnabledOnServer()) {
    notFound()
  }

  return (
    <div
      className="min-h-screen bg-[#f7f9fd] pt-20 text-slate-900"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-white pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
          <ScrollReveal>
            <span className="inline-flex items-center rounded-full bg-[#1e4fa8]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#1e4fa8]">
              Our Solution
            </span>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              조직과 사람을 더 깊게 이해하는
              <br />
              AI 기반 HR 솔루션
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-500 sm:text-lg">
              행동 데이터, 인터뷰 분석, 성장 코칭을 하나의 흐름으로 연결해 채용과 육성을 더 정교하게 지원합니다.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/inquiry"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-[#0f2d6e] px-8 text-base font-semibold text-white shadow-xl shadow-blue-900/20 transition-colors hover:bg-[#1e4fa8]"
              >
                도입 문의하기
              </Link>
              <a
                href="#service-sections"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-[#0f2d6e] px-8 text-base font-semibold text-[#0f2d6e] transition-colors hover:bg-[#0f2d6e] hover:text-white"
              >
                서비스 자세히 보기
              </a>
            </div>
          </ScrollReveal>
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
          <ScrollReveal>
            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              채용부터 육성까지 이어지는
              <br />
              HR AI 운영 체계를 경험해 보세요
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              PICCLE의 인터랙티브 서비스 화면은 정적인 소개가 아니라 실제 업무 흐름처럼 살아 움직이도록 설계되어 있습니다.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <Link
              href="/inquiry"
              className="mt-10 inline-flex h-14 items-center justify-center rounded-xl bg-[#0f2d6e] px-10 text-base font-semibold text-white shadow-xl shadow-blue-900/20 transition-colors hover:bg-[#1e4fa8]"
            >
              PICCLE 도입 상담받기
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
