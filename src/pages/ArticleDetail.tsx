import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Typography, Tag, Divider, Result, Button, Spin } from 'antd'
import { CalendarOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { getPostBySlug, getPostContent, getAdjacentPosts } from '../utils/posts'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { formatDate } from '../utils/formatDate'
import TableOfContents from '../components/TableOfContents'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
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
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate('/')}
            className="article-detail-back-btn"
          >
            返回首页
          </Button>
          <Title className="article-detail-title">{post.title}</Title>
          <div className="article-detail-meta">
            <span className="article-detail-date">
              <CalendarOutlined /> {formatDate(post.date)}
            </span>
            {post.tags.map(tag => (
              <Tag key={tag} color="blue">{tag}</Tag>
            ))}
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
    </article>
  )
}

export default ArticleDetail
