"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { FadeIn } from "@/components/fade-in"
import { AnimatedUnderline } from "@/components/animated-underline"
import { IntelGraph } from "@/components/intel-graph"
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts"

const NAV = [
  { label: "문제 제기", id: "problem" },
  { label: "솔루션",    id: "solution" },
  { label: "활용사례",  id: "usecase" },
  { label: "보안 정책", id: "trust" },
]

const PROBLEM_CARDS = [
  {
    title: "정적인 역량 모델",
    body: "한 번 구축하면 수 년간 고정되어 급변하는 비즈니스 환경과 기술 트렌드를 반영하지 못합니다.",
    img: "/images/img01.jpg",
  },
  {
    title: "주관적 평가 기준",
    body: "평가자의 개인적인 친분이나 편향이 개입돼 평가 결과에 대한 구성원들의 불신이 발생합니다.",
    img: "/images/img02.jpg",
  },
  {
    title: "느린 업데이트 주기",
    body: "설문과 인터뷰 등 수동적인 방식으로 진행되어 모델 하나를 수정하는 데 막대한 비용과 시간이 소요됩니다.",
    img: "/images/img03.jpg",
  },
  {
    title: "제한적 데이터 활용",
    body: "정형화된 인사 기록 등 단편적인 데이터만 활용하여 개인의 숨겨진 잠재력과 성과 요인을 찾아내기 어렵습니다.",
    img: "/images/img06.jpg",
  },
]

const SOLUTION_STEPS = [
  {
    num: "01",
    tag: "Smart Interview",
    title: "AI가 도와주는 스마트한 면접 설계",
    body: "AI가 지원자의 심리 검사 결과를 분석해 우리 회사와의 적합도를 점수로 확인할 수 있습니다. 지원자의 심리적 특성 중 주의 깊게 봐야 할 '위험 신호'를 확인하여 면접관에게 알려줍니다. 지원자가 특정 역량에서 낮은 점수를 받았다면 AI가 그 부분을 집중적으로 파고 들 수 있는 질문을 자동 생성해줍니다. 그리고 이 화면을 실시간으로 확인할 수 있습니다.",
    accent: "#0f2d6e",
    light: "#eef3fb",
  },
  {
    num: "02",
    tag: "CPI Integration",
    title: "역량 모델링과 CPI의 통합 모델",
    body: "전통적인 역량 평가나 면접은 지원자가 과업을 수행할 현재의 능력이나 기술만을 파악할 수 있는 경우가 많습니다. CPI는 이를 보완하여 당장의 기술뿐만 아니라 개인이 큰 압박속에서도 자신의 역량을 일관되게 유지할 힘이 있는지 예측해줍니다. CPI를 통해 역량 부족의 근본 원인을 파악하면 개인 맞춤형 코칭 및 개발이 가능합니다.",
    accent: "#1e4fa8",
    light: "#f0f5ff",
  },
  {
    num: "03",
    tag: "AI Simulation",
    title: "1:1 AI 역량개발 시뮬레이션",
    body: "AI 역량개발 시스템은 직무에 맞춘 시나리오를 제공하여 사용자가 AI와 직접 대화하며 문제를 해결하도록 합니다. 이는 주어진 상황에서 어떻게 말하고 행동하는지를 실시간으로 분석하여 즉각적인 피드백을 제공합니다. 팀장은 AI가 분석한 객관적인 데이터를 바탕으로 팀원을 육성할 수 있습니다. AI가 만드는 시나리오는 우리 조직의 목표나 기대 행동에 맞춰 반영됩니다.",
    accent: "#2563eb",
    light: "#eff6ff",
  },
]

const RECRUITMENT_DATA = [
  { subject: "직무 전문성", ideal: 90, applicant: 82 },
  { subject: "문제 해결",   ideal: 85, applicant: 88 },
  { subject: "조직 적합",   ideal: 95, applicant: 70 },
  { subject: "협업 능력",   ideal: 80, applicant: 82 },
  { subject: "스트레스",    ideal: 85, applicant: 65 },
]

const TALENT_DATA = [
  { session: "시작 전", score: 45 },
  { session: "1회차",   score: 62 },
  { session: "2회차",   score: 78 },
  { session: "3회차",   score: 92 },
]

const TALENT_DATA_FLAT = [
  { session: "시작 전", score: 45 },
  { session: "1회차",   score: 45 },
  { session: "2회차",   score: 45 },
  { session: "3회차",   score: 45 },
]

