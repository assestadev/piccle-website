"use client"

import { useState } from "react"

// ── Layout math ─────────────────────────────────────────────────────────────
// Container : position:relative, paddingBottom:133.33%
//             → height = 4/3 × width  (W)
// SVG viewBox: 0 0 300 400  (same 3:4 ratio → 1 SVG unit = W/300 px)
//
// CSS left  L%  → SVG x = L × 3
// CSS top   T%  → SVG y = T × 4   (T% of height = T/100 × 4W/3 → ÷ W/300 = T×4)
// CSS width W%  → SVG w = W × 3
// CSS height H% → SVG h = H × 4
//
// Cards (intentionally offset so left/right columns aren't perfectly mirrored):
//
//  채용  left=1%   top=0%   w=44% h=22%  → SVG (3,0,132,88)  right-ctr (135,44)
//  배치  left=55%  top=24%  w=42% h=22%  → SVG (165,96,126,88) left-ctr (165,140)
//  육성  left=4%   top=50%  w=44% h=22%  → SVG (12,200,132,88) right-ctr (144,244)
//  분석  left=52%  top=74%  w=44% h=22%  → SVG (156,296,132,88) left-ctr (156,340)
//
// Continuous S-curve:
//   M 135,44  C 230,44  230,140 165,140   ← bows RIGHT  (C1-smooth at junction)
//             C  60,140  60,244 144,244   ← bows LEFT
//             C 232,244 232,340 156,340   ← bows RIGHT

const S_PATH =
  "M 135,44 C 230,44 230,140 165,140 C 60,140 60,244 144,244 C 232,244 232,340 156,340"

// Junction dots — where the S-curve meets each card edge
const JUNCTIONS = [
  { cx: 135, cy: 44  },
  { cx: 165, cy: 140 },
  { cx: 144, cy: 244 },
  { cx: 156, cy: 340 },
]

// Organic flowing dots: varied size, opacity, speed, phase
// calcMode="spline" + ease-in-out gives natural acceleration through curves
const FLOW_DOTS = [
  { r: 3.6, op: 0.85, dur: "7.0s", begin: "0.0s" },
  { r: 2.5, op: 0.55, dur: "7.0s", begin: "0.7s" },
  { r: 3.2, op: 0.75, dur: "7.0s", begin: "1.4s" },
  { r: 2.8, op: 0.62, dur: "7.0s", begin: "2.1s" },
  { r: 3.8, op: 0.88, dur: "7.0s", begin: "2.8s" },
  { r: 2.3, op: 0.48, dur: "7.0s", begin: "3.5s" },
  { r: 3.4, op: 0.78, dur: "7.0s", begin: "4.2s" },
  { r: 2.6, op: 0.58, dur: "7.0s", begin: "4.9s" },
  { r: 3.0, op: 0.70, dur: "7.0s", begin: "5.6s" },
  { r: 2.2, op: 0.45, dur: "7.0s", begin: "6.3s" },
]

