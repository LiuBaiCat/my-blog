import { useState, useEffect } from 'react'
import './ReadingProgressBar.css'

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          if (docHeight > 0) {
            setProgress(Math.min((scrollTop / docHeight) * 100, 100))
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="reading-progress-bar">
      <div className="reading-progress-bar-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}

export default ReadingProgressBar
