import type { ReactNode } from 'react'

const markStyle: React.CSSProperties = {
  backgroundColor: 'var(--search-highlight-bg)',
  padding: '0 2px',
  borderRadius: 2,
}

export function highlightText(text: string, keyword: string): ReactNode {
  if (!keyword) return text
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const kwLower = keyword.toLowerCase()
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === kwLower
      ? <mark key={i} style={markStyle}>{part}</mark>
      : part,
  )
}
