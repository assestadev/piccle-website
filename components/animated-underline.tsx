"use client"

import { useEffect, useRef, useState, ReactNode } from "react"

interface AnimatedUnderlineProps {
  children: ReactNode
  color?: string
  className?: string
  delay?: number
}

export function AnimatedUnderline({
  children,
  color = "rgba(59,130,246,0.45)",
  className = "",
  delay = 0,
}: AnimatedUnderlineProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(() => setDrawn(true), delay) },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [delay])

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      <svg
        className="absolute left-0 w-full overflow-visible pointer-events-none hidden sm:block"
        style={{ bottom: "-6px" }}
        height="14"
        viewBox="0 0 300 14"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 8 Q75 3 150 8 Q225 13 298 7"
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: 320,
            strokeDashoffset: drawn ? 0 : 320,
            transition: "stroke-dashoffset 0.95s cubic-bezier(0.4,0,0.2,1) 0s",
          }}
        />
      </svg>
    </span>
  )
}
