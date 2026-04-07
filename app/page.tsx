"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FadeIn } from "@/components/fade-in"
import { AnimatedUnderline } from "@/components/animated-underline"
import { IntelGraph } from "@/components/intel-graph"

const NAV = [
  { label: "문제 제기", id: "problem" },
  { label: "솔루션",    id: "solution" },
  { label: "활용사례",  id: "usecase" },
  { label: "보안 정책", id: "trust" },
]

const PROBLEM_CARDS = [
  {
    label: "고비용·저효율 구조",
    title: "고비용·일회성 모델",
    body: "전통적인 역량 모델링은 수동적인 설문과 인터뷰에 의존하여 구축까지 수개월이 소요되며, 한 번의 업데이트에도 막대한 시간과 외부 컨설팅 비용이 발생하는 비효율적인 구조를 반복합니다.",
    img: "/images/img01.jpg",
  },
  {
    label: "데이터 단절",
    title: "데이터 단절과 신뢰 붕괴",
    body: "표준화되지 않은 평가는 고성과자에게는 박탈감을, 저성과자에게는 명확한 개선 방향을 제시하지 못해 조직 전체의 신뢰를 무너뜨립니다.",
    img: "/images/img02.jpg",
  },
  {
    label: "정적 모델",
    title: "변화에 무딘 정적 모델",
    body: "한 번 구축하면 수년간 고정되어 변화에 무딘 정적 모델은 과거의 데이터로 현재를 정의하려 하므로 경영 손실로 직결됩니다.",
    img: "/images/img03.jpg",
  },
]

const SOLUTION_CARDS = [
  {
    tag: "Trust · 보안",
    title: "기업 전용 로컬 프라이빗 LLM",
    body: "기업 전용 '로컬 프라이빗 LLM' 인프라를 통해 인사 정보와 평가 결과 등 민감 데이터를 폐쇄망 내에서 외부 유출 걱정 없이 안전하게 보호합니다.",
    rows: [["데이터 보호", "폐쇄망 격리"], ["외부 유출", "Zero-Exit"], ["인증 방식", "기업 전용 LLM"], ["보안 등급", "엔터프라이즈급"]],
    accent: "#0f2d6e", light: "#eef3fb",
  },
  {
    tag: "What · AI 모델링",
    title: "실시간 역량 지도 생성",
    body: "수만 개의 유휴 데이터를 분석하여 조직 내 상위 1% 고성과자의 행동 패턴을 정밀하게 추출하고, 실시간으로 진화하는 역량 지도를 생성합니다.",
    rows: [["역할 스캔", "업무기술서"], ["Can Do", "역량 분석"], ["Will Do", "성과 패턴"], ["적합도", "핵심지표 분류"]],
    accent: "#1e4fa8", light: "#f0f5ff",
  },
  {
    tag: "How · Process",
    title: "구조화된 BEI 면접 자동화",
    body: "CPI 심리 데이터와 역량 빙산 모델을 결합하여 내적 동기까지 분석하며, 구조화된 BEI 면접 자동화를 통해 현재의 실력과 미래 가능성을 입체적으로 검증합니다.",
    rows: [["심리 분석", "CPI 모델"], ["역량 구조", "빙산 모델"], ["면접 방식", "BEI 자동화"], ["검증 범위", "현재+미래"]],
    accent: "#2563eb", light: "#eff6ff",
  },
]

const USECASE_CARDS = [
  {
    num: "01", category: "채용",
    title: "고성과자 DNA 기반 정밀 채용",
    body: "보안이 검증된 환경에서 고성과자 DNA를 매칭하여 객관적인 적합도 점수(Fit Score)를 산출하고, 지원자의 약점을 파악하는 시나리오 기반 질문으로 정밀 검증을 수행합니다.",
    img: "/images/img04.jpg",
    metrics: [{ label: "Fit Score 정확도", value: "89.3%" }, { label: "채용 소요 시간", value: "↓ 43%" }],
  },
  {
    num: "02", category: "리더십·조직개발",
    title: "실시간 리더십 코칭 & IDP",
    body: "유출 걱정 없는 내부 성과 데이터를 기반으로 실시간 리더십 코칭을 제공하며, 역량 부족의 근본 원인을 진단하여 맞춤형 성장 계획(IDP) 수립을 돕습니다.",
    img: "/images/img05.jpg",
    metrics: [{ label: "IDP 수립 완료율", value: "94%" }, { label: "리더십 역량 향상", value: "↑ 31%" }],
  },
  {
    num: "03", category: "훈련·시뮬레이션",
    title: "AI 시뮬레이션 실전 훈련 ASTRA",
    body: "실제 업무 현장과 유사한 AI 시뮬레이션 환경을 통해 구성원이 갈등 관리 및 협상 등 고난도 역량의 실전 감각을 즉각적으로 개선하도록 이끕니다.",
    img: "/images/img06.jpg",
    metrics: [{ label: "역량 개선 속도", value: "↑ 2.8x" }, { label: "훈련 만족도", value: "4.7 / 5" }],
  },
]

