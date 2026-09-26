import { useState } from 'react'
import { useApp } from '@/store'
import { HOTSPOTS, type HotspotId } from '@/three/hotspotConfig'
import { PANELS, OVERVIEW_CARDS, type PanelItem, type Tone } from '@/data/content'
import { navigateToPage } from '@/navigation'
import { ThumbIcon } from './ThumbIcon'

function Thumb({ tone, label }: { tone: Tone; label: string }) {
  return (
    <div className={`thumb tone-${tone}`}>
      <ThumbIcon />
      <span>{label}</span>
    </div>
  )
}

function ItemView({ item }: { item: PanelItem }) {
  const setOverlay = useApp((s) => s.setOverlay)
  const action = item.action
  return (
    <article>
      <div className="item-head">
        <Thumb tone={item.tone} label={item.subtitle ?? '示例'} />
        <div className="item-headtext">
          <h3>{item.title}</h3>
          {item.subtitle && <div className="item-subtitle">{item.subtitle}</div>}
          {item.tags && (
            <div className="item-tags">
              {item.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="item-summary">{item.summary}</p>
      {item.meta && (
        <dl className="item-meta">
          {item.meta.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      {action && (
        <p style={{ marginTop: 14 }}>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => setOverlay(action)}>
            {item.actionLabel ?? '查看'}
          </button>
        </p>
      )}
    </article>
  )
}

function PanelInner({ id }: { id: HotspotId }) {
  const [tab, setTab] = useState(0)
  const closeFocus = useApp((s) => s.closeFocus)
  const focus = useApp((s) => s.focus)
  const content = PANELS[id]
  const idx = HOTSPOTS.findIndex((h) => h.id === id)
  const len = HOTSPOTS.length
  return (
    <div
      className="panel-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeFocus()
      }}
    >
      <section className="panel" role="dialog" aria-modal="true" aria-label={content.title}>
        <header className="panel-header">
          <div>
            <span className="panel-category">{content.category}</span>
            <h2>{content.title}</h2>
            <p className="panel-tagline">{content.tagline}</p>
          </div>
          <button type="button" className="btn btn-icon" onClick={closeFocus} aria-label="关闭">
            ✕
          </button>
        </header>
        <div className="panel-tabs" role="tablist">
          {content.tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={i === tab}
              className={`panel-tab${i === tab ? ' is-active' : ''}`}
              onClick={() => setTab(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="panel-body">
          <ItemView item={content.tabs[tab].item} />
        </div>
        <footer className="panel-footer">
          <span className="panel-counter">
            {idx + 1} / {len} · 数字键切换
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => focus(HOTSPOTS[(idx + len - 1) % len].id)}
            >
              上一个
            </button>
            <button type="button" className="btn btn-sm" onClick={() => focus(HOTSPOTS[(idx + 1) % len].id)}>
              下一个
            </button>
            <button type="button" className="btn btn-sm btn-primary" onClick={closeFocus}>
              回到房间
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}

export function HotspotPanel() {
  const activeId = useApp((s) => s.activeId)
  const closeFocus = useApp((s) => s.closeFocus)
  const setOverlay = useApp((s) => s.setOverlay)
  if (!activeId) return null

  const copy: Record<HotspotId, { kicker: string; title: string; body: string; cta: string; action: () => void }> = {
    desk: {
      kicker: 'CURRENT PROJECTS',
      title: '桌面项目',
      body: '正在发生的设计、研究与实验',
      cta: '进入桌面 →',
      action: () => navigateToPage('projects'),
    },
    chair: {
      kicker: 'ABOUT ME',
      title: '你好，我是 XXX',
      body: '景观 / 空间 / 数字体验设计。关注空间、文化与数字媒介之间的关系。',
      cta: '认识我 →',
      action: () => navigateToPage('about'),
    },
    gallery: {
      kicker: 'SELECTED WORKS',
      title: '代表作品',
      body: '探索我的设计项目',
      cta: '查看全部作品 →',
      action: () => navigateToPage('portfolio'),
    },
    easel: {
      kicker: 'SKETCHBOOK',
      title: '灵感 / 草图 / 实验',
      body: '这里收集了一些没有成为正式项目的想法。',
      cta: '翻开我的灵感簿 →',
      action: () => setOverlay('photos'),
    },
    profile: {
      kicker: 'PROFILE',
      title: '关于我',
      body: '认识这个工作室的主人。',
      cta: '认识我 →',
      action: () => navigateToPage('about'),
    },
    shelves: {
      kicker: 'ARCHIVE',
      title: '收藏与资料',
      body: '一些书、文件和碎片灵感。',
      cta: '查看资料 →',
      action: () => setOverlay('books'),
    },
  }
  const content = copy[activeId]
  return (
    <aside className={`focus-card focus-${activeId}`} aria-live="polite">
      <button type="button" className="focus-back" onClick={closeFocus}>
        ← 返回工作室
      </button>
      <span>{content.kicker}</span>
      <h2>{content.title}</h2>
      <p>{content.body}</p>
      <button type="button" className="btn btn-primary" onClick={content.action}>
        {content.cta}
      </button>
    </aside>
  )
}

export function OverviewModal() {
  const overlay = useApp((s) => s.overlay)
  const setOverlay = useApp((s) => s.setOverlay)
  const focus = useApp((s) => s.focus)
  if (overlay !== 'overview') return null
  return (
    <div
      className="panel-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOverlay(null)
      }}
    >
      <section className="panel panel-overview" role="dialog" aria-modal="true" aria-label="全部内容">
        <header className="panel-header">
          <div>
            <span className="panel-category">总览</span>
            <h2>全部内容</h2>
            <p className="panel-tagline">点击卡片进入对应网站页面，Esc 关闭浮层。</p>
          </div>
          <button type="button" className="btn btn-icon" onClick={() => setOverlay(null)} aria-label="关闭">
            ✕
          </button>
        </header>
        <div className="overview-grid">
          {OVERVIEW_CARDS.map((c) => (
            <button
              key={c.key}
              type="button"
              className="overview-card"
              onClick={() => {
                if (c.hotspot === 'chair') navigateToPage('about')
                else if (c.hotspot === 'desk') navigateToPage('projects')
                else if (c.hotspot === 'gallery') navigateToPage('portfolio')
                else if (c.overlay) setOverlay(c.overlay)
              }}
            >
              <strong>{c.title}</strong>
              <span className="overview-desc">{c.desc}</span>
              <span className="overview-cta">{c.cta} →</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
