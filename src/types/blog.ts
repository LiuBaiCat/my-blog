export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  description: string
  pinned?: boolean
}

export interface Post extends PostMeta {
  content: string
}
