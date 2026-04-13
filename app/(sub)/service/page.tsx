"use client"

import { useState, useRef, useEffect } from "react"

/* ── 솔루션 데이터 ── */
const SOLUTIONS = [
  {
    num: "01",
    tag: "Smart Interview",
    label: "AI 스마트 면접 설계",
    title: "AI가 도와주는\n스마트한 면접 설계",
    subtitle: "역량 모델 기반으로 AI가 설계하는 데이터 중심 면접 시스템",
    accent: "#0f2d6e",
    demo: {
      url: "https://v0-hr-saa-s-demo.vercel.app/competency",
      title: "역량모델링",
      desc: "역량사전 구성, 역량 추출, 출처 확인까지 AI가 자동으로 처리합니다.",
    },
    features: [
      {
        title: "적합도 점수(Fit Score) 시각화",
        body: "AI가 CPI 심리 검사 결과를 분석해 직무 핵심 역량과의 일치도를 한눈에 보기 편한 점수로 시각화합니다.",
      },
      {
        title: "위험 신호(Red Flag) 감지",
        body: "직무와 맞지 않는 심리적 특성 — 낮은 유연성, 지나친 예민성 등 — 을 사전에 면접관에게 알려줍니다.",
      },
      {
        title: "BEI 면접 질문 자동 생성",
        body: "낮은 역량 점수 영역을 집중 탐색하는 시나리오 기반 질문을 AI가 자동으로 생성합니다. 단순 능력 확인이 아닌, 과거 실제 행동을 통해 검증합니다.",
      },
      {
        title: "실시간 면접 대시보드 가이드",
        body: "면접관이 화면에서 맞춤 질문과 평가 지표를 즉시 확인하며 진행할 수 있습니다. 심리학 전문가가 아니어도 고도의 심층 면접이 가능합니다.",
      },
    ],
    summary: "면접관의 주관 없이, 데이터로 검증된 채용 의사결정을 내립니다.",
  },
  {
    num: "02",
    tag: "CPI Integration",
    label: "역량모델링 + CPI 통합",
    title: "역량 모델링과 CPI의 통합 모델",
    subtitle: "Can Do를 넘어 Will Do까지, 표면과 심층을 함께 보는 입체적 인재 평가",
    accent: "#1e4fa8",
    demo: {
      url: "https://v0-hr-saa-s-demo.vercel.app/recruitment",
      title: "AI 구조화 면접",
      desc: "CPI 행동 분석 기반 맞춤형 면접 가이드를 제공합니다.",
    },
    features: [
      {
        title: "역량 빙산 모델 기반 통합 평가",
        body: "역량 모델링(기술·지식 등 표면부)과 CPI(가치관·동기·기질 등 심층부)를 결합해 인재의 전체 역량을 입체적으로 파악합니다.",
      },
      {
        title: "Can Do vs Will Do 구분 측정",
        body: "지금 당장의 실력(Can Do)뿐만 아니라, 압박 속에서도 일관되게 성과를 유지할 의지와 지속성(Will Do)을 예측합니다.",
      },
      {
        title: "응답 타당성 자동 검증",
        body: "CPI의 긍정편향지수·무작위응답 척도로 답변 조작·왜곡을 탐지해 평가의 신뢰도를 높입니다.",
      },
      {
        title: "근본 원인 진단 + 맞춤 코칭 설계",
        body: "역량 부족이 공감 능력 문제인지 완벽주의 성향인지를 정확히 진단해, 개인의 심리적 구조에 맞는 맞춤형 코칭과 교육을 처방합니다.",
      },
    ],
    summary: "면접에서 완벽해 보였지만 현장에서 성과를 유지하지 못하는 미스매치를 사전에 방지합니다.",
  },
  {
    num: "03",
    tag: "AI Simulation",
    label: "1:1 AI 역량개발 시뮬레이션",
    title: "1:1 AI 역량개발 시뮬레이션",
    subtitle: "AI와 직접 대화하며 실전 역량을 키우는 표준화된 개발 솔루션",
    accent: "#2563eb",
    demo: {
      url: "https://v0-hr-saa-s-demo.vercel.app/coaching",
      title: "AI 1:1 롤플레이 코칭",
      desc: "직원 역량 개발을 위한 AI 시뮬레이션 코칭 세션을 관리합니다.",
    },
    features: [
      {
        title: "직무 맞춤 시나리오 기반 실전 연습",
        body: "단순히 보기를 고르는 시험이 아닌, 실제 업무 상황에서 어떻게 말하고 행동하는지를 AI와의 대화로 직접 보여줍니다. 조직의 목표와 가치에 맞게 시나리오를 맞춤 설정할 수 있습니다.",
      },
      {
        title: "AI 코치의 즉각적 피드백",
        body: "연습 과정을 실시간으로 분석해 무엇을 고쳐야 할지 즉석에서 안내합니다. 결과가 한참 뒤에 나오는 전통적 평가 방식과 달리, 학습과 성장 자체에 초점을 둡니다.",
      },
      {
        title: "역량 성장 추이 데이터 추적",
        body: "안전한 환경에서 언제든 반복 연습할 수 있으며, 시간이 흐름에 따라 역량 수준의 변화와 향상 추이를 지속적인 데이터로 확인합니다.",
      },
      {
        title: "팀장 코칭을 위한 객관적 리포트",
        body: "어떤 행동이 좋았고 어떤 부분이 부족했는지 상세한 리포트를 제공해, 팀장이 주관적 느낌이 아닌 데이터에 근거한 실질적 코칭을 진행할 수 있습니다.",
      },
    ],
    summary: "강의로는 바꿀 수 없는 실무 행동을, 반복 연습과 즉각 피드백으로 완성합니다.",
  },
]

