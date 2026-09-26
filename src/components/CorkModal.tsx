// 电脑内页浮层：iframe 加载随站点交付的 public/desktop.html。
import { assetPath } from '@/assetPath'
import { useState } from 'react'
import { useApp } from '@/store'

export function CorkModal() {
  const overlay = useApp((s) => s.overlay)
  const setOverlay = useApp((s) => s.setOverlay)
  const [loaded, setLoaded] = useState(false)
  if (overlay !== 'desktop') return null
  return (
    <div
      className="cork-project-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOverlay(null)
      }}
    >
      <div className="cork-project-modal-panel" onClick={(e) => e.stopPropagation()}>
        <header className="cork-project-modal-header">
          <span className="cork-project-modal-tag">站点内页</span>
          <span className="cork-project-modal-title">数字工作台 · 随站点交付</span>
          <button type="button" className="cork-project-modal-close" onClick={() => setOverlay(null)} aria-label="关闭">
            ✕
          </button>
        </header>
        <div className="cork-project-modal-frame">
          <div className="cork-project-modal-loading" style={{ opacity: loaded ? 0 : 1 }}>
            正在载入…
          </div>
          <iframe
            src={assetPath('/desktop.html')}
            title="数字工作台"
            className={loaded ? 'is-loaded' : ''}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </div>
  )
}
