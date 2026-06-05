import { Button, Typography } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import StarIcon from '../components/Icons/StarIcon'
import MoonIcon from '../components/Icons/MoonIcon'
import RocketIcon from '../components/Icons/RocketIcon'
import './NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  useDocumentTitle("404 - Liubai's Blog")
  return (
    <div className="not-found-page">
      <div style={{ textAlign: 'center' }}>
        <div className="not-found-decoration">
          <StarIcon size={20} className="not-found-star not-found-star-1" />
          <StarIcon size={14} className="not-found-star not-found-star-2" />
          <MoonIcon size={32} className="not-found-moon" />
          <RocketIcon size={24} className="not-found-rocket" />
        </div>
        <span className="not-found-emoji" role="img" aria-label="搜索">🔍</span>
        <Typography.Title className="not-found-title">
          <span style={{ color: 'var(--color-primary)' }}>4</span>
          <span style={{ color: 'var(--color-warm-yellow)' }}>0</span>
          <span style={{ color: 'var(--color-primary)' }}>4</span>
        </Typography.Title>
        <p className="not-found-subtitle">咦？这个页面好像飘走了...</p>
        <Button
          type="primary"
          size="large"
          icon={<HomeOutlined />}
          onClick={() => navigate('/')}
        >
          送我回家
        </Button>
      </div>
    </div>
  )
}

export default NotFound
