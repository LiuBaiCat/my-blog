import { Card, Tag, Typography } from 'antd'
import { CalendarOutlined, EditOutlined, PushpinOutlined } from '@ant-design/icons'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PostMeta } from '../types/blog'
import { highlightText } from '../utils/highlight'
import { formatDate } from '../utils/formatDate'
import { getTagColor } from '../utils/tagColors'
import StarIcon from './Icons/StarIcon'
import './ArticleCard.css'

const { Paragraph } = Typography

interface ArticleCardProps extends PostMeta {
  highlight?: string
}

function ArticleCard({ title, date, tags, description, slug, highlight, pinned, updatetime }: ArticleCardProps) {
  const navigate = useNavigate()

  return (
    <Card
      className={`article-card${pinned ? ' pinned' : ''}`}
      hoverable
      onClick={() => navigate(`/article/${slug}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          navigate(`/article/${slug}`)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`阅读文章：${title}`}
    >
      {pinned && <StarIcon size={16} className="article-card-star" color="var(--color-warm-yellow)" />}
      <Card.Meta
        title={highlight ? highlightText(title, highlight) : title}
        description={
          <>
            <div className="article-card-date">
              {pinned && <PushpinOutlined className="article-card-pin-icon" />}
              <CalendarOutlined /> {formatDate(date)}
              {updatetime && updatetime !== date && (
                <span className="article-card-updatetime">
                  <EditOutlined /> 更新于 {formatDate(updatetime)}
                </span>
              )}
            </div>
            <Paragraph
              className="article-card-desc"
              type="secondary"
              ellipsis={{ rows: 2 }}
            >
              {highlight ? highlightText(description, highlight) : description}
            </Paragraph>
            <div className="article-card-tags">
              {tags.map(tag => {
                const { accent, bg } = getTagColor(tag)
                return (
                  <Tag key={tag} style={{ color: accent, background: bg, borderColor: `${accent}33` }}>
                    {highlight ? highlightText(tag, highlight) : tag}
                  </Tag>
                )
              })}
            </div>
          </>
        }
      />
    </Card>
  )
}

export default memo(ArticleCard)
