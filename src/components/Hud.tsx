import { useApp } from '@/store'
import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { navigateToPage, pageFromHash } from '@/navigation'
import { SEASONS, TIMES } from '@/three/environment'

export function Hero() {
  const mode = useApp((s) => s.mode)
  const [inContentPage, setInContentPage] = useState(() => Boolean(pageFromHash()))
  useEffect(() => {
    const onHash = () => setInContentPage(Boolean(pageFromHash()))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  if (mode === 'focus' || inContentPage) return null
  return (
    <aside className="hero">
      <div className="hero-headline">走进我的 3D 个人工作室</div>
      <div className="hero-sub">第一屏 3D 导航 · 向下滚动继续探索</div>
      <ul className="hero-tags">
        <li>
          <button type="button" onClick={() => navigateToPage('about')}>
            关于我
          </button>
        </li>
        <li>
          <button type="button" onClick={() => navigateToPage('projects')}>
            桌面项目
          </button>
        </li>
        <li>
          <button type="button" onClick={() => navigateToPage('portfolio')}>
            作品集
          </button>
        </li>
      </ul>
    </aside>
  )
}

export function Guide() {
  const mode = useApp((s) => s.mode)
  const overlay = useApp((s) => s.overlay)
  const [inContentPage, setInContentPage] = useState(() => Boolean(pageFromHash()))
  useEffect(() => {
    const onHash = () => setInContentPage(Boolean(pageFromHash()))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  if (overlay || mode === 'focus' || inContentPage) return null
  const text =
    mode === 'intro'
      ? '点击画面，进入个人工作室'
      : '拖动环绕 · 点击物体聚焦 · 再点文字进入对应内容 · 向下滚动继续探索'
  return (
    <div className="guide" role="status">
      {text}
    </div>
  )
}

export function EnvironmentControls() {
  const season = useApp((s) => s.season)
  const time = useApp((s) => s.time)
  const setSeason = useApp((s) => s.setSeason)
  const setTime = useApp((s) => s.setTime)
  const [inContentPage, setInContentPage] = useState(() => Boolean(pageFromHash()))

  useEffect(() => {
    const onHash = () => setInContentPage(Boolean(pageFromHash()))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (inContentPage) return null

  return (
    <div className="stage-env-switches" aria-label="场景氛围">
      <div className="switch-group" role="group" aria-label="季节">
        {SEASONS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`chip${season === s.id ? ' is-active' : ''}`}
            aria-pressed={season === s.id}
            onClick={() => setSeason(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="switch-group" role="group" aria-label="时段">
        {TIMES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`chip${time === t.id ? ' is-active' : ''}`}
            aria-pressed={time === t.id}
            onClick={() => setTime(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Loader({ fading }: { fading: boolean }) {
  const progress = useProgress((s) => s.progress)
  const percent = Math.min(100, Math.max(0, Math.round(progress)))
  return (
    <div className={`loader${fading ? ' is-fading' : ''}`} aria-hidden={fading}>
      <div className="loader-box">
        <div className="loader-model" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="loader-name">
          LOADING STUDIO <span>· {percent}%</span>
        </div>
        <div className="loader-progress" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </div>
        <div className="loader-tip">桌面文件 · 墙面作品 · 个人资料 …</div>
      </div>
    </div>
  )
}
