import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useState, useMemo, memo } from 'react'
import type { Components } from 'react-markdown'
import { extractTextChildren, generateUniqueId } from '../utils/slugify'
import DemoFrame from './DemoFrame'
import './MarkdownRenderer.css'

const HTML_EXT = /\.html?$/

// highlight.js 不直接支持的语言 → 标准语言名映射
const LANG_ALIASES: Record<string, string> = {
  vue: 'html',
  'c++': 'cpp',
  cmd: 'dos',
  JavaScript: 'javascript',
  jsx: 'javascript',
}

/** 在 rehype-highlight 运行前，将不标准的语言名映射为 highlight.js 可识别的名称 */
function normalizeCodeLang() {
  return (tree: { type: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] }) => {
    function walk(node: { type: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] }) {
      if (node.type === 'element' && node.tagName === 'code' && Array.isArray(node.properties?.className)) {
        node.properties!.className = (node.properties!.className as string[]).map((c: string) => {
          if (c.startsWith('language-')) {
            const alias = LANG_ALIASES[c.slice(9)]
            if (alias) return `language-${alias}`
          }
          return c
        })
      }
      if (node.children) {
        node.children.forEach((child) => walk(child as typeof node))
      }
    }
    walk(tree)
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 降级处理：某些环境可能不支持 Clipboard API
    }
  }

  return (
    <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
      {copied ? <CheckOutlined /> : <CopyOutlined />}
      {copied ? '已复制' : '复制'}
    </button>
  )
}

/** 在 rehype 树中修正所有以 / 开头的图片 src，补上 BASE_URL 前缀 */
function fixImageBase() {
  const base = import.meta.env.BASE_URL
  return (tree: unknown) => {
    function walk(node: Record<string, unknown>) {
      if (
        node.type === 'element'
        && typeof node.tagName === 'string'
        && ['img', 'image'].includes(node.tagName.toLowerCase())
        && node.properties
      ) {
        const props = node.properties as Record<string, unknown>
        const src = props.src
        if (typeof src === 'string' && src.startsWith('/')) {
          props.src = base.replace(/\/+$/, '') + src
        }
      }
      if (Array.isArray(node.children)) {
        node.children.forEach((child) => walk(child as Record<string, unknown>))
      }
    }
    walk(tree as Record<string, unknown>)
  }
}

function MarkdownRenderer({ content }: { content: string }) {
  const components: Components = useMemo(() => {
    const headingIds = new Set<string>()
    function createHeading(level: 1 | 2 | 3 | 4) {
      return ({ children }: { children?: React.ReactNode }) => {
        const text = extractTextChildren(children)
        const id = generateUniqueId(text, headingIds)
        const Tag = `h${level}` as const
        return <Tag id={id} className="toc-heading-anchor">{children}</Tag>
      }
    }

    return {
        p: ({ children }) => <div className="markdown-p">{children}</div>,
        h1: createHeading(1),
        h2: createHeading(2),
        h3: createHeading(3),
        h4: createHeading(4),
        a: ({ href, children }) => {
          // 仅对本地 .html 路径使用 DemoFrame（不含协议），外部 .html 链接正常打开
          if (href && !href.includes('://') && HTML_EXT.test(href)) {
            const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
            return <DemoFrame src={base + href} title={String(children)} />
          }
          if (href?.startsWith('/')) {
            return <Link to={href}>{children}</Link>
          }
          return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
        },
        img: ({ src, alt }) => (
          <img src={src} alt={alt ?? ''} loading="lazy" style={{ maxWidth: '100%' }} />
        ),
        table: ({ children }) => <div className="table-wrapper"><table>{children}</table></div>,
        pre: ({ children }) => <>{children}</>,
        code: ({ className, children, ...props }) => {
          const match = className?.match(/language-(\S+)/)
          if (match) {
            const language = match[1]
            return (
              <div className="code-block-wrapper">
                <div className="code-block-header">
                  <span className="code-lang">{language}</span>
                  <CopyButton text={extractTextChildren(children)} />
                </div>
                <pre>
                  <code className={className} {...props}>{children}</code>
                </pre>
              </div>
            )
          }
          const text = extractTextChildren(children)
          if (text.includes('\n')) {
            return (
              <div className="code-block-wrapper">
                <pre>
                  <code className={className} {...props}>{children}</code>
                </pre>
              </div>
            )
          }
          return <code className="inline-code" {...props}>{children}</code>
        },
    }
  }, [content])

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, fixImageBase, normalizeCodeLang, rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default memo(MarkdownRenderer)