const STEPS = [
  {
    id: "recruitment",
    ko: "채용",
    en: "RECRUITMENT",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "placement",
    ko: "배치",
    en: "PLACEMENT",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 21h8M12 17v4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 8h4v5H7zM15 8h2v3h-2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "development",
    ko: "육성",
    en: "L&D · LEARNING\n& DEVELOPMENT",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "analysis",
    ko: "분석",
    en: "ANALYSIS & INSIGHTS",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

// CSS positions (intentionally asymmetric — not perfectly mirrored)
const POSITIONS = [
  { left: "1%",  top: "0%",  width: "44%", height: "22%" }, // 채용
  { left: "55%", top: "24%", width: "42%", height: "22%" }, // 배치
  { left: "4%",  top: "50%", width: "44%", height: "22%" }, // 육성
  { left: "52%", top: "74%", width: "44%", height: "22%" }, // 분석
]

export function HrFlowDiagram() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="relative w-full" style={{ paddingBottom: "133.33%" }}>
      <div className="absolute inset-0">

        {/* ── Background glow blobs — matched to hero rgba(59,130,246) palette ── */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "65%", height: "32%", top: "2%", left: "-8%",
            background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "60%", height: "30%", top: "52%", right: "-8%",
            background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />

        {/* ── SVG layer (renders BELOW cards) ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 300 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="hrGlowDot" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="hrGlowJn" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Dashed S-curve — blue-200 to match site palette ── */}
          <path
            d={S_PATH}
            stroke="#bfdbfe"
            strokeWidth="1.5"
            strokeDasharray="6 10"
            opacity="0.7"
          />

          {/* ── Junction dots (pulsing) — blue-300/400 to stay on-brand ── */}
          {JUNCTIONS.map((j, i) => (
            <g key={`jn-${i}`}>
              <circle cx={j.cx} cy={j.cy} fill="none" stroke="#60a5fa" strokeWidth="0.8">
                <animate attributeName="r"       values="3;7;3"     dur="2.8s" begin={`${i * 0.55}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0;0.35" dur="2.8s" begin={`${i * 0.55}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={j.cx} cy={j.cy} r="2.5" fill="#93c5fd" filter="url(#hrGlowJn)" opacity="0.9">
                <animate attributeName="r" values="2;3.2;2" dur="2.8s" begin={`${i * 0.55}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* ── Flowing dots — opacity:0 until animateMotion begins to avoid
               pre-animation artifact at SVG origin (0,0) ── */}
          {FLOW_DOTS.map((dot, i) => (
            <circle key={`dot-${i}`} r={dot.r} fill="#60a5fa" filter="url(#hrGlowDot)" opacity="0">
              <animateMotion
                dur={dot.dur}
                begin={dot.begin}
                repeatCount="indefinite"
                calcMode="spline"
                keyPoints="0;1"
                keyTimes="0;1"
                keySplines="0.42 0 0.58 1"
                path={S_PATH}
              />
              {/* Reveal at the exact moment motion begins, stay visible through all repeats */}
              <animate
                attributeName="opacity"
                from="0" to={dot.op}
                dur="0.001s"
                begin={dot.begin}
                fill="freeze"
              />
            </circle>
          ))}
        </svg>

        {/* ── Flow cards (render ON TOP of SVG) ── */}
        {STEPS.map((step, i) => {
          const pos = POSITIONS[i]
          const isHovered = hovered === step.id
          return (
            <div
              key={step.id}
              className="absolute"
              style={pos}
              onMouseEnter={() => setHovered(step.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={[
                  "w-full h-full flex flex-col justify-center items-start",
                  "bg-white rounded-xl border",
                  "px-[10%] py-[8%] cursor-default select-none",
                  "transition-all duration-300 ease-out",
                  isHovered
                    ? "border-blue-300 shadow-[0_6px_28px_rgba(30,79,168,0.18)] -translate-y-1 scale-[1.03]"
                    : "border-slate-200/80 shadow-md",
                ].join(" ")}
              >
                {/* Icon */}
                <div
                  className={[
                    "flex items-center justify-center rounded-lg mb-[6%] shrink-0",
                    "transition-colors duration-300 w-[28%] aspect-square",
                    isHovered ? "bg-blue-100 text-[#1e4fa8]" : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {step.icon}
                </div>

                {/* Korean name */}
                <p
                  className={[
                    "font-bold leading-tight transition-colors duration-300",
                    isHovered ? "text-[#1e4fa8]" : "text-slate-800",
                  ].join(" ")}
                  style={{ fontSize: "clamp(11px, 3.5%, 17px)" }}
                >
                  {step.ko}
                </p>

                {/* English subtitle */}
                <p
                  className="font-semibold tracking-widest text-slate-400 uppercase leading-tight whitespace-pre-line mt-[3%]"
                  style={{ fontSize: "clamp(7px, 1.8%, 10px)" }}
                >
                  {step.en}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
