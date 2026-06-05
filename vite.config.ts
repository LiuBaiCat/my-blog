import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import frontMatter from 'front-matter'

/**
 * Vite plugin that handles `?meta` query for .md files.
 * Returns only the front-matter attributes as a JSON default export,
 * avoiding inclusion of the full markdown content in the bundle.
 */
function markdownMetaPlugin() {
  return {
    name: 'markdown-meta',
    transform(code: string, id: string) {
      const queryIndex = id.indexOf('?')
      if (queryIndex === -1) return
      const path = id.slice(0, queryIndex)
      if (!path.endsWith('.md')) return
      // dev 模式下 query 可能是 ?import&meta
      const params = new URLSearchParams(id.slice(queryIndex + 1))
      if (!params.has('meta')) return

      const { attributes } = frontMatter(code)
      return {
        code: `export default ${JSON.stringify(attributes)}`,
        map: null,
      }
    },
  }
}

export default defineConfig({
  base: '/my-blog/',
  plugins: [react(), markdownMetaPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) return 'vendor-react'
          if (id.includes('node_modules/antd') || id.includes('node_modules/@ant-design')) return 'vendor-antd'
          if (id.includes('node_modules/react-markdown') || id.includes('remark-gfm') || id.includes('rehype-highlight') || id.includes('rehype-raw')) return 'vendor-markdown'
        },
      },
    },
  },
})
