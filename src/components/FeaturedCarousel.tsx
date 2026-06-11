import { useRef, useState, useEffect, useCallback, memo } from 'react'
import type { PostMeta } from '../types/blog'
import ArticleCard from './ArticleCard'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import './FeaturedCarousel.css'

interface Props {
  posts: PostMeta[]
}

const FeaturedCarousel = memo(function FeaturedCarousel({ posts }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [cardsPerPage, setCardsPerPage] = useState(2)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
      setCardsPerPage(w >= 640 ? 2 : 1)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const totalPages = Math.ceil(posts.length / cardsPerPage)

  const handleScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const p = Math.round(el.scrollLeft / el.clientWidth)
    setPage(Math.min(p, totalPages - 1))
  }, [totalPages])

  const scrollTo = useCallback((p: number) => {
    trackRef.current?.scrollTo({
      left: p * trackRef.current.clientWidth,
      behavior: 'smooth',
    })
  }, [])

  if (posts.length === 0) return null

  const showNav = posts.length >= 2

  return (
    <div className={`featured-carousel${showNav ? '' : ' simple-mode'}`}>
      {showNav && <div className="featured-carousel-edge left" aria-hidden />}
      {showNav && <div className="featured-carousel-edge right" aria-hidden />}

      <div
        className="featured-carousel-track"
        ref={trackRef}
        onScroll={showNav ? handleScroll : undefined}
      >
        {posts.map(post => (
          <div key={post.slug} className="featured-carousel-item">
            <ArticleCard {...post} />
          </div>
        ))}
      </div>

      {showNav && page > 0 && (
        <button className="featured-carousel-arrow prev" onClick={() => scrollTo(page - 1)} aria-label="上一页">
          <LeftOutlined />
        </button>
      )}
      {showNav && page < totalPages - 1 && (
        <button className="featured-carousel-arrow next" onClick={() => scrollTo(page + 1)} aria-label="下一页">
          <RightOutlined />
        </button>
      )}

      {showNav && totalPages > 1 && (
        <div className="featured-carousel-dots" role="tablist" aria-label="精选推荐分页">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              role="tab"
              className={`featured-carousel-dot${i === page ? ' active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`第 ${i + 1} 页`}
            />
          ))}
        </div>
      )}
    </div>
  )
})

export default FeaturedCarousel