const TRUST_CARDS = [
  {
    title: "고민감 데이터 보호",
    body: "구성원의 성향 데이터는 개인의 권리에 직접적인 영향을 미치는 '고민감 데이터'이므로 보안이 담보되지 않은 외부망 범용 AI는 부적합합니다.",
  },
  {
    title: "HR 도메인 전문성",
    body: "HR 특화 AI는 조직 고유의 문화와 직무 체계, 인사 정책을 깊이 있게 이해하고 해석하는 차별화된 정교함을 갖추고 있습니다.",
  },
  {
    title: "윤리적 거버넌스",
    body: "마스킹과 권한 관리가 내장된 폐쇄형 환경에서 인간 전문가의 최종 감독(Human Oversight)을 통해 가장 윤리적이고 객관적인 결정을 내립니다.",
  },
]

export default function Page() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", h)
    return () => window.removeEventListener("scroll", h)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileMenuOpen(false)
  }

  return (
    <div
      className="min-h-screen bg-white text-slate-900 overflow-x-hidden"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >

      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white/96 backdrop-blur-xl border-b border-slate-200/60 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-slate-900">ASTRA</span>
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="cursor-pointer text-sm text-slate-600 hover:text-[#1e4fa8] transition-colors font-medium">
                {n.label}
              </button>
            ))}
          </nav>
          <button onClick={() => router.push("/inquiry")} className="cursor-pointer hidden md:inline-flex items-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
            문의하기
          </button>
          <button className="cursor-pointer md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-5 pb-4">
            {NAV.map(n => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="cursor-pointer block w-full text-left py-2.5 text-sm text-slate-700 border-b border-slate-100 last:border-0">
                {n.label}
              </button>
            ))}
            <button onClick={() => router.push("/inquiry")} className="cursor-pointer mt-3 w-full bg-[#0f2d6e] text-white text-sm font-semibold py-2.5 rounded-lg">문의하기</button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-gradient-to-b from-[#f4f7fc] via-white to-white">
        <div className="absolute inset-0 overflow-hidden">
          <IntelGraph />
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }} />
          <div className="absolute -top-16 right-0 w-[440px] h-[440px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 w-full text-center">
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
                기업들이 겪는 실제 문제 사례를 통해 현재의 역량 모델링이 안고 있는 구조적 문제를 살펴봅니다.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {PROBLEM_CARDS.map((c, i) => (
              <FadeIn key={i} delay={i * 150} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <span className="text-[11px] font-bold tracking-widest text-[#0f2d6e] uppercase mb-3 block">{c.label}</span>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{c.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{c.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section id="solution" className="py-28 lg:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-xs font-semibold tracking-widest text-[#1e4fa8] uppercase mb-5">Our Solution</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-slate-900 mb-6">
                안전한 AI 역량 구축,<br />
                <AnimatedUnderline color="rgba(59,130,246,0.4)" delay={300}>
                  <span className="text-[#1e4fa8]">어떤 솔루션이 필요할까요?</span>
                </AnimatedUnderline>
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                안전한 AI 기술을 기반으로 Trust(보안), What(AI 모델링), How &amp; Process 세 가지 핵심 축을 통해 조직의 인재 OS를 구축합니다.
              </p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {SOLUTION_CARDS.map((c, i) => (
              <FadeIn key={i} delay={i * 150} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <div className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
                  <div className="mb-7">
                    <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5 inline-block" style={{ color: c.accent, background: c.light }}>{c.tag}</span>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{c.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{c.body}</p>
                  </div>
                  <div className="mt-auto border-t border-slate-100 pt-5">
                    {c.rows.map(([k, v], j) => (
                      <div key={j} className="flex justify-between py-2.5 border-b border-slate-100 last:border-0">
                        <span className="text-sm text-slate-400">{k}</span>
                        <span className="text-sm font-semibold text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-medium" style={{ color: c.accent }}>
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: c.accent }} />
                    Live Modeling Active
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASE ── */}
      <section id="usecase" className="py-28 lg:py-36 bg-[#f7f9fd]">
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
            {USECASE_CARDS.map((c, i) => (
              <FadeIn key={i} delay={i * 150} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <span className="text-[11px] font-bold tracking-widest text-[#1e4fa8] uppercase mb-3 block">{c.category}</span>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{c.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{c.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section id="trust" className="py-28 lg:py-36 bg-[#0b1f4a]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <FadeIn>
            <div className="text-center mb-20">
              <p className="text-xs font-semibold tracking-widest text-blue-300 uppercase mb-5">Security Standards</p>
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
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {TRUST_CARDS.map((b, i) => (
              <FadeIn key={i} delay={i * 150} direction={i === 0 ? "left" : i === 2 ? "right" : "up"}>
                <div className="bg-white/[0.07] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.11] transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">{b.title}</h3>
                  <p className="text-blue-200/70 text-sm leading-relaxed">{b.body}</p>
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
              ASTRA와 함께 조직의 HR을 데이터 기반으로 혁신하고, 채용부터 육성까지 모든 인사 의사결정을 한 단계 높이세요.
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
      <footer className="bg-[#0b1f4a] py-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xl font-bold tracking-tight text-white/80">ASTRA</span>
          <p className="text-blue-200/50 text-sm text-center">© 2025 ASTRA. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-blue-200/50">
            <a href="#" className="cursor-pointer hover:text-blue-200 transition-colors">개인정보처리방침</a>
            <a href="#" className="cursor-pointer hover:text-blue-200 transition-colors">이용약관</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
