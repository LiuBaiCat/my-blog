import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Spin } from 'antd'
import AppLayout from './components/Layout/AppLayout'

const Home = lazy(() => import('./pages/Home'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Archive = lazy(() => import('./pages/Archive'))
const About = lazy(() => import('./pages/About'))
const Search = lazy(() => import('./pages/Search'))
const NotFound = lazy(() => import('./pages/NotFound'))

const PageLoading = () => (
  <div style={{ textAlign: 'center', padding: '80px 0' }}>
    <Spin size="large" />
  </div>
)

function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="article/:slug" element={<ArticleDetail />} />
          <Route path="archive" element={<Archive />} />
          <Route path="search" element={<Search />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
