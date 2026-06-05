import { Button, Typography } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import './NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  useDocumentTitle("404 - Liubai's Blog")
  return (
    <div className="not-found-page">
      <div style={{ textAlign: 'center' }}>
        <span className="not-found-emoji" role="img" aria-label="搜索">🔍</span>
        <Typography.Title className="not-found-title">404</Typography.Title>
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
