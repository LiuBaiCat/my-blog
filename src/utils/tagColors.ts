export const TAG_PALETTE = [
  { accent: '#1677ff', bg: '#e6f4ff' },
  { accent: '#d97706', bg: '#fef3c7' },
  { accent: '#16a34a', bg: '#f0fdf4' },
  { accent: '#9333ea', bg: '#faf5ff' },
  { accent: '#ea580c', bg: '#fff7ed' },
  { accent: '#0891b2', bg: '#ecfeff' },
  { accent: '#e11d48', bg: '#fff1f2' },
  { accent: '#4f46e5', bg: '#eef2ff' },
]

export function getTagColor(tag: string) {
  const hash = tag.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return TAG_PALETTE[hash % TAG_PALETTE.length]
}
