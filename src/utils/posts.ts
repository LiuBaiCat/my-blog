import type { PostMeta } from '../types/blog'

interface RawMeta {
  title?: string
  date?: Date | string
  tags?: string[]
  description?: string
  pinned?: boolean
}

// Eager: only front-matter (small payload), extracted at build time via `?meta` query
const metaModules = import.meta.glob<RawMeta>('../content/*.md', {
  eager: true,
  query: '?meta',
  import: 'default',
})

// Lazy: full markdown content, loaded on demand
const contentModules = import.meta.glob<{ default: string }>('../content/*.md', {
  eager: false,
  query: '?raw',
})

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

function parseMeta(path: string, data: RawMeta): PostMeta {
  const rawDate = data.date
  const date = rawDate instanceof Date
    ? rawDate.toISOString().slice(0, 10)
    : (rawDate ? String(rawDate) : new Date().toISOString().slice(0, 10))
  const slug = slugFromPath(path)
  return {
    slug,
    title: data.title ?? slug,
    date,
    tags: data.tags ?? [],
    description: data.description ?? '',
    pinned: data.pinned === true,
  }
}

const ALL_POSTS_META: PostMeta[] = Object.entries(metaModules)
  .map(([path, data]) => parseMeta(path, data))
  .sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

export function getAllPosts(): PostMeta[] {
  return [...ALL_POSTS_META]
}

export function getPostBySlug(slug: string): PostMeta | undefined {
  return ALL_POSTS_META.find(p => p.slug === slug)
}

/** 从原始 markdown 中提取 body（剔除 front-matter），兼容 CRLF/LF */
function extractBody(raw: string): string {
  const s = raw.replace(/\r\n/g, '\n')
  if (s.startsWith('---\n')) {
    const endIndex = s.indexOf('\n---\n', 4)
    if (endIndex !== -1) return s.slice(endIndex + 5)
  }
  return s
}

export async function getPostContent(slug: string): Promise<string | null> {
  const path = Object.keys(contentModules).find(p => slugFromPath(p) === slug)
  if (!path) return null
  const mod = await contentModules[path]()
  return extractBody(mod.default)
}

export function searchPosts(keyword: string): PostMeta[] {
  const kw = keyword.toLowerCase().trim()
  if (!kw) return []
  return ALL_POSTS_META.filter(p =>
    p.title.toLowerCase().includes(kw) ||
    p.tags.some(t => t.toLowerCase().includes(kw)) ||
    p.description.toLowerCase().includes(kw)
  )
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  ALL_POSTS_META.forEach(p => p.tags.forEach(t => tags.add(t)))
  return [...tags]
}

export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const idx = ALL_POSTS_META.findIndex(p => p.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx < ALL_POSTS_META.length - 1 ? ALL_POSTS_META[idx + 1] : null,
    next: idx > 0 ? ALL_POSTS_META[idx - 1] : null,
  }
}
