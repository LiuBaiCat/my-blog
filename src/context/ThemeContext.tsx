import { createContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react'
import { ConfigProvider, theme } from 'antd'
import type { ThemeConfig } from 'antd'

type ThemeMode = 'light' | 'dark'

export interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)
export { ThemeContext }

const LIGHT_TOKEN = {
  colorPrimary: '#1677ff',
  borderRadius: 8,
  colorBgContainer: '#ffffff',
  colorText: '#1a1a2e',
  colorTextSecondary: '#6b7280',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans SC', Roboto, 'Helvetica Neue', sans-serif",
  colorBorder: '#e5e7eb',
  colorBgElevated: '#ffffff',
  colorLink: '#1677ff',
  colorLinkHover: '#4096ff',
  paddingLG: 24,
  marginLG: 24,
} as const

const LIGHT_COMPONENT = {
  Layout: {
    headerBg: '#ffffff',
    bodyBg: '#faf9f8',
    footerBg: '#ffffff',
  },
  Card: {
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04), 0 1px 2px -1px rgba(0,0,0,0.06)',
  },
  Tag: {
    borderRadius: 4,
  },
  Menu: {
    itemHoverBg: '#f0f5ff',
    horizontalItemSelectedColor: '#1677ff',
  },
} as const

const DARK_TOKEN = {
  colorPrimary: '#4096ff',
  borderRadius: 8,
  colorBgContainer: '#1a1a2e',
  colorText: '#e4e4ed',
  colorTextSecondary: '#9ca3af',
  fontFamily: LIGHT_TOKEN.fontFamily,
  colorBorder: '#2d2d44',
  colorBgElevated: '#1e1e36',
  colorLink: '#4096ff',
  colorLinkHover: '#1677ff',
  paddingLG: 24,
  marginLG: 24,
} as const

const DARK_COMPONENT = {
  Layout: {
    headerBg: '#16162a',
    bodyBg: '#0f0f1a',
    footerBg: '#16162a',
  },
  Card: {
    boxShadow: '0 1px 3px 0 rgba(0,0,0,0.3)',
  },
  Tag: {
    borderRadius: 4,
  },
  Menu: {
    itemHoverBg: '#0d2137',
    horizontalItemSelectedColor: '#4096ff',
  },
} as const

const HLJS_LINK_ID = 'hljs-theme-link'

function setHljsTheme(mode: ThemeMode): void {
  let link = document.getElementById(HLJS_LINK_ID) as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.id = HLJS_LINK_ID
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  link.href = mode === 'dark'
    ? `${base}/highlight-github-dark.min.css`
    : `${base}/highlight-github.min.css`
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('blog-theme')
    return saved === 'dark' ? 'dark' : 'light'
  })

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add('theme-transitioning')
    setMode(prev => prev === 'light' ? 'dark' : 'light')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transitioning')
      })
    })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem('blog-theme', mode)
    setHljsTheme(mode)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0f0f1a' : '#faf9f8')
  }, [mode])

  const antTheme: ThemeConfig = useMemo(() => ({
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: mode === 'dark' ? DARK_TOKEN : LIGHT_TOKEN,
    components: mode === 'dark' ? DARK_COMPONENT : LIGHT_COMPONENT,
  }), [mode])

  return (
    <ThemeContext.Provider value={{ theme: mode, toggleTheme }}>
      <ConfigProvider theme={antTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export { ThemeProvider }
