import { useEffect, useMemo, useState } from 'react'
import { useApp } from '@/store'
import { Scene } from '@/three/Scene'
import { Topbar } from '@/components/Topbar'
import { EnvironmentControls, Hero, Guide, Loader } from '@/components/Hud'
import { HotspotPanel, OverviewModal } from '@/components/Panels'
import { CabinetDrawer } from '@/components/CabinetDrawer'
import { BookList } from '@/components/BookList'
import { PhotoWall } from '@/components/PhotoWall'
import { CorkModal } from '@/components/CorkModal'
import { Fallback } from '@/components/Fallback'
import { SitePages } from '@/components/SitePages'
import { navigateHome, pageFromHash } from '@/navigation'
import { HOTSPOTS } from '@/three/hotspotConfig'

function detectWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const webgl = useMemo(detectWebGL, [])
  const setWebgl = useApp((s) => s.setWebgl)
  useEffect(() => {
    setWebgl(webgl)
  }, [webgl, setWebgl])

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
    if (mobile) useApp.getState().setLowSpec(true)
  }, [])

  const fallback = useApp((s) => s.fallback)
  const ready = useApp((s) => s.ready)
  const [loaderGone, setLoaderGone] = useState(false)
  const [homeSceneEnabled, setHomeSceneEnabled] = useState(() => !pageFromHash())
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setLoaderGone(true), 700)
    return () => clearTimeout(t)
  }, [ready])

  useEffect(() => {
    const onHash = () => {
      if (!pageFromHash()) setHomeSceneEnabled(true)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // 键盘：Esc 返回/关闭；1-3 进入页面；R 复位；←/→ 在聚焦间切换
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useApp.getState()
      if (e.key === 'Escape') {
        if (pageFromHash()) navigateHome()
        else if (st.overlay) st.setOverlay(null)
        else if (st.mode === 'focus') st.closeFocus()
        return
      }
      if (st.fallback || !st.webgl || st.overlay) return
      const n = Number(e.key)
      if (n >= 1 && n <= HOTSPOTS.length) {
        const id = HOTSPOTS[n - 1].id
        st.focus(id)
        return
      }
      if (e.key === 'r' || e.key === 'R') st.resetView()
      if (st.mode === 'focus' && st.activeId) {
        const i = HOTSPOTS.findIndex((h) => h.id === st.activeId)
        if (e.key === 'ArrowRight') st.focus(HOTSPOTS[(i + 1) % HOTSPOTS.length].id)
        if (e.key === 'ArrowLeft') st.focus(HOTSPOTS[(i + HOTSPOTS.length - 1) % HOTSPOTS.length].id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!webgl || fallback) {
    return <Fallback canReturn={webgl} />
  }

  return (
    <div className="site-shell">
      <section id="home" className="stage" aria-label="3D 个人工作室首页">
        {homeSceneEnabled && <Scene onReady={() => useApp.getState().setReady(true)} />}
        <Topbar />
        <EnvironmentControls />
        <Hero />
        <Guide />
        <HotspotPanel />
        <OverviewModal />
        <CabinetDrawer />
        <BookList />
        <PhotoWall />
        <CorkModal />
      </section>
      <SitePages />
      {homeSceneEnabled && !loaderGone && <Loader fading={ready} />}
    </div>
  )
}
