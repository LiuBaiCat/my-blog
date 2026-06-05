import { useState, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Drawer } from 'antd'
import { SwapLeftOutlined, SwapRightOutlined, OrderedListOutlined } from '@ant-design/icons'
import { useScrollSpy } from '../hooks/useScrollSpy'
import './TableOfContents.css'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TocNode {
  item: TocItem
  children: TocNode[]
}

interface TableOfContentsProps {
  content: string
  position: 'left' | 'right'
  onTogglePosition: () => void
}

function scanDomHeadings(): TocItem[] {
  const anchors = document.querySelectorAll<HTMLElement>('.toc-heading-anchor')
  const items: TocItem[] = []
  anchors.forEach(el => {
    if (el.id) {
      const headingEl = el.tagName.match(/^H[1-6]$/) ? el : el.querySelector('h1, h2, h3, h4, h5, h6')
      if (headingEl) {
        items.push({
          id: el.id,
          text: (headingEl.textContent || '').trim(),
          level: parseInt(headingEl.tagName[1]),
        })
      }
    }
  })
  return items
}

function buildTree(items: TocItem[]): TocNode[] {
  const root: TocNode[] = []
  const stack: TocNode[] = []

  for (const item of items) {
    const node: TocNode = { item, children: [] }
    while (stack.length > 0 && stack[stack.length - 1].item.level >= item.level) {
      stack.pop()
    }
    if (stack.length === 0) {
      root.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }
    stack.push(node)
  }

  return root
}

function renderTree(nodes: TocNode[], activeId: string, onItemClick?: () => void) {
  return (
    <ul className="toc-list">
      {nodes.map(node => (
        <li key={node.item.id} className={`toc-item${activeId === node.item.id ? ' active' : ''}`}>
          <a
            href={`#${node.item.id}`}
            className={`toc-link level-${node.item.level}${activeId === node.item.id ? ' active' : ''}`}
            onClick={e => {
              e.preventDefault()
              const el = document.getElementById(node.item.id)
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({ top, behavior: 'smooth' })
              }
              onItemClick?.()
            }}
          >
            {node.item.text}
          </a>
          {node.children.length > 0 && (
            <div className="toc-children">
              {renderTree(node.children, activeId, onItemClick)}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

function TableOfContents({ content, position, onTogglePosition }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerNavRef = useRef<HTMLElement>(null)
  const ids = useMemo(() => headings.map(h => h.id), [headings])
  const activeId = useScrollSpy(ids) ?? ''

  useEffect(() => {
    const timer = setTimeout(() => {
      const items = scanDomHeadings()
      if (items.length > 0) {
        setHeadings(items)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [content])

  // Scroll active item into view (also when mobile drawer opens)
  useEffect(() => {
    if (!activeId) return
    const timer = setTimeout(() => {
      const container = drawerOpen ? drawerNavRef.current : document.querySelector('.toc-sidebar')
      const link = container?.querySelector<HTMLElement>(`.toc-link.active`)
      link?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, drawerOpen ? 300 : 0)
    return () => clearTimeout(timer)
  }, [activeId, drawerOpen])

  if (headings.length === 0) return null

  const tree = buildTree(headings)

  return (
    <>
      <aside className="toc-sidebar">
        <div className="toc-header">
          <span className="toc-title">目录</span>
          <button
            className="toc-toggle-btn"
            onClick={onTogglePosition}
            title={position === 'right' ? '移至左侧' : '移至右侧'}
          >
            {position === 'right' ? <SwapLeftOutlined /> : <SwapRightOutlined />}
          </button>
        </div>
        <nav className="toc-nav">
          {renderTree(tree, activeId)}
        </nav>
      </aside>
      {createPortal(
        <button
          className="toc-mobile-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="打开目录"
        >
          <OrderedListOutlined />
        </button>,
        document.body
      )}
      <Drawer
        title="目录"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ wrapper: { width: 360 }, body: { padding: 0 } }}
      >
        <nav className="toc-nav" ref={drawerNavRef}>
          {renderTree(tree, activeId, () => setDrawerOpen(false))}
        </nav>
      </Drawer>
    </>
  )
}

export default TableOfContents
