/// <reference types="vite/client" />

export function assetPath(path: string) {
  // Vite replaces this direct expression with the deployment base at build time.
  const base = import.meta.env.BASE_URL
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${path.replace(/^\//, '')}`
}
