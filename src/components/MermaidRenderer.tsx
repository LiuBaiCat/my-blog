import { useEffect, useRef, useState, memo } from 'react'
import type { Mermaid } from 'mermaid'

let mermaidPromise: Promise<Mermaid> | null = null
function loadMermaid(): Promise<Mermaid> {
  if (!mermaidPromise) mermaidPromise = import('mermaid').then(m => m.default || m)
  return mermaidPromise
}

function getTheme(): 'default' | 'dark' {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default'
  }
  return 'default'
}

interface MermaidRendererProps {
  code: string
}

const MermaidRenderer = memo(function MermaidRenderer({ code }: MermaidRendererProps) {
  const [svg, setSvg] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`)
  const initializedRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    setSvg(null)
    setError(false)

    loadMermaid().then(mermaid => {
      if (cancelled) return

      if (!initializedRef.current) {
        mermaid.initialize({
          startOnLoad: false,
          theme: getTheme(),
          securityLevel: 'loose',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif',
        })
        initializedRef.current = true
      }

      return mermaid.render(idRef.current, code).then(({ svg: result }) => {
        if (!cancelled) setSvg(result)
      })
    }).catch(() => {
      if (!cancelled) setError(true)
    })

    return () => { cancelled = true }
  }, [code])

  if (error) {
    return <pre className="mermaid-fallback"><code>{code}</code></pre>
  }

  if (!svg) {
    return <div className="mermaid-loading">加载图表中...</div>
  }

  return (
    <div
      className="mermaid-wrapper"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
})

export default MermaidRenderer
