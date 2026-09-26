import { useApp } from '@/store'
import { navigateToPage } from '@/navigation'

export function Topbar() {
  const lowSpec = useApp((s) => s.lowSpec)
  const setLowSpec = useApp((s) => s.setLowSpec)
  const setOverlay = useApp((s) => s.setOverlay)
  const resetView = useApp((s) => s.resetView)

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-dot" />
        <div>
          <div className="brand-name">个人工作室</div>
          <div className="brand-sub">PORTFOLIO 2026</div>
        </div>
      </div>
      <nav className="main-nav" aria-label="页面导航">
        <button type="button" onClick={() => navigateToPage('about')}>
          关于我
        </button>
        <button type="button" onClick={() => navigateToPage('projects')}>
          个人经历
        </button>
        <button type="button" onClick={() => navigateToPage('portfolio')}>
          代表作品
        </button>
        <a href="#contact">联系</a>
      </nav>
      <div className="topbar-actions">
        <button type="button" className="btn" onClick={() => setOverlay('overview')}>
          全部内容
        </button>
        <button type="button" className="btn" onClick={resetView}>
          复位视角
        </button>
        <button type="button" className="btn" onClick={() => setLowSpec(!lowSpec)}>
          {lowSpec ? '高清模式' : '流畅模式'}
        </button>
      </div>
    </header>
  )
}
