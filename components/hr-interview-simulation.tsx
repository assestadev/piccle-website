"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

type InterviewMetric = {
  fit: number
  readiness: number
}

function AnimatedBar({
  width,
}: {
  width: string
}) {
  return (
    <div className="h-[10px] overflow-hidden rounded-full bg-[#eef2f7]">
      <div
        className="bar-shell h-full rounded-full opacity-90"
        style={{
          width,
          transform: "scaleY(1)",
          boxShadow: "0 0 14px rgba(59,130,246,0.14)",
        }}
      >
        <div className="bar-fill is-active" />
        <style jsx>{`
          .bar-shell {
            transition: opacity 0.45s ease, transform 0.45s ease, box-shadow 0.45s ease;
          }

          .bar-fill {
            height: 100%;
            width: 100%;
            border-radius: 9999px;
            background: linear-gradient(90deg, #7aa7f8 0%, #8b5cf6 100%);
            transform-origin: left center;
          }

          .bar-fill.is-active {
            animation: report-bar-flow 1.6s ease-in-out infinite;
            background-size: 180% 100%;
          }

          @keyframes report-bar-flow {
            0% {
              transform: scaleX(0.18);
              opacity: 0.35;
              background-position: 0% 50%;
            }
            55% {
              transform: scaleX(1);
              opacity: 1;
              background-position: 100% 50%;
            }
            100% {
              transform: scaleX(1);
              opacity: 0.72;
              background-position: 100% 50%;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export function HrInterviewSimulation() {
  const [metric, setMetric] = useState<InterviewMetric>({ fit: 87.8, readiness: 92.4 })
  const [activeTrait, setActiveTrait] = useState(0)

  useEffect(() => {
    const metricInterval = window.setInterval(() => {
      setMetric({
        fit: 85 + Math.random() * 4,
        readiness: 90 + Math.random() * 5,
      })
    }, 2800)

    const traitInterval = window.setInterval(() => {
      setActiveTrait((prev) => (prev + 1) % 3)
    }, 1600)

    return () => {
      window.clearInterval(metricInterval)
      window.clearInterval(traitInterval)
    }
  }, [])

  const traits = [
    { label: "문제 해결력", width: "82%" },
    { label: "커뮤니케이션", width: "91%" },
    { label: "조직 적응력", width: "76%" },
  ]

  return (
    <div className="aspect-[574/475.5] h-full w-full font-sans text-slate-600">
      <div className="flex h-12 items-center justify-between px-5">
        <Image
          src="https://img.assesta.com/piccle/logo.png"
          alt="PICCLE"
          width={84}
          height={28}
          className="h-auto w-[84px]"
        />

        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-blue-600">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
          Live
        </div>
      </div>

      <div className="grid h-[calc(100%-3rem)] grid-rows-[56%_34%] gap-3 bg-[#fcfdfe] px-4 py-4">
        <div className="grid grid-cols-[1.02fr_0.98fr] gap-4">
          <div className="relative overflow-hidden rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">행동 특성 인터뷰 분석</h3>
                <p className="mt-1 text-[10px] text-slate-400">질문과 응답 흐름에서 핵심 신호를 추적합니다.</p>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">Transcript</span>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-[11px] leading-5 text-slate-500">
                <span className="mr-2 font-bold text-slate-700">면접관</span>
                최근 프로젝트에서 가장 어려웠던 의사결정 경험을 설명해 주세요.
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-[11px] leading-5 text-slate-600">
                <span className="mr-2 font-bold text-slate-700">지원자</span>
                여러 이해관계자가 충돌하는 상황에서 우선순위를 재정의하고, 데이터 기준으로 합의를 이끌었습니다.
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-[11px] leading-5 text-blue-700">
                <span className="mr-2 font-bold">AI 분석</span>
                문제 해결력과 협업 조율 역량이 반복적으로 감지됩니다.
                <span className="ml-1 inline-block h-3.5 w-[1px] animate-pulse bg-blue-600 align-middle" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["문제 해결", "협업 조율", "조직 적응"].map((tag, index) => (
                <span
                  key={tag}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors duration-500 ${
                    activeTrait === index ? "bg-blue-100 text-blue-700" : "bg-[#f5f9ff] text-blue-600"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-slate-800">행동 특성 리포트</h3>
              <span className="text-[11px] font-bold text-blue-700">BEI</span>
            </div>

            <div className="space-y-4">
              {traits.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>{item.label}</span>
                    <span className="text-blue-700">{item.width}</span>
                  </div>
                  <AnimatedBar width={item.width} />
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[#f8fbff] p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Follow-up Question</p>
              <p className="mt-2 text-[11px] leading-5 text-slate-600">
                갈등 상황에서 본인이 직접 기준을 세우고 합의를 만든 경험을 더 구체적으로 확인해 보세요.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[0.9fr_0.9fr_1.2fr] gap-4">
          <div className="rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400">적합도 점수</p>
            <div className="mt-3 flex items-end gap-1">
              <span className="tabular-nums text-[2rem] font-black leading-none text-slate-800">{metric.fit.toFixed(1)}</span>
              <span className="pb-1 text-[11px] font-bold text-slate-400">%</span>
            </div>
            <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all duration-1000" style={{ width: `${metric.fit}%` }} />
            </div>
          </div>

          <div className="rounded-[1.15rem] border border-[#eef2f6] border-l-[3px] border-l-emerald-500 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400">면접 준비도</p>
            <div className="mt-3 flex items-end gap-1">
              <span className="tabular-nums text-[2rem] font-black leading-none text-emerald-600">{metric.readiness.toFixed(1)}</span>
              <span className="pb-1 text-[11px] font-bold text-slate-400">%</span>
            </div>
            <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${metric.readiness}%` }} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.15rem] bg-blue-600 p-5 shadow-lg shadow-blue-200">
            <div className="absolute right-[-12%] top-[-32%] h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">Interview Guide</p>
              <h5 className="mt-1.5 text-[0.8rem] font-semibold leading-snug text-white">심층 확인이 필요한 행동 특성 3개</h5>
              <div className="mt-3.5 text-[1.5rem] font-black leading-none text-white">3개</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
