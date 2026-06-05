import { Typography, Divider, Button } from 'antd'
import { FireOutlined, GithubOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getAllPosts } from '../utils/posts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import ArticleCard from '../components/ArticleCard'
import './Home.css'

function Home() {
  const posts = getAllPosts()
  const navigate = useNavigate()

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
        </div>
      </div>

      <div className="home-header">
        <Typography.Title level={2} className="home-title">最新文章</Typography.Title>
        <Typography.Text className="home-subtitle" type="secondary">
          共 {posts.length} 篇
        </Typography.Text>
      </div>
      <Divider />
      {posts.map(post => (
        <ArticleCard key={post.slug} {...post} />
      ))}
    </div>
  )
}

export default Home
