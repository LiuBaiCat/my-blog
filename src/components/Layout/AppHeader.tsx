import { useState, memo } from 'react'
import { Layout, Menu, Input, Button, Drawer, Modal } from 'antd'
import { HomeOutlined, ClockCircleOutlined, UserOutlined, SunOutlined, MoonOutlined, SearchOutlined, MenuOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import ReadingProgressBar from '../ReadingProgressBar'
import './AppHeader.css'

const { Header } = Layout

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/archive', icon: <ClockCircleOutlined />, label: '归档' },
  { key: '/about', icon: <UserOutlined />, label: '关于' },
]

function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const selectedKey = '/' + location.pathname.split('/')[1]

  const isArticlePage = location.pathname.startsWith('/article/')
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearch = (value: string) => {
    const trimmed = value.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const handleNavClick = (key: string) => {
    navigate(key)
    setDrawerOpen(false)
  }

  const handleMobileSearch = (value: string) => {
    const trimmed = value.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
    setSearchOpen(false)
  }

  const brand = (
    <div
      className="app-header-brand"
      onClick={() => navigate('/')}
    >
      Liubai's Blog
    </div>
  )

  const themeButton = (
    <Button
      type="text"
      className="theme-toggle-btn"
      icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
    />
  )

  if (!isMobile) {
    return (
      <Header className="app-header">
        {brand}
        <Menu
          className="app-header-menu"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
        <div className="app-header-right">
          <Input.Search
            className="app-header-search"
            placeholder="搜索文章..."
            onSearch={handleSearch}
            enterButton
            allowClear
            aria-label="搜索文章"
          />
          {themeButton}
        </div>
        {isArticlePage && <ReadingProgressBar />}
      </Header>
    )
  }

  return (
    <Header className="app-header">
      {brand}
      <div className="app-header-mobile-actions">
        <Button
          type="text"
          className="app-header-mobile-search-btn"
          icon={<SearchOutlined />}
          onClick={() => setSearchOpen(true)}
          aria-label="搜索文章"
        />
        {themeButton}
        <Button
          type="text"
          className="app-header-hamburger"
          icon={<MenuOutlined />}
          onClick={() => setDrawerOpen(true)}
          aria-label="打开导航菜单"
        />
      </div>
      <Drawer
        title="导航"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => handleNavClick(key)}
        />
      </Drawer>
      <Modal
        title="搜索文章"
        open={searchOpen}
        onCancel={() => setSearchOpen(false)}
        footer={null}
        destroyOnHidden
        width={360}
        centered
      >
        <Input.Search
          placeholder="搜索文章..."
          onSearch={handleMobileSearch}
          autoFocus
          allowClear
          enterButton
          aria-label="搜索文章"
        />
      </Modal>
      {isArticlePage && <ReadingProgressBar />}
    </Header>
  )
}

export default memo(AppHeader)
