"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

type CoachingState = {
  score: number
  response: number
}

function AnimatedBar({
  width,
}: {
  width: string
}) {
  return (
    <div className="h-[10px] overflow-hidden rounded-full bg-[#eef2f7]">
      <div
        className="h-full rounded-full opacity-90"
        style={{
          width,
          boxShadow: "0 0 14px rgba(59,130,246,0.14)",
        }}
      >
        <div className="coaching-bar-fill h-full w-full rounded-full" />
        <style jsx>{`
          .coaching-bar-fill {
            background: linear-gradient(90deg, #7aa7f8 0%, #8b5cf6 100%);
            background-size: 180% 100%;
            transform-origin: left center;
            animation: coaching-report-bar-flow 1.6s ease-in-out infinite;
          }

          @keyframes coaching-report-bar-flow {
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

export function HrCoachingSimulation() {
  const [state, setState] = useState<CoachingState>({ score: 89.6, response: 93.4 })
  const [activeFeedback, setActiveFeedback] = useState(0)

  useEffect(() => {
    const scoreInterval = window.setInterval(() => {
      setState({
        score: 87 + Math.random() * 4,
        response: 91 + Math.random() * 4,
      })
    }, 3000)

    const feedbackInterval = window.setInterval(() => {
      setActiveFeedback((prev) => (prev + 1) % 3)
    }, 1700)

    return () => {
      window.clearInterval(scoreInterval)
      window.clearInterval(feedbackInterval)
    }
  }, [])

  const feedbackBars = [
    { label: "피드백 흡수력", width: "84%" },
    { label: "실행 전환 속도", width: "79%" },
    { label: "자기 점검 루틴", width: "68%" },
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
        <div className="grid grid-cols-[0.98fr_1.02fr] gap-4">
          <div className="relative overflow-hidden rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-slate-800">1:1 코칭 세션 요약</h3>
                <p className="mt-1 text-[10px] text-slate-400">대화 흐름 속에서 개선 포인트를 계속 추적합니다.</p>
              </div>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">Session Live</span>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-[11px] leading-5 text-slate-500">
                <span className="mr-2 font-bold text-slate-700">AI 코치</span>
                최근 실행 계획 중 실제 행동으로 옮긴 부분과 중단된 부분을 나눠서 이야기해 볼까요?
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-[11px] leading-5 text-blue-700">
                <span className="mr-2 font-bold">참여자</span>
                우선순위는 세웠지만 중간 점검 루틴이 없어 실행이 끊긴 지점이 있었습니다.
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[11px] leading-5 text-emerald-700">
                <span className="mr-2 font-bold">AI 피드백</span>
                실행 루틴 설계와 자기 점검 주기를 먼저 보완하는 것이 효과적입니다.
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-slate-800">AI 코칭 리포트</h3>
              <span className="text-[11px] font-bold text-blue-700">실시간 갱신</span>
            </div>

            <div className="space-y-4">
              {feedbackBars.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>{item.label}</span>
                    <span className="text-blue-700">{item.width}</span>
                  </div>
                  <AnimatedBar width={item.width} />
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className={`rounded-2xl bg-[#f8fbff] p-4 transition-colors duration-500 ${activeFeedback === 0 ? "ring-1 ring-blue-100" : ""}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">강점</p>
                <p className="mt-2 text-[11px] leading-5 text-slate-600">피드백을 이해하고 받아들이는 속도는 높지만 루틴 고정이 필요합니다.</p>
              </div>
              <div className={`rounded-2xl bg-[#f8fbff] p-4 transition-colors duration-500 ${activeFeedback === 2 ? "ring-1 ring-emerald-100" : ""}`}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">다음 행동</p>
                <p className="mt-2 text-[11px] leading-5 text-slate-600">주간 자기 점검 질문 3개를 고정해 실행 흐름을 유지해 보세요.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[0.9fr_0.9fr_1.2fr] gap-4">
          <div className="rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400">세션 점수</p>
            <div className="mt-3 flex items-end gap-1">
              <span className="tabular-nums text-[2rem] font-black leading-none text-slate-800">{state.score.toFixed(1)}</span>
              <span className="pb-1 text-[11px] font-bold text-slate-400">pts</span>
            </div>
            <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all duration-1000" style={{ width: `${state.score}%` }} />
            </div>
          </div>

          <div className="rounded-[1.15rem] border border-[#eef2f6] border-l-[3px] border-l-emerald-500 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400">응답 반영률</p>
            <div className="mt-3 flex items-end gap-1">
              <span className="tabular-nums text-[2rem] font-black leading-none text-emerald-600">{state.response.toFixed(1)}</span>
              <span className="pb-1 text-[11px] font-bold text-slate-400">%</span>
            </div>
            <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${state.response}%` }} />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[1.15rem] bg-blue-600 p-5 shadow-lg shadow-blue-200">
            <div className="absolute right-[-12%] top-[-32%] h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">Next Action</p>
              <h5 className="mt-1.5 text-[0.8rem] font-semibold leading-snug text-white">다음 주 실행 루틴 2개 추천</h5>
              <div className="mt-3.5 text-[1.5rem] font-black leading-none text-white">2개</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
