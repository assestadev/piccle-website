"use client"

import { useEffect, useRef } from "react"

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  opacity: number
  pulse: number
}

export function IntelGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    let nodes: Node[] = []

    const resize = () => {
      const p = canvas.parentElement!
      canvas.width = p.offsetWidth
      canvas.height = p.offsetHeight
      nodes = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      }))
    }
    resize()
    window.addEventListener("resize", resize)

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener("mousemove", onMove)

    const draw = () => {
      if (!canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Grid lines
      const G = 80
      for (let x = 0; x <= canvas.width; x += G) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = "rgba(96,165,250,0.13)"; ctx.lineWidth = 1; ctx.stroke()
      }
      for (let y = 0; y <= canvas.height; y += G) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y)
        ctx.strokeStyle = "rgba(96,165,250,0.13)"; ctx.lineWidth = 1; ctx.stroke()
      }

      const m = mouseRef.current
      nodes.forEach(n => {
        n.pulse += 0.018
        n.x += n.vx; n.y += n.vy
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1

        const dx = m.x - n.x, dy = m.y - n.y
        if (Math.sqrt(dx * dx + dy * dy) < 160) {
          n.x += dx * 0.004
          n.y += dy * 0.004
        }

        const glow = Math.sin(n.pulse) * 0.2 + 0.8
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(99,166,253,${n.opacity * glow})`
        ctx.fill()
      })

      // Connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(99,166,253,${(1 - d / 130) * 0.18})`
            ctx.lineWidth = 0.8; ctx.stroke()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  )
}
