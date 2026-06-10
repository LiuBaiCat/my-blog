import { useEffect, useRef, useState, memo } from 'react'
import mermaid from 'mermaid'

let initialized = false

function initMermaid(theme: 'default' | 'dark') {
  mermaid.initialize({
    startOnLoad: false,
    theme,
    securityLevel: 'loose',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif',
  })
  initialized = true
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
  const codeRef = useRef(code)
  codeRef.current = code

  useEffect(() => {
    if (!initialized) {
      initMermaid(getTheme())
    }

    let cancelled = false
    setSvg(null)
    setError(false)

    mermaid.render(idRef.current, code).then(({ svg: result }) => {
      if (!cancelled) setSvg(result)
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
