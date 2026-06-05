import { isValidElement, type ReactNode } from 'react'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractTextChildren(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }
  if (Array.isArray(children)) {
    return children.map(extractTextChildren).join('')
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return extractTextChildren(children.props.children)
  }
  return ''
}

export function generateUniqueId(text: string, usedIds: Set<string>): string {
  let id = slugify(text)
  if (!id) id = 'heading'
  let counter = 1
  let uniqueId = id
  while (usedIds.has(uniqueId)) {
    uniqueId = `${id}-${counter}`
    counter++
  }
  usedIds.add(uniqueId)
  return uniqueId
}
