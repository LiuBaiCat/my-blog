const cache = new Map<string, { date: string; year: string }>()

function parseDate(dateStr: string): { date: string; year: string } {
  const cached = cache.get(dateStr)
  if (cached) return cached
  const d = new Date(dateStr)
  const result = {
    date: d.toLocaleDateString(),
    year: d.getFullYear().toString(),
  }
  cache.set(dateStr, result)
  return result
}

export function formatDate(dateStr: string): string {
  return parseDate(dateStr).date
}

export function getYear(dateStr: string): string {
  return parseDate(dateStr).year
}
