// 书架书单：书脊横排（点击展开封面与介绍），样式来自 styles.css 的 bsp-* 体系。
import { useState } from 'react'
import type { CSSProperties } from 'react'
import { useApp } from '@/store'
import { BOOKS } from '@/data/content'

export function BookList() {
  const overlay = useApp((s) => s.overlay)
  const setOverlay = useApp((s) => s.setOverlay)
  const [openKey, setOpenKey] = useState<string | null>(null)
  if (overlay !== 'books') return null

  const openBook = BOOKS.find((b) => b.key === openKey) ?? null

  return (
    <div
      className="bsp-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOverlay(null)
      }}
    >
      <div className="bsp-stage" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="bsp-close" onClick={() => setOverlay(null)} aria-label="关闭">
          ✕
        </button>
        <div className="bsp-head">
          <div className="bsp-head-meta">
            <span>个人工作室</span>
            <span>资料柜书堆 · 八册参考</span>
          </div>
          <h2 className="bsp-head-title">参考书单</h2>
          <div className="bsp-head-sub">点一本，翻开看看</div>
        </div>
        <div className="bsp-row">
          <div className="bsp-baseline" />
          {BOOKS.map((b, i) => {
            const open = openKey === b.key
            const bookStyle = {
              '--spine-w': '46px',
              '--book-h': `${Math.round(b.height * 0.62)}px`,
              '--spine-c': b.spine,
              '--tilt': `${((i % 3) - 1) * 1.2}deg`,
              '--cover-c': '#f6f1e6',
              '--accent': b.accent,
            } as CSSProperties
            return (
              <div
                key={b.key}
                className={`bsp-book${open ? ' is-open' : ''}`}
                style={bookStyle}
                onClick={() => setOpenKey(b.key)}
              >
                <div className="bsp-spine">
                  <span className="bsp-spine-text">{b.title}</span>
                </div>
                <div className="bsp-cover">
                  <div className="bsp-cover-art">
                    <i />
                    <i />
                  </div>
                  <div className="bsp-cover-title">{b.title}</div>
                  <div className="bsp-cover-author">{b.tag} · 示例书单</div>
                  <span className="bsp-cover-open-hint">查看介绍</span>
                </div>
              </div>
            )
          })}
        </div>
        {openBook && (
          <aside className="bsp-detail">
            <button
              type="button"
              className="bsp-detail-close"
              onClick={() => setOpenKey(null)}
              aria-label="收起介绍"
            >
              ✕
            </button>
            <span className="bsp-detail-tag">{openBook.tag}</span>
            <h3 className="bsp-detail-title">{openBook.title}</h3>
            <div className="bsp-detail-author">示例书单 · 无真实作者信息</div>
            <h3>介 绍</h3>
            <p>{openBook.intro}</p>
            <h3>推荐理由</h3>
            <p>{openBook.reason}</p>
            <span className="bsp-detail-link">示例条目 · 不含外部链接</span>
          </aside>
        )}
      </div>
    </div>
  )
}
