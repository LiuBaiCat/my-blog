import { Typography, Input, Tag, Card } from 'antd'
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { searchPosts } from '../utils/posts'
import { highlightText } from '../utils/highlight'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import StarIcon from '../components/Icons/StarIcon'
import MoonIcon from '../components/Icons/MoonIcon'
import RocketIcon from '../components/Icons/RocketIcon'
import './Search.css'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const q = searchParams.get('q') ?? ''
  const posts = useMemo(() => searchPosts(q), [q])

  useDocumentTitle(q ? `搜索: ${q} - Liubai's Blog` : "搜索 - Liubai's Blog")

  const handleSearch = (value: string) => {
    const trimmed = value.trim()
    setSearchParams(trimmed ? { q: trimmed } : {})
  }

  return (
    <div className="search-page">
      <div className="search-decoration">
        <StarIcon size={18} className="search-star search-star-1" />
        <StarIcon size={12} className="search-star search-star-2" />
        <MoonIcon size={24} className="search-moon" />
        <RocketIcon size={20} className="search-rocket" />
      </div>
      <Input.Search
        className="search-input"
        placeholder="搜索文章..."
        onSearch={handleSearch}
        defaultValue={q}
        enterButton
        allowClear
        size="large"
      />

      {q ? (
        <div style={{ marginBottom: 20 }}>
          <div className="search-results-header">
            <Typography.Title level={4} style={{ margin: 0 }}>搜索结果</Typography.Title>
            <Tag
              closable
              onClose={() => setSearchParams({})}
              style={{ fontSize: 13, padding: '0 8px', lineHeight: '24px' }}
            >
              {q}
            </Tag>
          </div>
          {posts.length > 0 && (
            <Typography.Paragraph type="secondary" className="search-results-count">
              共找到 {posts.length} 篇相关文章
            </Typography.Paragraph>
          )}
        </div>
      ) : (
        <Typography.Title level={4} style={{ marginBottom: 20 }}>搜索</Typography.Title>
      )}

      {posts.length > 0 ? (
        posts.map(post => (
          <Card
            key={post.slug}
            hoverable
            size="small"
            className="search-result-card"
            onClick={() => navigate(`/article/${post.slug}`)}
          >
            <div className="search-result-title">
              {highlightText(post.title, q)}
            </div>
            <div className="search-result-date">
              <CalendarOutlined /> {post.date}
            </div>
            <Typography.Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              className="search-result-desc"
            >
              {highlightText(post.description, q)}
            </Typography.Paragraph>
            <div className="search-result-tags">
              {post.tags.map(tag => (
                <Tag key={tag} color="blue">
                  {highlightText(tag, q)}
                </Tag>
              ))}
            </div>
          </Card>
        ))
      ) : (
        <div className="search-empty">
          <div className="search-empty-icon">
            <SearchOutlined />
          </div>
          <div className="search-empty-text">
            {q ? `未找到与"${q}"相关的文章` : '请输入关键词搜索'}
          </div>
          {!q && (
            <div className="search-empty-hint">
              试试搜索你感兴趣的技术话题
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
