export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  pinned?: boolean
  updatetime?: string
}

export interface Post extends PostMeta {
  content: string
}
