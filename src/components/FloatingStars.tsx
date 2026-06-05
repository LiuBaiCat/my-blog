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
const STAR_COUNT = 45
const PUSH_RADIUS = 140
const MAX_PUSH = 60

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
  const stars = useMemo(generateStars, [])
  const starRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const particlesRef = useRef<StarParticle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    particlesRef.current = stars.map(s => ({ ...s }))

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    document.addEventListener('mousemove', handleMouseMove)

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = time

      const w = window.innerWidth
      const h = window.innerHeight
      const { x: mx, y: my } = mouseRef.current
      const particles = particlesRef.current

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
        const dist = Math.sqrt(dx * dx + dy * dy)
        let pushX = 0
        let pushY = 0

        if (dist < PUSH_RADIUS && dist > 0) {
          const force = ((PUSH_RADIUS - dist) / PUSH_RADIUS) * MAX_PUSH
          const angle = Math.atan2(dy, dx)
          pushX = Math.cos(angle) * force
          pushY = Math.sin(angle) * force
        }

        p.rotation += p.rotationSpeed * dt

        const el = starRefs.current.get(p.id)
        if (el) {
          el.style.left = `${p.x}px`
          el.style.top = `${p.y}px`
          el.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${p.rotation}deg)`
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [stars])

  return (
    <div className="floating-stars">
      {stars.map(star => (
        <div
          key={star.id}
          className="floating-star"
          ref={el => {
            if (el) starRefs.current.set(star.id, el)
            else starRefs.current.delete(star.id)
          }}
          style={{
            left: star.x,
            top: star.y,
            opacity: star.opacity,
          }}
        >
          <CuteStarIcon size={star.size} color={star.color} />
        </div>
      ))}
    </div>
  )
}
