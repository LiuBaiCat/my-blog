import { useMemo } from 'react'
import { Typography, Divider, Timeline, Tag } from 'antd'
import { CalendarOutlined, PushpinOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getAllPosts } from '../utils/posts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate, getYear } from '../utils/formatDate'
import './Archive.css'

function Archive() {
  const posts = getAllPosts()
  const navigate = useNavigate()

  useDocumentTitle("归档 - Liubai's Blog")

  const groupedByYear = useMemo(() =>
    posts.reduce<Record<string, typeof posts>>((acc, post) => {
      const year = getYear(post.date)
      if (!acc[year]) acc[year] = []
      acc[year].push(post)
      return acc
    }, {}),
    [posts]
  )

  const years = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="archive-page">
      <div className="archive-header">
        <Typography.Title level={2} className="home-title">文章归档</Typography.Title>
        <Typography.Text className="archive-subtitle" type="secondary">
          共 {posts.length} 篇
        </Typography.Text>
      </div>
      <Divider style={{ marginTop: 0 }} />
      {years.map(year => (
        <div key={year} className="archive-year-section">
          <Typography.Title level={3} className="archive-year-title">
            {year}
          </Typography.Title>
          <Timeline
            items={groupedByYear[year].map(post => ({
              icon: post.pinned ? <PushpinOutlined className="archive-pin-icon" /> : <CalendarOutlined />,
              color: post.pinned ? 'gold' : undefined,
              content: (
                <div
                  className={`archive-timeline-item${post.pinned ? ' pinned' : ''}`}
                  onClick={() => navigate(`/article/${post.slug}`)}
                >
                  <span className="archive-timeline-date">
                    {post.pinned && <PushpinOutlined className="archive-pin-icon-inline" />}
                    {formatDate(post.date)}
                  </span>
                  <span className="archive-timeline-title">{post.title}</span>
                  {post.pinned && <Tag className="archive-pinned-tag">置顶</Tag>}
                  <span className="archive-timeline-tags">
                    {post.tags.map(tag => (
                      <Tag key={tag} className="archive-tag">{tag}</Tag>
                    ))}
                  </span>
                </div>
              ),
            }))}
          />
        </div>
      ))}
    </div>
  )
}

export default Archive
