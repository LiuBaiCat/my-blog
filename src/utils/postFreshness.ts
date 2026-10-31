import type { PostMeta } from '../types/blog'

export const NEW_LIMIT = 3
export const NEW_WINDOW_DAYS = 30

const DAY_MS = 86_400_000

/** date 与 updatetime 取较晚者（YYYY-MM-DD 字典序即时间序） */
export function latestActivity(post: PostMeta): string {
  return post.updatetime && post.updatetime > post.date ? post.updatetime : post.date
}

/** 距今天数，未来日期或非法日期返回 null */
function daysAgo(dateStr: string): number | null {
  // Vite 的 ?meta 会把日期转换为完整 ISO 字符串，这里只取日期部分并按本地零点解析
  const dateOnly = dateStr.slice(0, 10)
  const time = new Date(`${dateOnly}T00:00:00`).getTime()
  if (!Number.isFinite(time)) return null
  const diff = Date.now() - time
  return diff < 0 ? null : diff / DAY_MS
}

/** 需要标记 NEW 的 slug 集合 */
export function getNewSlugs(posts: PostMeta[]): Set<string> {
  const ranked = posts
    .map(post => {
      const at = latestActivity(post)
      return { slug: post.slug, at, ago: daysAgo(at) }
    })
    .filter(item => item.ago !== null)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, NEW_LIMIT)

  return new Set(
    ranked.filter(item => item.ago! <= NEW_WINDOW_DAYS).map(item => item.slug)
  )
}
