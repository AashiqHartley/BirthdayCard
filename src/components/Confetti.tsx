import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export type ConfettiHandle = {
  /** Burst from a point in viewport coordinates. */
  burst: (x: number, y: number) => void
}

const COLORS = ['#f2b4c3', '#e89aae', '#cdb8ec', '#e5c47e', '#bcd3b0', '#fff3e2', '#f7cdb0']
const COUNT = 150
const MAX_LIFE_MS = 6500

type Shape = 'paper' | 'circle' | 'star'
type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rot: number
  vr: number
  tilt: number
  vt: number
  wobble: number
  color: string
  shape: Shape
  born: number
  fadeAt: number
}

function drawStar(ctx: CanvasRenderingContext2D, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad)
  }
  ctx.closePath()
  ctx.fill()
}

/**
 * One-shot canvas confetti. The animation loop only runs while particles are alive,
 * then stops and clears the canvas.
 */
export const Confetti = forwardRef<ConfettiHandle>(function Confetti(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const raf = useRef(0)

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  useImperativeHandle(ref, () => ({
    burst(x, y) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const now = performance.now()
      const power = Math.min(Math.max(w, h) / 70, 15)
      const count = w < 500 ? Math.round(COUNT * 0.75) : COUNT
      for (let i = 0; i < count; i++) {
        // Mostly upward fan, with some sideways pieces
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25
        const speed = power * (0.45 + Math.random() * 0.75)
        const r = Math.random()
        const shape: Shape = r < 0.62 ? 'paper' : r < 0.86 ? 'circle' : 'star'
        particles.current.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: shape === 'circle' ? 2.5 + Math.random() * 2.5 : 5 + Math.random() * 5,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          tilt: Math.random() * Math.PI,
          vt: 0.05 + Math.random() * 0.12,
          wobble: Math.random() * 10,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          shape,
          born: now,
          fadeAt: 2600 + Math.random() * 2400,
        })
      }

      if (raf.current) return
      let last = now
      const tick = (t: number) => {
        const dt = Math.min((t - last) / 16.67, 3)
        last = t
        ctx.clearRect(0, 0, w, h)
        const alive: Particle[] = []
        for (const p of particles.current) {
          const age = t - p.born
          if (age > MAX_LIFE_MS || p.y > h + 40) continue
          p.vx *= Math.pow(0.975, dt)
          p.vy = p.vy * Math.pow(0.975, dt) + 0.22 * dt
          p.vy = Math.min(p.vy, p.shape === 'paper' ? 3.2 : 4.5)
          p.wobble += 0.08 * dt
          p.x += (p.vx + Math.sin(p.wobble) * 0.6) * dt
          p.y += p.vy * dt
          p.rot += p.vr * dt
          p.tilt += p.vt * dt
          const alpha = age > p.fadeAt ? Math.max(0, 1 - (age - p.fadeAt) / 1200) : 1
          if (alpha <= 0) continue
          alive.push(p)

          ctx.save()
          ctx.globalAlpha = alpha
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          if (p.shape === 'paper') {
            // Scale on one axis to fake a 3D flip
            ctx.scale(1, Math.cos(p.tilt))
            ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6)
          } else if (p.shape === 'circle') {
            ctx.beginPath()
            ctx.arc(0, 0, p.size, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.scale(Math.cos(p.tilt) * 0.4 + 0.6, 1)
            drawStar(ctx, p.size * 0.7)
          }
          ctx.restore()
        }
        particles.current = alive
        if (alive.length) {
          raf.current = requestAnimationFrame(tick)
        } else {
          ctx.clearRect(0, 0, w, h)
          raf.current = 0
        }
      }
      raf.current = requestAnimationFrame(tick)
    },
  }))

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />
})
