import { Typography, Divider, Button, Tag } from 'antd'
import { FireOutlined, GithubOutlined, TagsOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getAllPosts, getAllTags } from '../utils/posts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../utils/formatDate'
import { getTagColor } from '../utils/tagColors'
import ArticleCard from '../components/ArticleCard'
import StarIcon from '../components/Icons/StarIcon'
import CuteStarIcon from '../components/Icons/CuteStarIcon'
import MoonIcon from '../components/Icons/MoonIcon'
import CloverIcon from '../components/Icons/CloverIcon'
import RocketIcon from '../components/Icons/RocketIcon'
import './Home.css'

function Home() {
  const posts = getAllPosts()
  const tags = getAllTags()
  const navigate = useNavigate()
  const pinnedPosts = posts.filter(p => p.pinned)
  const regularPosts = posts.filter(p => !p.pinned)

  useDocumentTitle("Liubai's Blog")

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-hero-content">
          <Typography.Title level={1} className="home-hero-title">
            欢迎来到 Liubai's Blog
          </Typography.Title>
          <Typography.Paragraph className="home-hero-desc">
            记录技术学习笔记、项目经验和生活感悟。持续学习中...
          </Typography.Paragraph>
          <div className="home-hero-actions">
            <Button type="primary" icon={<FireOutlined />} onClick={() => navigate('/archive')}>
              浏览归档
            </Button>
            <Button icon={<GithubOutlined />} href="https://github.com/liubaicat" target="_blank">
              GitHub
            </Button>
            <Button icon={<GithubOutlined style={{ color: 'var(--color-red)' }} />} href="https://gitee.com/liubai-cat" target="_blank">
              Gitee
            </Button>
          </div>
        </div>
        <div className="home-hero-decoration">
          <div className="home-hero-shape home-hero-shape-1" />
          <div className="home-hero-shape home-hero-shape-2" />
          <StarIcon size={20} className="home-hero-star home-hero-star-1" />
          <StarIcon size={14} className="home-hero-star home-hero-star-2" />
          <MoonIcon size={28} className="home-hero-moon" />
          <CloverIcon size={16} className="home-hero-clover" />
          <RocketIcon size={22} className="home-hero-rocket" />
        </div>
      </div>

      <div className="home-stats">
        <div className="home-stat-item">
          <EditOutlined /> <span className="home-stat-num">{posts.length}</span> 篇文章
        </div>
        <div className="home-stat-dot" />
        <div className="home-stat-item">
          <TagsOutlined /> <span className="home-stat-num">{tags.length}</span> 个标签
        </div>
      </div>

      {pinnedPosts.length > 0 && (
        <>
          <div className="home-section-header">
            <StarIcon size={20} className="home-section-star" />
            <Typography.Title level={2} className="home-title">
              精选推荐
            </Typography.Title>
            <Typography.Text className="home-subtitle" type="secondary">
              {pinnedPosts.length} 篇
            </Typography.Text>
          </div>
          <Divider className="home-divider" />
          {pinnedPosts.map(post => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </>
      )}

      <div className="home-section-header" style={pinnedPosts.length > 0 ? { marginTop: 28 } : undefined}>
        <StarIcon size={20} className="home-section-star" />
        <Typography.Title level={2} className="home-title">
          最近更新
        </Typography.Title>
        <Typography.Text className="home-subtitle" type="secondary">
          {regularPosts.length} 篇
        </Typography.Text>
      </div>
      <Divider className="home-divider" />

      <div className="home-feed">
        {regularPosts.map((post, index) => (
          <article
            key={post.slug}
            className="home-feed-item"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => navigate(`/article/${post.slug}`)}
          >
            <CuteStarIcon size={12} className="home-feed-star" />
            <div className="home-feed-left">
              <span className="home-feed-date">{formatDate(post.date)}</span>
            </div>
            <div className="home-feed-right">
              <h3 className="home-feed-title">{post.title}</h3>
              <p className="home-feed-desc">{post.description}</p>
              <div className="home-feed-tags">
                {post.tags.map(tag => {
                  const { accent, bg } = getTagColor(tag)
                  return (
                    <Tag key={tag} className="home-feed-tag" style={{ color: accent, background: bg, borderColor: `${accent}33` }}>{tag}</Tag>
                  )
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Home
