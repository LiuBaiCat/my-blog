import { Typography, Divider, Button, Tag, Pagination } from 'antd'
import { FireOutlined, GithubOutlined, TagsOutlined, EditOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getAllPosts, getAllTags } from '../utils/posts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../utils/formatDate'
import { getTagColor } from '../utils/tagColors'
import FeaturedCarousel from '../components/FeaturedCarousel'
import StarIcon from '../components/Icons/StarIcon'
import CuteStarIcon from '../components/Icons/CuteStarIcon'
import MoonIcon from '../components/Icons/MoonIcon'
import CloverIcon from '../components/Icons/CloverIcon'
import RocketIcon from '../components/Icons/RocketIcon'
import './Home.css'

const PAGE_SIZE = 8

function Home() {
  const posts = getAllPosts()
  const tags = getAllTags()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const pinnedPosts = posts.filter(p => p.pinned)
  const regularPosts = posts.filter(p => !p.pinned)

  const currentPage = (() => {
    const raw = Number(searchParams.get('page'))
    return Number.isFinite(raw) && raw >= 1 ? Math.floor(raw) : 1
  })()
  const totalPages = Math.ceil(regularPosts.length / PAGE_SIZE)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const pagePosts = regularPosts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

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
          <FeaturedCarousel posts={pinnedPosts} />
        </>
      )}

      <div className="home-section-header" id="home-recent-section" style={pinnedPosts.length > 0 ? { marginTop: 28 } : undefined}>
        <StarIcon size={20} className="home-section-star" />
        <Typography.Title level={2} className="home-title">
          最近更新
        </Typography.Title>
        <Typography.Text className="home-subtitle" type="secondary">
          {regularPosts.length} 篇
        </Typography.Text>
      </div>
      <Divider className="home-divider" />

      {pagePosts.length > 0 ? (
        <>
          <div className="home-feed">
            {pagePosts.map((post, index) => (
              <article
                key={post.slug}
                className="home-feed-item"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/article/${post.slug}`)}
              >
                <CuteStarIcon size={12} className="home-feed-star" />
                <div className="home-feed-left">
                  <span className="home-feed-date">{formatDate(post.date)}</span>
                  {post.updatetime && post.updatetime !== post.date && (
                    <span className="home-feed-updatetime">
                      <EditOutlined /> {formatDate(post.updatetime)}
                    </span>
                  )}
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
          {regularPosts.length > PAGE_SIZE && (
            <div className="home-pagination">
              <Pagination
                current={safePage}
                total={regularPosts.length}
                pageSize={PAGE_SIZE}
                onChange={(page) => {
                  setSearchParams(page > 1 ? { page: String(page) } : {})
                  document.getElementById('home-recent-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                showSizeChanger={false}
                showTotal={(total, range) => `第 ${range[0]}-${range[1]} 篇 / 共 ${total} 篇`}
              />
            </div>
          )}
        </>
      ) : (
        <div className="home-feed-empty">暂无更多文章</div>
      )}
    </div>
  )
}

export default Home