/* ── 스케일 축소 iframe (스크롤 없음) ── */
function DemoFrame({ url, title }: { url: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)

  const IFRAME_W = 1280
  const IFRAME_H = 900

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setScale(containerRef.current.offsetWidth / IFRAME_W)
      }
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{ height: `${IFRAME_H * scale}px` }}
    >
      <iframe
        key={url}
        src={url}
        title={title}
        style={{
          width: `${IFRAME_W}px`,
          height: `${IFRAME_H}px`,
          border: "none",
          overflow: "hidden",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents: "auto",
        }}
        loading="lazy"
      />
    </div>
  )
}

/* ── 솔루션 콘텐츠 (데모 + 피처) — 타이틀 카드 제외 ── */
function SolutionBody({ sol }: { sol: typeof SOLUTIONS[number] }) {
  return (
    <>
      {/* 데모 미리보기 */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: sol.accent }}
            >
              DEMO
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800">{sol.demo.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sol.demo.desc}</p>
            </div>
          </div>
          <a
            href={sol.demo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1e4fa8] transition-colors"
          >
            새 탭에서 열기
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          </div>
          <span className="text-[10px] text-slate-400 font-mono truncate ml-1">{sol.demo.url}</span>
        </div>
        <DemoFrame url={sol.demo.url} title={sol.demo.title} />
      </div>

      {/* 피처 단일 카드 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {sol.features.map((f, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 px-7 py-6 ${
              i < sol.features.length - 1 ? "border-b border-slate-100" : ""
            }`}
          >
            <span
              className="flex-shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5"
              style={{ backgroundColor: sol.accent }}
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-800 mb-1.5 leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── 메인 컴포넌트 ── */
export default function ServicePage() {
  /* 데스크탑 탭 상태 */
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(true)

  /* 모바일 아코디언 상태 — 초기 전체 접힘 */
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const handleTabChange = (idx: number) => {
    if (idx === active) return
    setVisible(false)
    setTimeout(() => {
      setActive(idx)
      setVisible(true)
    }, 180)
  }

  const handleAccordionToggle = (idx: number) => {
    setOpenIdx(prev => (prev === idx ? null : idx))
  }

  const sol = SOLUTIONS[active]

  return (
    <div
      className="min-h-screen bg-[#f7f9fd] text-slate-900"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      {/* ── 상단 헤더 영역 ── */}
      <div className="bg-white border-b border-slate-200/60 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-[#1e4fa8] uppercase mb-4">Our Solution</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            서비스 소개
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
            AI와 심리 과학이 결합된 데이터 기반 인재 채용·개발 솔루션
          </p>
        </div>
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 lg:py-16">

        {/* ════════════════════════════════════════
            모바일 전용: 아코디언 UI
            ════════════════════════════════════════ */}
        <div className="flex flex-col gap-3 lg:hidden">
          {SOLUTIONS.map((s, i) => {
            const isOpen = openIdx === i
            return (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "shadow-[0_8px_32px_-4px_rgba(0,0,0,0.13),0_2px_10px_-2px_rgba(0,0,0,0.07)]"
                    : "border border-slate-100 bg-white shadow-sm"
                }`}
              >
                {/* 아코디언 헤더
                    - 닫힘: compact 레이블 (흰 배경)
                    - 열림: 타이틀 카드 역할 (accent 배경) — 본문 타이틀 카드 대체 */}
                <button
                  onClick={() => handleAccordionToggle(i)}
                  className="w-full text-left cursor-pointer transition-colors duration-300"
                  style={{ backgroundColor: isOpen ? s.accent : "#ffffff" }}
                >
                  {isOpen ? (
                    /* 열림 상태 — 타이틀 카드 */
                    <div className="px-6 pt-6 pb-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-white bg-white/20">
                            {s.num}
                          </span>
                          <span className="text-[11px] font-semibold tracking-widest uppercase text-blue-200">
                            {s.tag}
                          </span>
                        </div>
                        {/* 닫기 chevron */}
                        <svg
                          className="flex-shrink-0 mt-1 text-white/60"
                          width="18" height="18" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor" strokeWidth="2.5"
                        >
                          <path d="M18 15l-6-6-6 6" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2 leading-tight whitespace-pre-line">
                        {s.title}
                      </h2>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        {s.subtitle}
                      </p>
                    </div>
                  ) : (
                    /* 닫힘 상태 — compact 레이블 */
                    <div className="px-4 py-4 flex items-center gap-3">
                      <span className="flex-shrink-0 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                        {s.num}
                      </span>
                      <span className="text-sm font-semibold text-slate-600 flex-1 leading-snug">
                        {s.label}
                      </span>
                      {/* 열기 chevron */}
                      <svg
                        className="flex-shrink-0 text-slate-300"
                        width="18" height="18" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth="2.5"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* 아코디언 본문 — 타이틀 카드 없이 데모 + 피처만 */}
                {isOpen && (
                  <div className="bg-[#f7f9fd] p-4 flex flex-col gap-5">
                    <SolutionBody sol={s} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ════════════════════════════════════════
            데스크탑 전용: 기존 탭 + 사이드바 UI
            ════════════════════════════════════════ */}
        <div className="hidden lg:flex flex-row gap-6 lg:gap-10">

          {/* 좌: 솔루션 탭 버튼 */}
          <aside className="w-64 xl:w-72 flex-shrink-0">
            <div className="flex flex-col gap-3 sticky top-24">
              {SOLUTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleTabChange(i)}
                  className={`cursor-pointer w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 group ${
                    active === i
                      ? "bg-[#0f2d6e] border-[#0f2d6e] shadow-md shadow-blue-200"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold tracking-widest uppercase block mb-1 transition-colors ${
                      active === i ? "text-blue-200" : "text-slate-400 group-hover:text-slate-500"
                    }`}
                  >
                    {s.num} · {s.tag}
                  </span>
                  <span
                    className={`text-sm font-semibold leading-snug transition-colors ${
                      active === i ? "text-white" : "text-slate-600 group-hover:text-slate-800"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* 우: 솔루션 상세 내용 */}
          <main className="flex-1 min-w-0">
            <div
              className={`transition-all duration-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              {/* 솔루션 카드 상단 (데스크탑에서만 표시) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-9 mb-5 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-white"
                    style={{ backgroundColor: sol.accent }}
                  >
                    {sol.num}
                  </span>
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-slate-400">
                    {sol.tag}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-tight whitespace-pre-line">
                  {sol.title}
                </h2>
                <p className="text-base text-slate-500 leading-relaxed">
                  {sol.subtitle}
                </p>
              </div>

              <SolutionBody sol={sol} />
            </div>
          </main>
        </div>
      </div>

      {/* ── 하단 CTA ── */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-base font-bold text-slate-900 mb-1">도입이 궁금하신가요?</p>
            <p className="text-sm text-slate-500">맞춤 제안서와 무료 데모를 통해 자세히 안내해드립니다.</p>
          </div>
          <a
            href="/inquiry"
            className="inline-flex items-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white font-semibold px-7 py-3 rounded-xl text-sm transition-colors flex-shrink-0"
          >
            문의하기
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  )
}
