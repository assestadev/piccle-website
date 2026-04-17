"use client"

import { useEffect, useRef } from "react"

export function IntelGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const resize = () => {
      const p = canvas.parentElement!
      canvas.width = p.offsetWidth
      canvas.height = p.offsetHeight
      drawGrid()
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const G = 80
      for (let x = 0; x <= canvas.width; x += G) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height)
        ctx.strokeStyle = "rgba(96,165,250,0.13)"; ctx.lineWidth = 1; ctx.stroke()
      }
      for (let y = 0; y <= canvas.height; y += G) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y)
        ctx.strokeStyle = "rgba(96,165,250,0.13)"; ctx.lineWidth = 1; ctx.stroke()
      }
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  )
}
