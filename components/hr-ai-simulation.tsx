"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

type StatState = {
  prediction: number
  fit: number
}

function SkeletonBar({ width }: { width: string }) {
  return (
    <div className="h-[10px] overflow-hidden rounded-md bg-[#eef2f7]">
      <div className="skeleton-flow h-full rounded-md bg-gradient-to-r from-[#7aa7f8] to-[#8b5cf6] opacity-70" style={{ ["--target-width" as string]: width }} />
      <style jsx>{`
        .skeleton-flow {
          width: var(--target-width);
          animation: skeleton-flow 3.5s infinite ease-in-out;
        }
        @keyframes skeleton-flow {
          0% { width: 0%; opacity: 0.18; }
          42% { width: var(--target-width); opacity: 0.7; }
          100% { width: var(--target-width); opacity: 0.18; }
        }
      `}</style>
    </div>
  )
}

function HRAISimulation() {
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [stats, setStats] = useState<StatState>({ prediction: 93.3, fit: 91.0 })

  useEffect(() => {
    const radarCanvas = radarCanvasRef.current
    const particleCanvas = particleCanvasRef.current
    if (!radarCanvas || !particleCanvas) return

    const radarCtx = radarCanvas.getContext("2d")
    const particleCtx = particleCanvas.getContext("2d")
    if (!radarCtx || !particleCtx) return

    let radarAnimationFrame = 0
    let particleAnimationFrame = 0

    const labels = ["분석력", "리더십", "협업", "적응력", "몰입도", "판단력"]
    let values = [84, 72, 67, 79, 68, 74]
    const targets = [...values]

    const resizeRadar = () => {
      const container = radarCanvas.parentElement
      if (!container) return
      radarCanvas.width = container.clientWidth
      radarCanvas.height = container.clientHeight
    }

    const drawRadar = () => {
      const { width, height } = radarCanvas
      radarCtx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2
      const radius = Math.min(cx, cy) * 0.52
      const step = (Math.PI * 2) / labels.length

      values = values.map((value, index) => {
        const diff = targets[index] - value
        if (Math.abs(diff) < 0.18) targets[index] = 50 + Math.random() * 35
        return value + diff * 0.045
      })

      radarCtx.strokeStyle = "#edf2fa"
      radarCtx.lineWidth = 1
      ;[0.3, 0.6, 1].forEach((multiplier) => {
        radarCtx.beginPath()
        for (let i = 0; i <= labels.length; i += 1) {
          const r = radius * multiplier
          const x = cx + r * Math.cos(i * step - Math.PI / 2)
          const y = cy + r * Math.sin(i * step - Math.PI / 2)
          if (i === 0) radarCtx.moveTo(x, y)
          else radarCtx.lineTo(x, y)
        }
        radarCtx.closePath()
        radarCtx.stroke()
      })

      radarCtx.font = "600 11px Pretendard, sans-serif"
      radarCtx.fillStyle = "#94a3b8"
      radarCtx.textAlign = "center"
      labels.forEach((label, index) => {
        const x = cx + (radius + 24) * Math.cos(index * step - Math.PI / 2)
        const y = cy + (radius + 20) * Math.sin(index * step - Math.PI / 2)
        radarCtx.fillText(label, x, y)
      })

      radarCtx.beginPath()
      radarCtx.lineWidth = 2.8
      radarCtx.strokeStyle = "#2563eb"
      radarCtx.fillStyle = "rgba(37, 99, 235, 0.08)"
      values.forEach((value, index) => {
        const r = radius * (value / 100)
        const x = cx + r * Math.cos(index * step - Math.PI / 2)
        const y = cy + r * Math.sin(index * step - Math.PI / 2)
        if (index === 0) radarCtx.moveTo(x, y)
        else radarCtx.lineTo(x, y)
      })
      radarCtx.closePath()
      radarCtx.fill()
      radarCtx.stroke()

      values.forEach((value, index) => {
        const r = radius * (value / 100)
        const x = cx + r * Math.cos(index * step - Math.PI / 2)
        const y = cy + r * Math.sin(index * step - Math.PI / 2)
        radarCtx.beginPath()
        radarCtx.fillStyle = "#2563eb"
        radarCtx.arc(x, y, 4, 0, Math.PI * 2)
        radarCtx.fill()
        radarCtx.strokeStyle = "#ffffff"
        radarCtx.lineWidth = 2
        radarCtx.stroke()
      })

      radarAnimationFrame = requestAnimationFrame(drawRadar)
    }

    type Particle = { x: number; y: number; size: number; velocity: number }
    let particles: Particle[] = []

    const initParticles = () => {
      const container = particleCanvas.parentElement
      if (!container) return
      particleCanvas.width = container.clientWidth
      particleCanvas.height = container.clientHeight
      particles = Array.from({ length: 20 }, () => ({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        size: Math.random() * 1.8 + 0.6,
        velocity: Math.random() * 0.25 + 0.08,
      }))
    }

    const drawParticles = () => {
      particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height)
      particleCtx.fillStyle = "#d5dbe6"
      particles.forEach((particle) => {
        particle.y -= particle.velocity
        if (particle.y < -8) particle.y = particleCanvas.height + 8
        particleCtx.beginPath()
        particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        particleCtx.fill()
      })
      particleAnimationFrame = requestAnimationFrame(drawParticles)
    }

    const handleResize = () => {
      resizeRadar()
      initParticles()
    }

    resizeRadar()
    initParticles()
    drawRadar()
    drawParticles()
    window.addEventListener("resize", handleResize)

    const interval = window.setInterval(() => {
      setStats({
        prediction: 92 + Math.random() * 3,
        fit: 88 + Math.random() * 4,
      })
    }, 3000)

    return () => {
      cancelAnimationFrame(radarAnimationFrame)
      cancelAnimationFrame(particleAnimationFrame)
      window.removeEventListener("resize", handleResize)
      window.clearInterval(interval)
    }
  }, [])

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

      <div className="grid h-[calc(100%-3rem)] grid-rows-[55%_35%] gap-3 bg-[#fcfdfe] px-4 py-4">
        <div className="grid grid-cols-[1fr_1.1fr] gap-4">
          <div className="relative overflow-hidden rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <div className="absolute left-5 top-5 z-10">
              <h3 className="text-[13px] font-bold text-slate-800">역량 레이더 분석</h3>
            </div>
            <canvas ref={radarCanvasRef} className="h-full w-full" />
          </div>

          <div className="relative overflow-hidden rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <div className="relative z-10 mb-6 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-800">AI 분석 리포트</h4>
                </div>
              </div>
              <div className="text-[11px] font-bold text-blue-700">88%</div>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400">분석 정확도</div>
                <SkeletonBar width="88%" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>예측 신뢰도</span>
                  <span className="font-bold text-blue-700">92%</span>
                </div>
                <SkeletonBar width="92%" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>조직 적합도</span>
                  <span className="font-bold text-blue-700">78%</span>
                </div>
                <SkeletonBar width="78%" />
              </div>
            </div>

            <canvas ref={particleCanvasRef} className="pointer-events-none absolute inset-0 opacity-20" />
          </div>
        </div>

        <div className="grid grid-cols-[0.95fr_0.95fr_1.1fr] gap-4">
          <div className="rounded-[1.15rem] border border-[#eef2f6] bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400">예측 점수</p>
            <div className="mt-3 flex items-end gap-1">
              <span className="tabular-nums text-[2rem] font-black leading-none text-slate-800">{stats.prediction.toFixed(1)}</span>
              <span className="pb-1 text-[11px] font-bold text-slate-400">pts</span>
            </div>
            <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all duration-1000" style={{ width: `${stats.prediction}%` }} />
            </div>
          </div>

          <div className="rounded-[1.15rem] border border-[#eef2f6] border-l-[3px] border-l-emerald-500 bg-white p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400">조직 적합도</p>
            <div className="mt-3 flex items-end gap-1">
              <span className="tabular-nums text-[2rem] font-black leading-none text-emerald-600">{stats.fit.toFixed(1)}</span>
              <span className="pb-1 text-[11px] font-bold text-slate-400">%</span>
            </div>
            <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${stats.fit}%` }} />
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[1.15rem] bg-blue-600 p-5 shadow-lg shadow-blue-200">
            <div className="absolute right-[-12%] top-[-32%] h-32 w-32 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />
            <div className="relative z-10">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">Recommendation</p>
              <h5 className="mt-1.5 text-[0.74rem] font-semibold leading-snug text-white">추천 인재군 일치율</h5>
              <div className="mt-3.5 text-[1.5rem] font-black leading-none text-white">98.2%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HRAISimulation
export { HRAISimulation as HrAiSimulation }
