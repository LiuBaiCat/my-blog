import { useMemo, useRef, useEffect } from 'react'
import CuteStarIcon from './Icons/CuteStarIcon'
import './FloatingStars.css'

interface StarParticle {
  id: number
  x: number
  y: number
  size: number
  color: string
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  opacity: number
}

const COLORS = [
  'var(--color-primary)',
  'var(--color-star)',
  'var(--color-soft-purple)',
  'var(--color-moon)',
  'var(--color-rocket)',
  '#60a5fa',
  '#93c5fd',
]
const STAR_COUNT = 15
const PUSH_RADIUS = 140
const PUSH_RADIUS_SQ = PUSH_RADIUS * PUSH_RADIUS
const MAX_PUSH = 60
const WRITE_THRESHOLD = 0.5

function generateStars(): StarParticle[] {
  const w = window.innerWidth
  const h = window.innerHeight
  return Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * w,
    y: Math.random() * h,
    size: 12 + Math.random() * 16,
    color: COLORS[i % COLORS.length],
    vx: (Math.random() - 0.5) * 40,
    vy: (Math.random() - 0.5) * 40,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 30,
    opacity: 0.15 + Math.random() * 0.2,
  }))
}

export default function FloatingStars() {
  const stars = useMemo(() => generateStars(), [])
  const starRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastPositions = useRef<{ x: number; y: number; rot: number }[]>([])
  const particlesRef = useRef<StarParticle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)

  useEffect(() => {
    particlesRef.current = stars.map(s => ({ ...s }))
    lastPositions.current = new Array(STAR_COUNT)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    document.addEventListener('mousemove', handleMouseMove)

    const animate = (time: number) => {
      frameCountRef.current++
      if (frameCountRef.current % 2 !== 0) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = time

      const w = window.innerWidth
      const h = window.innerHeight
      const { x: mx, y: my } = mouseRef.current
      const particles = particlesRef.current
      const els = starRefs.current
      const prev = lastPositions.current

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx * dt
        p.y += p.vy * dt

        const margin = p.size
        if (p.x < margin) { p.x = margin; p.vx = -p.vx * 0.97 }
        if (p.x > w - margin) { p.x = w - margin; p.vx = -p.vx * 0.97 }
        if (p.y < margin) { p.y = margin; p.vy = -p.vy * 0.97 }
        if (p.y > h - margin) { p.y = h - margin; p.vy = -p.vy * 0.97 }

        const dx = p.x - mx
        const dy = p.y - my
        const distSq = dx * dx + dy * dy
        let pushX = 0
        let pushY = 0

        if (distSq < PUSH_RADIUS_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq)
          const force = ((PUSH_RADIUS - dist) / PUSH_RADIUS) * MAX_PUSH
          pushX = (dx / dist) * force
          pushY = (dy / dist) * force
        }

        p.rotation += p.rotationSpeed * dt

        const newX = p.x + pushX
        const newY = p.y + pushY
        const lp = prev[i]
        if (lp && Math.abs(newX - lp.x) < WRITE_THRESHOLD && Math.abs(newY - lp.y) < WRITE_THRESHOLD && Math.abs(p.rotation - lp.rot) < WRITE_THRESHOLD) {
          continue
        }

        const el = els[i]
        if (el) {
          el.style.transform = `translate(${newX}px, ${newY}px) rotate(${p.rotation}deg)`
          prev[i] = { x: newX, y: newY, rot: p.rotation }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const start = () => {
      lastTimeRef.current = 0
      rafRef.current = requestAnimationFrame(animate)
    }

    const stop = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }

    const handleVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('blur', stop)
    window.addEventListener('focus', start)

    if (!document.hidden) start()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('blur', stop)
      window.removeEventListener('focus', start)
      cancelAnimationFrame(rafRef.current)
    }
  }, [stars])

  return (
    <div className="floating-stars">
      {stars.map(star => (
        <div
          key={star.id}
          className="floating-star"
          ref={el => { starRefs.current[star.id] = el }}
          style={{
            transform: `translate(${star.x}px, ${star.y}px)`,
            opacity: star.opacity,
          }}
        >
          <CuteStarIcon size={star.size} color={star.color} />
        </div>
      ))}
    </div>
  )
}
