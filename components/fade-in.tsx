"use client"

import { useEffect, useRef, useState, ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: "up" | "left" | "right" | "none"
}

export function FadeIn({ children, delay = 0, className = "", direction = "up" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTimeout(() => setVisible(true), delay) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [delay])

  const base = "transition-all duration-700 ease-out"
  const hidden =
    direction === "up"    ? "opacity-0 translate-y-8" :
    direction === "left"  ? "opacity-0 -translate-x-8" :
    direction === "right" ? "opacity-0 translate-x-8" :
    "opacity-0"
  const shown = "opacity-100 translate-y-0 translate-x-0"

  return (
    <div ref={ref} className={`${base} ${visible ? shown : hidden} ${className}`}>
      {children}
    </div>
  )
}
