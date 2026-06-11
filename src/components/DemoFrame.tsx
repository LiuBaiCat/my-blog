import { Card, Button } from 'antd'
import { FullscreenOutlined } from '@ant-design/icons'
import './DemoFrame.css'

interface DemoFrameProps {
  src: string
  title?: string
}

function openInNewTab(src: string) {
  const fullUrl = window.location.origin + src
  window.open(fullUrl, '_blank', 'noopener,noreferrer')
}

const iframeStyles = `
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
`

function injectScrollbarStyle(iframe: HTMLIFrameElement) {
  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (doc) {
      const style = document.createElement('style')
      style.textContent = iframeStyles
      doc.head.appendChild(style)
    }
  } catch {
    // 跨域 iframe 忽略，无法控制其样式
  }
}

function DemoFrame({ src, title }: DemoFrameProps) {
  return (
    <Card
      className="demo-frame-container"
      title={title || '在线示例'}
      size="small"
      extra={
        <Button
          type="link"
          size="small"
          icon={<FullscreenOutlined />}
          onClick={() => openInNewTab(src)}
        >
          新窗口打开
        </Button>
      }
    >
      <div className="demo-frame-iframe">
        <iframe
          src={src}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          title={title || 'demo'}
          onLoad={(e) => injectScrollbarStyle(e.currentTarget)}
        />
      </div>
    </Card>
  )
}

export default DemoFrame