const LEADERSHIP_DATA = [
  { label: "자신감",    before: 42, after: 88 },
  { label: "팀원 이해", before: 48, after: 94 },
  { label: "피드백 질", before: 38, after: 85 },
]

const TRUST_CARDS: { title: string; glow: string; render: () => React.ReactNode }[] = [
  {
    title: "내부 데이터 보호 조치 설계",
    glow: "hover:shadow-[0_0_18px_3px_rgba(251,191,36,0.4),0_0_50px_8px_rgba(251,191,36,0.15)] hover:border-amber-300/50",
    render: () => (
      <>
        <p className="text-amber-300 text-lg font-semibold leading-relaxed mb-5">
          처음부터 <span className="text-amber-300">보호 조치가 설계된 운영 환경</span>을 선택하는 것이 핵심입니다.
        </p>
        <ul className="space-y-3">
          {[
            "외부망 범용 AI 사용 시 민감 정보 유출 리스크 직결",
            "데이터 경계·접근 권한을 기업 정책에 맞게 설계",
            "HR 전용 보안 환경에서만 가능한 안심 운영",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-blue-200/70 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-300/60 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "우리 기업만의 인사 맥락 반영",
    glow: "hover:shadow-[0_0_18px_3px_rgba(147,197,253,0.4),0_0_50px_8px_rgba(147,197,253,0.15)] hover:border-blue-300/50",
    render: () => (
      <>
        <p className="text-blue-300 text-lg font-semibold leading-relaxed mb-5">
          <span className="text-blue-300">Local Private LLM</span>으로 정보 유출 없이 우리 기업만의 AI를 구현합니다.
        </p>
        <ul className="space-y-3">
          {[
            "평가 이력·역량 사전·인터뷰 노트 등 사내 데이터 직접 활용",
            "외부 서버 미전송, 폐쇄망 내 완전 운영",
            "기업 문화·직무 체계를 깊이 이해하는 전용 AI",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-blue-200/70 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-300/60 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    title: "고차원적 HR 의사결정 지원",
    glow: "hover:shadow-[0_0_18px_3px_rgba(52,211,153,0.4),0_0_50px_8px_rgba(52,211,153,0.15)] hover:border-emerald-300/50",
    render: () => (
      <>
        <p className="text-emerald-300 text-lg font-semibold leading-relaxed mb-5">
          HR AI의 본질은 <span className="text-emerald-300">정교한 통제와 전문가의 관리 감독</span>에 있습니다.
        </p>
        <ul className="space-y-3">
          {[
            "역량 체계·인사 정책 기반의 심층 분석 제공",
            "심리·행동 데이터 해석 프레임 내재화",
            "정교한 역량 모델링과 인재 전략 수립 지원",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-blue-200/70 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-300/60 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
]

export default function Page() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [showTopBtn, setShowTopBtn] = useState(false)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const featureRef = useRef<HTMLDivElement>(null)
  const [anim1, setAnim1] = useState(false)
  const [anim2, setAnim2] = useState(false)
  const [anim3, setAnim3] = useState(false)

  useEffect(() => {
    const h = () => {
      const y = window.scrollY
      setScrollY(y)
      if (y > 300) {
        setShowTopBtn(true)
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
        scrollTimerRef.current = setTimeout(() => setShowTopBtn(false), 1200)
      } else {
        setShowTopBtn(false)
      }
    }
    window.addEventListener("scroll", h)
    return () => {
      window.removeEventListener("scroll", h)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setAnim1(true)
          setTimeout(() => setAnim2(true), 350)
          setTimeout(() => setAnim3(true), 700)
          obs.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    if (featureRef.current) obs.observe(featureRef.current)
    return () => obs.disconnect()
  }, [])

  // Hero → Problem 섹션 스냅 (PC 전용)
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    let locked = false

    const onWheel = (e: WheelEvent) => {
      const problemTop = document.getElementById("problem")?.offsetTop ?? window.innerHeight

      if (locked) {
        e.preventDefault()
        return
      }

      // Hero 영역에서 아래로 스크롤 → Problem 상단으로 snap
      if (window.scrollY < problemTop - 50 && e.deltaY > 0) {
        e.preventDefault()
        locked = true
        document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })
        setTimeout(() => { locked = false }, 1000)
      }
      // Problem 상단 근처에서 위로 스크롤 → Hero 상단으로 snap
      else if (window.scrollY <= problemTop + 50 && e.deltaY < 0) {
        e.preventDefault()
        locked = true
        window.scrollTo({ top: 0, behavior: "smooth" })
        setTimeout(() => { locked = false }, 1000)
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [])

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const el = glowRef.current
    if (!el) return
    el.style.left = `${e.clientX - 260}px`
    el.style.top = `${e.clientY - 260}px`
    el.style.opacity = "1"
  }

  const handleHeroMouseLeave = () => {
    const el = glowRef.current
    if (!el) return
    el.style.opacity = "0"
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div
      className="min-h-screen bg-white text-slate-900 overflow-x-hidden"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >

      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white/96 backdrop-blur-xl border-b border-slate-200/60 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-slate-900">Piccle</span>
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="cursor-pointer text-sm text-slate-600 hover:text-[#1e4fa8] transition-colors font-medium">
                {n.label}
              </button>
            ))}
          </nav>
          <button onClick={() => router.push("/inquiry")} className="cursor-pointer inline-flex items-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white text-sm font-semibold px-4 py-2 md:px-5 md:py-2.5 rounded-lg transition-colors">
            문의하기
          </button>
        </div>
      </header>

      {/* ── CURSOR GLOW (fixed, hero only, PC only) ── */}
      <div
        ref={glowRef}
        className="cursor-glow fixed pointer-events-none z-[2] rounded-full"
        style={{
          width: 520,
          height: 520,
          background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)",
          opacity: 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-gradient-to-b from-[#f4f7fc] via-white to-white"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div className="absolute inset-0 overflow-hidden">
          <IntelGraph />
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }} />
          <div className="absolute -top-16 right-0 w-[440px] h-[440px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
        <div className="relative z-[3] max-w-5xl mx-auto px-5 sm:px-8 w-full text-center">
          <FadeIn delay={200}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-8 text-slate-900">
              멈춰있는 역량 모델,<br />
              이제 <span className="text-[#1e4fa8]">실시간으로</span><br />
              진화합니다.
            </h1>
          </FadeIn>
          <FadeIn delay={360}>
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto px-2 sm:px-0">
              우리 조직만의 &apos;성공 공식&apos;을 데이터로 증명하세요. 보안이 설계된 전용 AI가 채용부터 리더십 코칭까지, 파편화된 인사 데이터를 하나의 성장 엔진으로 연결하여 최적의 HR 의사결정 시스템을 구축합니다.
            </p>
          </FadeIn>
          <FadeIn delay={500}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white font-semibold px-10 h-14 min-w-[230px] rounded-xl text-base transition-colors shadow-lg shadow-blue-900/20">
                서비스 소개서 다운로드
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              </button>
              <button onClick={() => scrollTo("solution")} className="cursor-pointer relative z-10 inline-flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-10 h-14 min-w-[230px] rounded-xl text-base transition-colors">
                솔루션 알아보기
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </FadeIn>
        </div>

        {/* ── SCROLL INDICATOR ── */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
          <span className="text-[10px] tracking-[0.35em] font-semibold text-slate-400 uppercase">Scroll</span>
          <div className="relative w-px h-12 overflow-hidden" style={{ background: "rgba(148,163,184,0.3)" }}>
            <div className="scroll-flow-line" />
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section id="problem" className="py-28 lg:py-36 bg-[#f7f9fd]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-xs font-semibold tracking-widest text-[#1e4fa8] uppercase mb-5">The Core Problem</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-slate-900 mb-6">
                왜 많은 기업의 역량 모델은<br />
                <AnimatedUnderline color="rgba(59,130,246,0.4)" delay={300}>
                  <span className="text-[#1e4fa8]">현업에서 살아남지 못할까요?</span>
                </AnimatedUnderline>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                비즈니스 환경은 끊임없이 변하는데, 역량 모델은 그대로이기 때문입니다.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEM_CARDS.map((c, i) => (
              <FadeIn key={i} delay={i * 120} direction="up">
                <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-slate-900 mb-2">{c.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{c.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section id="solution" className="py-28 lg:py-36 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-xs font-semibold tracking-widest text-[#1e4fa8] uppercase mb-5">Our Solution</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-slate-900 mb-6">
                AI 역량모델 솔루션,<br />
                <AnimatedUnderline color="rgba(59,130,246,0.4)" delay={300}>
                  <span className="text-[#1e4fa8]">어떤점이 다를까요?</span>
                </AnimatedUnderline>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                우리 조직만의 성공 DNA를 데이터로 추출하고 AI 기반의 통합 인재 관리 시스템을 완성합니다.
              </p>
            </div>
          </FadeIn>

          {/* Vertical Journey */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical connecting line */}
            <div
              className="absolute left-[19px] top-5 bottom-5 w-[2px] pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent, #bfdbfe 8%, #1e4fa8 35%, #2563eb 65%, #bfdbfe 92%, transparent)" }}
            />

            <div className="space-y-6">
              {SOLUTION_STEPS.map((step, i) => (
                <FadeIn key={i} direction="right" delay={i * 160}>
                  <div className="flex gap-5 sm:gap-7 items-start group/step">
                    {/* Step circle */}
                    <div className="relative z-10 flex-shrink-0 w-10 h-10">
                      {/* Glow ring — appears on hover */}
                      <span
                        className="absolute inset-[-5px] rounded-full opacity-0 group-hover/step:opacity-100 group-hover/step:animate-pulse transition-opacity duration-200"
                        style={{ boxShadow: `0 0 0 2.5px ${step.accent}, 0 0 14px 5px ${step.accent}55` }}
                      />
                      <div
                        className="relative w-full h-full rounded-full flex items-center justify-center font-bold text-white text-sm group-hover/step:scale-110 transition-transform duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${step.accent} 0%, #3b6fd4 100%)`,
                          boxShadow: `0 0 0 4px #fff, 0 0 0 6px ${step.light}, 0 4px 18px rgba(30,79,168,0.2)`,
                        }}
                      >
                        {i + 1}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 pb-2">
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-500">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                        <p className="text-[15px] text-slate-500 leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── USE CASE ── */}
      <section id="usecase" className="py-28 lg:py-36 bg-[#f7f9fd]" ref={featureRef}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-xs font-semibold tracking-widest text-[#1e4fa8] uppercase mb-5">Key Use Cases</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-slate-900 mb-6">
                채용부터 육성까지,<br />
                <AnimatedUnderline color="rgba(245,158,11,0.5)" delay={300}>
                  <span className="text-[#1e4fa8]">데이터로 완성하는 인사 혁신</span>
                </AnimatedUnderline>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">선발부터 육성까지, 데이터로 증명된 HR 혁신 사례를 확인하세요.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 01 — Recruitment (Radar) */}
            <FadeIn delay={0} direction="left">
              <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                <div className="p-7 flex flex-col flex-1">
                  <span className="text-[11px] font-bold tracking-widest text-[#1e4fa8] uppercase mb-3 block">채용 · Recruitment</span>
                  <blockquote className="border-l-4 border-[#1e4fa8] bg-blue-50/60 rounded-r-xl pl-4 pr-3 py-3 mb-4">
                    <p className="text-lg font-semibold text-slate-700 leading-snug italic">
                      &ldquo;수만 명의 지원자 속에서{" "}
                      <span className="not-italic font-extrabold text-[#1e4fa8]">우리 조직에 꼭 맞는 인재</span>를 선발해야 할 때&rdquo;
                    </p>
                  </blockquote>
                  <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
                    대규모 공채나 핵심 인재 영입 시, 면접관의 주관이 개입될 틈 없이 데이터로 검증합니다. AI가 분석한 적합도 점수(Fit Score)와 위험 신호 가이드는 채용 오류로 인한 리스크를 획기적으로 낮춰줍니다.
                  </p>
                  <div className="mt-auto border-t border-slate-100 pt-5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">AI 분석: 조직 적합도 다면 모델</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={RECRUITMENT_DATA} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                        <Radar name="지원자 데이터" dataKey="applicant" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.12} strokeWidth={2} isAnimationActive animationDuration={700} />
                        {anim1 && (
                          <Radar name="이상적 인재상" dataKey="ideal" stroke="#1e4fa8" fill="#1e4fa8" fillOpacity={0.18} strokeWidth={2} isAnimationActive animationDuration={700} />
                        )}
                        <Legend iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                    <p className="text-[10px] text-center text-slate-400 mt-2 leading-relaxed">
                      역량 모델과 지원자 프로파일의 일치도를 시각화하여<br />한눈에 들어오는 데이터 의사결정을 지원합니다.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Card 02 — Talent Dev (Line) */}
            <FadeIn delay={150} direction="up">
              <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                <div className="p-7 flex flex-col flex-1">
                  <span className="text-[11px] font-bold tracking-widest text-[#1e4fa8] uppercase mb-3 block">인력개발 · Development</span>
                  <blockquote className="border-l-4 border-[#1e4fa8] bg-blue-50/60 rounded-r-xl pl-4 pr-3 py-3 mb-4">
                    <p className="text-lg font-semibold text-slate-700 leading-snug italic">
                      &ldquo;단순히 선발하거나 승진시키기 위한 평가가 아닌,{" "}
                      <span className="not-italic font-extrabold text-[#1e4fa8]">직원 성장에 초점</span>을 맞춘 평가가 필요할 때&rdquo;
                    </p>
                  </blockquote>
                  <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
                    획일적인 온/오프라인 강의를 넘어 개별 직원의 심리적 기질에 맞춘 실전 시뮬레이션을 제공합니다. 반복적인 연습과 AI 코치의 즉각 피드백은 교육이 실무 현장의 행동 변화로 이어지게 만드는 가장 빠른 길입니다.
                  </p>
                  <div className="mt-auto border-t border-slate-100 pt-5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">AI 분석: 훈련 반복에 따른 역량 향상</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart
                        key={anim2 ? "anim" : "flat"}
                        data={anim2 ? TALENT_DATA : TALENT_DATA_FLAT}
                        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="session" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                          formatter={(v: number) => [`${v}점`, "핵심 역량 발현도"]}
                        />
                        <Line
                          type="monotone" dataKey="score" name="핵심 역량 발현도"
                          stroke="#1e4fa8" strokeWidth={3}
                          dot={{ r: 5, fill: "#1e4fa8", strokeWidth: 0 }}
                          activeDot={{ r: 7 }}
                          isAnimationActive animationDuration={800}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <p className="text-[10px] text-center text-slate-400 mt-2 leading-relaxed">
                      시뮬레이션 회차가 반복됨에 따라 사용자의<br />핵심 행동 지표가 점진적으로 개선됨을 증명합니다.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Card 03 — Leadership (Bar) */}
            <FadeIn delay={300} direction="right">
              <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                <div className="p-7 flex flex-col flex-1">
                  <span className="text-[11px] font-bold tracking-widest text-[#1e4fa8] uppercase mb-3 block">리더십 개발 · Leadership</span>
                  <blockquote className="border-l-4 border-[#1e4fa8] bg-blue-50/60 rounded-r-xl pl-4 pr-3 py-3 mb-4">
                    <p className="text-lg font-semibold text-slate-700 leading-snug italic">
                      &ldquo;팀장의 주관적인 느낌이 아닌{" "}
                      <span className="not-italic font-extrabold text-[#1e4fa8]">데이터 기반의 정교한 코칭 문화</span>가 필요할 때&rdquo;
                    </p>
                  </blockquote>
                  <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
                    리더가 팀원의 성향을 오해하지 않고 객관적으로 육성할 수 있는 &lsquo;코칭 가이드&rsquo;를 제공합니다. AI가 제안하는 시나리오 기반 가이드를 통해 리더는 면담의 자신감을 얻고, 조직은 성과 DNA를 전파하는 강력한 리더십 파이프라인을 구축합니다.
                  </p>
                  <div className="mt-auto border-t border-slate-100 pt-5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">AI 분석: 코칭 도입 전후 지표 변화</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={LEADERSHIP_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }}
                          formatter={(v: number) => [`${v}점`]}
                        />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                        <Bar dataKey="before" name="도입 전" fill="#e2e8f0" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600} />
                        {anim3 && (
                          <Bar dataKey="after" name="도입 후" fill="#1e4fa8" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={700} animationBegin={100} />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                    <p className="text-[10px] text-center text-slate-400 mt-2 leading-relaxed">
                      AI 코칭 가이드 적용 후 리더의 면담 자신감 및<br />팀원 이해도가 획기적으로 상승함을 보여줍니다.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section id="trust" className="py-28 lg:py-36 bg-[#0b1f4a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase mb-5">SECURITY & GOVERNANCE</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white mb-6">
                보안이 설계된 AI만이<br />
                <AnimatedUnderline color="rgba(147,197,253,0.55)" delay={300}>
                  <span className="text-blue-300">HR을 혁신할 수 있습니다</span>
                </AnimatedUnderline>
              </h2>
              <p className="text-lg text-blue-200/70 max-w-2xl mx-auto">
                일반 범용 AI와 달리, HR 특화 AI는 조직의 가장 민감한 데이터를 다룰 자격을 갖추고 있습니다.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
            {TRUST_CARDS.map((b, i) => (
              <FadeIn key={i} delay={i * 150} direction={i === 0 ? "left" : i === 2 ? "right" : "up"} className="h-full">
                <div className={`h-full flex flex-col bg-white/[0.07] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.11] hover:-translate-y-[10px] transition-all duration-300 ${b.glow}`}>
                  <h3 className="text-xl font-bold text-white mb-4">{b.title}</h3>
                  {b.render()}
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="bg-gradient-to-r from-[#1e4fa8] to-[#2563eb] rounded-2xl px-8 py-7 text-center">
              <p className="text-white text-lg font-semibold">
                &ldquo;우리 조직 내에서만 작동하는 <span className="text-blue-200">전용 HR AI 시스템</span>&rdquo;
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="py-28 lg:py-36 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-slate-900 mb-6">
              데이터로 보여주는<br />
              <AnimatedUnderline color="rgba(245,158,11,0.5)" delay={200}>
                <span className="text-[#1e4fa8]">HR의 가치,</span>
              </AnimatedUnderline><br />
              지금 시작하세요.
            </h2>
            <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto">
              조직의 HR을 데이터 기반으로 혁신하고, 채용부터 육성까지 모든 인사 의사결정을 한 단계 높이세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => router.push("/inquiry")} className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white font-semibold px-10 h-14 min-w-[230px] rounded-xl text-base transition-colors shadow-xl shadow-blue-900/20">
                도입 문의하기
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <button className="cursor-pointer inline-flex items-center justify-center gap-2 border-2 border-[#0f2d6e] text-[#0f2d6e] hover:bg-[#f0f5ff] font-semibold px-10 h-14 min-w-[230px] rounded-xl text-base transition-colors">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                서비스 소개서 다운로드
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0b1f4a] pt-10 pb-6 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">

          {/* 회사명 */}
          <p className="text-white/80 text-lg font-bold mb-6">(주)어세스타</p>

          {/* 사업자 정보 + 소셜 아이콘 */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-x-0 gap-y-1 text-blue-200/60 text-sm">
              <span>대표이사 : 김명준</span>
              <span className="mx-3 text-blue-200/30">|</span>
              <span>개인정보 관리자 : 손성훈</span>
              <span className="mx-3 text-blue-200/30">|</span>
              <span>사업자등록번호 : 107-86-27487</span>
              <span className="mx-3 text-blue-200/30">|</span>
              <span>통신판매업신고 : 2013-서울영등포-0153</span>
              <span className="mx-3 text-blue-200/30">|</span>
              <a href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1078627487" target="_blank" className="inline-block border border-blue-200/30 rounded px-2 py-0.5 text-xs text-blue-200/60 hover:text-blue-200 hover:border-blue-200/60 transition-colors">
                사업자정보확인
              </a>
            </div>
            {/* 소셜 아이콘 */}
            <div className="flex items-center gap-4 text-blue-200/50 shrink-0">
              <a href="#" aria-label="Instagram" className="hover:text-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" aria-label="KakaoTalk" className="hover:text-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.582 2 11c0 2.836 1.793 5.337 4.5 6.82L5.5 21l4.09-2.154C10.36 18.944 11.17 19 12 19c5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                </svg>
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-blue-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* 주소 및 연락처 */}
          <div className="text-blue-200/50 text-sm space-y-1 mb-8">
            <p>서울시 영등포구 국회대로68길 11, 삼보호정빌딩 5, 6층(여의도동)</p>
            <p>
              <span>TEL (02)787-1400</span>
              <span className="mx-4">FAX +82-787-1408</span>
            </p>
            <p>assesta@assesta.com</p>
          </div>

          {/* 구분선 */}
          <div className="border-t border-blue-200/10 mb-5" />

          {/* 카피라이트 + 링크 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-blue-200/40 text-xs">
            <p>copyright 2026. ASSESTA. All Rights Reserved.</p>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-blue-200 transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-blue-200 transition-colors">서비스 이용 약관</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ── SCROLL TO TOP ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로 이동"
        className={`cursor-pointer fixed bottom-6 right-6 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0f2d6e] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-[#1e4fa8] hover:-translate-y-1 hover:shadow-xl ${
          showTopBtn ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-4"
        }`}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  )
}
