import { Card, Tag, Typography } from 'antd'
import { CalendarOutlined, PushpinOutlined } from '@ant-design/icons'
import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PostMeta } from '../types/blog'
import { highlightText } from '../utils/highlight'
import { formatDate } from '../utils/formatDate'
import './ArticleCard.css'

const { Paragraph } = Typography

interface ArticleCardProps extends PostMeta {
  highlight?: string
}

function ArticleCard({ title, date, tags, description, slug, highlight, pinned }: ArticleCardProps) {
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
      <Card.Meta
        title={highlight ? highlightText(title, highlight) : title}
        description={
          <>
            <div className="article-card-date">
              {pinned && <PushpinOutlined className="article-card-pin-icon" />}
              <CalendarOutlined /> {formatDate(date)}
            </div>
            <Paragraph
              className="article-card-desc"
              type="secondary"
              ellipsis={{ rows: 2 }}
            >
              {highlight ? highlightText(description, highlight) : description}
            </Paragraph>
            <div className="article-card-tags">
              {tags.map(tag => (
                <Tag key={tag} color="blue">
                  {highlight ? highlightText(tag, highlight) : tag}
                </Tag>
              ))}
            </div>
          </>
        }
      />
    </Card>
  )
}

export default memo(ArticleCard)
