export function assetPath(path: string) {
  const meta = import.meta as ImportMeta & { env?: { BASE_URL?: string } }
  const base = meta.env?.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${path.replace(/^\//, '')}`
}
