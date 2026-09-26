// 作品集：墙面项目图的放大瀑布流（pg-* 体系），图片为程序生成的 SVG 示例图卡。
import { useState } from 'react'
import { useApp } from '@/store'
import { PHOTOS } from '@/data/content'

export function PhotoWall() {
  const overlay = useApp((s) => s.overlay)
  const setOverlay = useApp((s) => s.setOverlay)
  const [viewer, setViewer] = useState<number | null>(null)
  if (overlay !== 'photos') return null

  const n = PHOTOS.length
  const cur = viewer !== null ? PHOTOS[viewer] : null

  return (
    <div className="pg-root pg-open">
      <div className="pg-scroll">
        <div className="pg-wall-wrap">
          <div className="pg-wall">
            {PHOTOS.map((p, i) => (
              <figure
                key={p.key}
                className="pg-item"
                tabIndex={0}
                onClick={() => setViewer(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setViewer(i)
                }}
              >
                <img src={p.src} alt={p.title} loading="lazy" />
                <figcaption className="pg-item-caption">
                  <span className="pg-item-title">{p.title}</span>
                  <span className="pg-item-meta">{p.meta}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
      <div className="pg-header">
        <div className="pg-brand">
          <span className="pg-brand-en">PORTFOLIO</span>
          <span className="pg-brand-cn">作品集 · 项目缩略图示例</span>
        </div>
        <button type="button" className="pg-back" onClick={() => setOverlay(null)}>
          ← 回到房间
        </button>
      </div>
      <div className="pg-hint">ESC 返回 · 点击图片放大</div>
      <div className="pg-vignette" />

      {cur && viewer !== null && (
        <div className="pg-viewer" onClick={() => setViewer(null)}>
          <button type="button" className="pg-viewer-close" onClick={() => setViewer(null)} aria-label="关闭">
            ✕
          </button>
          <button
            type="button"
            className="pg-viewer-nav pg-prev"
            aria-label="上一张"
            onClick={(e) => {
              e.stopPropagation()
              setViewer((viewer + n - 1) % n)
            }}
          >
            ‹
          </button>
          <figure className="pg-viewer-body" onClick={(e) => e.stopPropagation()}>
            <img src={cur.src} alt={cur.title} />
            <figcaption>
              <strong>{cur.title}</strong>
              <span>{cur.meta}</span>
              <p>示例项目图：后续可以替换为你的真实作品封面与项目说明。</p>
            </figcaption>
          </figure>
          <button
            type="button"
            className="pg-viewer-nav pg-next"
            aria-label="下一张"
            onClick={(e) => {
              e.stopPropagation()
              setViewer((viewer + 1) % n)
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
