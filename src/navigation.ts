export type SitePage = 'about' | 'projects' | 'portfolio' | 'festival'

const sectionByPage: Record<SitePage, string> = {
  about: 'about',
  projects: 'experience',
  portfolio: 'portfolio',
  festival: 'festival-case',
}

export function pageFromHash(hash = window.location.hash): SitePage | null {
  const page = hash.replace(/^#\/?/, '')
  if (page === 'about' || page === 'projects' || page === 'portfolio' || page === 'festival') return page
  return null
}

export function scrollToPage(page: SitePage, behavior: ScrollBehavior = 'smooth') {
  document.getElementById(sectionByPage[page])?.scrollIntoView({ behavior, block: 'start' })
}

export function navigateToPage(page: SitePage) {
  const nextHash = `#/${page}`
  if (window.location.hash === nextHash) {
    scrollToPage(page)
    return
  }
  window.location.hash = `/${page}`
  window.setTimeout(() => scrollToPage(page), 0)
}

export function navigateHome() {
  window.location.hash = '/'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
