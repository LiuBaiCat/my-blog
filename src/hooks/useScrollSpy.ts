import { useState, useEffect } from 'react'

const OBSERVER_MARGIN = '-80px 0px -60% 0px'

export function useScrollSpy(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (ids.length === 0) return

    const visibleMap = new Map<string, boolean>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleMap.set(entry.target.id, entry.isIntersecting)
        }

        const firstVisible = ids.find(id => visibleMap.get(id) === true)
        if (firstVisible) {
          setActiveId(firstVisible)
          return
        }

        // All headings scrolled past: pick the last one
        const firstEl = document.getElementById(ids[0])
        const lastEl = document.getElementById(ids[ids.length - 1])
        if (lastEl && firstEl && firstEl.getBoundingClientRect().top > 0) {
          setActiveId(null)
        } else if (lastEl && lastEl.getBoundingClientRect().top < 0) {
          setActiveId(ids[ids.length - 1])
        }
      },
      {
        rootMargin: OBSERVER_MARGIN,
        threshold: 0,
      },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [ids])

  return activeId
}
