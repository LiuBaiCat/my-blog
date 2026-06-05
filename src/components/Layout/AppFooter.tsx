import { memo } from 'react'
import { Layout } from 'antd'
import { GithubOutlined, HeartFilled } from '@ant-design/icons'
import './AppFooter.css'

const { Footer } = Layout
const CURRENT_YEAR = new Date().getFullYear()

function AppFooter() {
  return (
    <Footer className="app-footer">
      <div className="app-footer-inner">
        <a
          href="https://github.com/liubaicat"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          title="GitHub"
        >
          <GithubOutlined /> GitHub
        </a>
        <span className="footer-separator">|</span>
        <a
          href="https://gitee.com/liubai-cat"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
          title="Gitee"
        >
          <GithubOutlined className="footer-icon-gitee" /> Gitee
        </a>
        <span className="footer-separator">|</span>
        <span className="footer-copyright">
          Liubai's Blog &copy; {CURRENT_YEAR}
        </span>
        <span className="footer-separator">|</span>
        <span className="footer-powered">
          Powered with <HeartFilled className="footer-icon-heart" />
        </span>
      </div>
    </Footer>
  )
}

export default memo(AppFooter)
