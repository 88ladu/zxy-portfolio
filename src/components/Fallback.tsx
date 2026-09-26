// 图文降级模式：无 WebGL 时自动进入，也可从顶栏/手机进入。
import { useApp } from '@/store'
import { PANELS } from '@/data/content'
import { HOTSPOTS } from '@/three/hotspotConfig'
import { ThumbIcon } from './ThumbIcon'

export function Fallback({ canReturn }: { canReturn: boolean }) {
  const setFallback = useApp((s) => s.setFallback)
  return (
    <div className="fallback">
      <div className="fallback-hero">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-name">个人工作室</span>
          <span className="brand-account">图文导览</span>
        </div>
        <h1>可以走进去的个人介绍网页（图文版）</h1>
        <p className="fallback-sub">
          这个 3D 个人工作室把简介、简历文件和作品集放进同一个空间。三维版支持环绕、聚焦、四季与时段切换；本页是不依赖
          WebGL 的图文版本。
        </p>
        {canReturn ? (
          <button type="button" className="btn btn-primary" onClick={() => setFallback(false)}>
            返回三维房间
          </button>
        ) : (
          <span className="fallback-note">当前浏览器不支持 WebGL，已自动切换为图文模式。</span>
        )}
      </div>

      <section className="fallback-about">
        <h2>关于这个空间</h2>
        <p>
          空间保留工作室的桌面、椅子、画架、资料柜和墙面作品板：桌面文件通向作品集，墙面资料卡通向个人简介，
          资料柜通向简历文件。
        </p>
        <p>所有文字和项目缩略图都是可替换内容，后续可以填入正式个人信息和真实作品。</p>
      </section>

      {HOTSPOTS.map((h) => {
        const c = PANELS[h.id]
        return (
          <section key={h.id} className="fallback-section">
            <div className="fallback-section-head">
              <h2>{c.title}</h2>
              <p>{c.tagline}</p>
            </div>
            <div className="fallback-items">
              {c.tabs.map((t) => (
                <article key={t.label} className="fallback-item">
                  <div className="item-head">
                    <div className={`thumb tone-${t.item.tone}`}>
                      <ThumbIcon />
                      <span>{t.label}</span>
                    </div>
                    <div className="item-headtext">
                      <h3>{t.item.title}</h3>
                      {t.item.subtitle && <div className="item-subtitle">{t.item.subtitle}</div>}
                    </div>
                  </div>
                  <p className="item-summary">{t.item.summary}</p>
                  {t.item.meta && (
                    <dl className="item-meta">
                      {t.item.meta.map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </article>
              ))}
            </div>
          </section>
        )
      })}

      <section className="fallback-contact">
        <h2>交付说明</h2>
        <p>
          本站是一个可继续扩展的个人介绍空间。站点内所有作品、书目与资料卡均为中性示例内容，可替换为你自己的材料。
        </p>
      </section>
    </div>
  )
}
