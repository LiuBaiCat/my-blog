import { useEffect } from 'react'
import { Layout, FloatButton } from 'antd'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { Outlet, useLocation } from 'react-router-dom'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'
import FloatingStars from '../FloatingStars'
import './AppLayout.css'

const { Content } = Layout

function AppLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <Layout className="app-layout">
      <FloatingStars />
      <AppHeader />
      <Content className="app-content">
        <div className="app-content-inner" id="main-content">
          <Outlet />
        </div>
      </Content>
      <AppFooter />
      <FloatButton.BackTop
        icon={<VerticalAlignTopOutlined />}
        tooltip="返回顶部"
        className="back-top-btn"
      />
    </Layout>
  )
}

export default AppLayout
