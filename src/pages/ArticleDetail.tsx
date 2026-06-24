import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Tag, Divider, Result, Button, Spin } from 'antd'
import { CalendarOutlined, EditOutlined, HomeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { getPostBySlug, getPostContent, getAdjacentPosts } from '../utils/posts'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { formatDate } from '../utils/formatDate'
import { getTagColor } from '../utils/tagColors'
import TableOfContents from '../components/TableOfContents'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import StarIcon from '../components/Icons/StarIcon'
import MoonIcon from '../components/Icons/MoonIcon'
import RocketIcon from '../components/Icons/RocketIcon'
import './ArticleDetail.css'

const { Title } = Typography

function ArticleDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState<string | null>(null)
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null)

  const post = slug ? getPostBySlug(slug) : undefined
  const loading = !!slug && loadedSlug !== slug

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    getPostContent(slug).then(raw => {
      if (cancelled) return
      setContent(raw)
      setLoadedSlug(slug)
    })
    return () => { cancelled = true }
  }, [slug])

  const [tocPosition, setTocPosition] = useState<'left' | 'right'>(() => {
    const saved = localStorage.getItem('toc-position')
    return saved === 'left' || saved === 'right' ? saved : 'right'
  })

  const handleTogglePosition = useCallback(() => {
    setTocPosition(prev => {
      const next = prev === 'left' ? 'right' : 'left'
      localStorage.setItem('toc-position', next)
      return next
    })
  }, [])

  useDocumentTitle(post ? `${post.title} - Liubai's Blog` : "Liubai's Blog")

  if (!post) {
    return (
      <Result
        status="404"
        title="文章不存在"
        subTitle="请检查链接是否正确"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        }
      />
    )
  }

  const { prev, next } = getAdjacentPosts(post.slug)

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <article className={`article-detail toc-${tocPosition}`}>
      <div className="article-detail-main">
        <div className="article-detail-hero">
          <div className="article-detail-hero-top">
            <div className="article-detail-decoration">
              <StarIcon size={14} className="article-detail-star" />
              <MoonIcon size={18} className="article-detail-moon" />
              <RocketIcon size={16} className="article-detail-rocket" />
            </div>
          </div>
          <Title className="article-detail-title">{post.title}</Title>
          <div className="article-detail-meta">
            <span className="article-detail-date">
              <CalendarOutlined /> {formatDate(post.date)}
            </span>
            {post.updatetime && post.updatetime !== post.date && (
              <span className="article-detail-updatetime">
                <EditOutlined /> 更新于 {formatDate(post.updatetime)}
              </span>
            )}
            {post.tags.map(tag => {
              const { accent, bg } = getTagColor(tag)
              return (
                <Tag key={tag} style={{ color: accent, background: bg, borderColor: `${accent}33` }}>{tag}</Tag>
              )
            })}
          </div>
        </div>
        <Divider />
        <MarkdownRenderer content={content ?? ''} />
        <div className="article-nav">
          <Divider />
          <div className="article-nav-links">
            {prev ? (
              <button className="article-nav-item article-nav-prev" onClick={() => navigate(`/article/${prev.slug}`)}
                aria-label={`上一篇：${prev.title}`}>
                <div className="article-nav-direction">
                  <LeftOutlined /> 上一篇
                </div>
                <div className="article-nav-title">{prev.title}</div>
              </button>
            ) : <div />}
            {next ? (
              <button className="article-nav-item article-nav-next" onClick={() => navigate(`/article/${next.slug}`)}
                aria-label={`下一篇：${next.title}`}>
                <div className="article-nav-direction">
                  下一篇 <RightOutlined />
                </div>
                <div className="article-nav-title">{next.title}</div>
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
      <TableOfContents
        content={content ?? ''}
        position={tocPosition}
        onTogglePosition={handleTogglePosition}
      />
      {createPortal(
        <button
          className="article-floating-home-btn"
          onClick={() => navigate('/')}
          title="返回首页"
          aria-label="返回首页"
        >
          <HomeOutlined />
        </button>,
        document.body
      )}
    </article>
  )
}

export default ArticleDetail
