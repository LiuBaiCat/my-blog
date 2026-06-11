import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import App from './App.tsx'
import './global.css'

// 窗口失焦时暂停全部 CSS 动画，减少 GPU 合成层竞争
window.addEventListener('blur', () => document.documentElement.classList.add('window-blurred'))
window.addEventListener('focus', () => document.documentElement.classList.remove('window-blurred'))
document.addEventListener('visibilitychange', () => {
  if (document.hidden) document.documentElement.classList.add('window-blurred')
  else document.documentElement.classList.remove('window-blurred')
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
)
