// 简历文件：Folder.css 的文件夹动效 + 三张可放大查看的资料卡片。
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { useApp } from '@/store'
import { DRAWER_CARDS, type DrawerCard } from '@/data/content'

const toneBg: Record<string, string> = {
  paper: 'linear-gradient(145deg, #fbf7ec, #e8e0cc)',
  clay: 'linear-gradient(145deg, #e09a7a, #c96a3e)',
  sage: 'linear-gradient(145deg, #a9b894, #71815f)',
  amber: 'linear-gradient(145deg, #f0cd8a, #e2a13d)',
  ink: 'linear-gradient(145deg, #6a655c, #3d3a35)',
  wood: 'linear-gradient(145deg, #e0bd8f, #b9854e)',
  sky: 'linear-gradient(145deg, #cfe0e8, #9db8c4)',
}

export function CabinetDrawer() {
  const overlay = useApp((s) => s.overlay)
  const setOverlay = useApp((s) => s.setOverlay)
  const [open, setOpen] = useState(false)
  const [card, setCard] = useState<DrawerCard | null>(null)
  if (overlay !== 'drawer') return null

  return (
    <div
      className="panel-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOverlay(null)
      }}
    >
      <section
        className="panel"
        style={{ width: 'min(620px, 100%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="简历文件"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="panel-header">
          <div>
            <span className="panel-category">资料柜</span>
            <h2>简历文件</h2>
            <p className="panel-tagline">点击文件夹展开，再点纸张放大查看。内容可替换为正式个人资料。</p>
          </div>
          <button type="button" className="btn btn-icon" onClick={() => setOverlay(null)} aria-label="关闭">
            ✕
          </button>
        </header>
        <div className="panel-body" style={{ display: 'flex', justifyContent: 'center', padding: '48px 24px 64px' }}>
          <div
            className="cabinet-folder"
            style={
              {
                transform: 'scale(2.1)',
                transformOrigin: 'center',
                '--folder-color': '#71815f',
                '--folder-back-color': '#5c6b4d',
              } as CSSProperties
            }
          >
            <div
              className={`folder${open ? ' open' : ''}`}
              role="button"
              tabIndex={0}
              aria-expanded={open}
              aria-label="简历文件夹"
              onClick={() => setOpen((o) => !o)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setOpen((o) => !o)
                }
              }}
              style={{ position: 'relative' }}
            >
              <div className="folder__back">
                {DRAWER_CARDS.map((c) => (
                  <div
                    key={c.key}
                    className="paper"
                    style={{ background: toneBg[c.tone] }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCard(c)
                    }}
                  >
                    <div className="drawer-card" style={{ background: 'rgba(253,250,243,0.94)' }}>
                      <div className="drawer-card-title">{c.title}</div>
                      <div className="drawer-card-sub">{c.sub}</div>
                      <span className="drawer-card-hint">点击放大</span>
                    </div>
                  </div>
                ))}
                <div className="folder__front right" style={{ background: '#5c6b4d' }} />
                <div className="folder__front" style={{ background: '#71815f' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {card && (
        <div className="drawer-card-modal" onClick={() => setCard(null)}>
          <div className="drawer-card-modal-panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="drawer-card-modal-close" onClick={() => setCard(null)} aria-label="关闭">
              ✕
            </button>
            <span className="drawer-card-modal-tag">{card.sub}</span>
            <div className="drawer-card-modal-title">{card.title}</div>
            <div className="drawer-card-modal-sub">简历文件 · 资料卡片</div>
            <div className="drawer-card-modal-body">
              {card.lines.map((l) => (
                <div key={l} className="drawer-card-modal-line" style={{ width: `${58 + ((l.length * 13) % 38)}%` }} />
              ))}
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: '#5b564c' }}>{card.lines.join(' · ')}</p>
            </div>
            <div className="drawer-card-modal-note">{card.note}</div>
          </div>
        </div>
      )}
    </div>
  )
}
