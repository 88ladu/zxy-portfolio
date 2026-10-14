import { useEffect } from 'react'
import { navigateHome, pageFromHash, scrollToPage } from '@/navigation'
import { assetPath } from '@/assetPath'
import './WarmGallery.css'

export function SitePages() {
  useEffect(() => {
    const sync = () => {
      const page = pageFromHash()
      if (page) window.setTimeout(() => scrollToPage(page, 'auto'), 0)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  const caseUrl = assetPath('/projects/798.html')
  return (
    <main className="warm-gallery" aria-label="个人介绍与精选作品">
      <div className="gallery-threshold"><span>从工作室，走进我的设计实践</span><span aria-hidden="true">↓</span></div>
      <nav className="gallery-nav" aria-label="作品集内容导航"><a href="#/about">张芯瑜 · XY STUDIO</a><div><a href="#/about">关于</a><a href="#/projects">经历</a><a href="#/portfolio">作品</a></div></nav>
      <section id="about" className="gallery-section gallery-about">
        <div className="gallery-intro"><div><p className="gallery-kicker">ABOUT THE DESIGNER</p><h1>以空间为起点，<br />让感知与故事相遇。</h1><p className="gallery-bio">我是张芯瑜，中国人民大学设计学硕士在读。本科就读于环境设计专业，关注空间叙事、数字体验与生成式 AI，在研究与实践之间探索新的表达。</p><p className="gallery-bio">曾参与 798 艺术节与文化遗产数字展示等项目，工作覆盖前期调研、空间方案、三维表达、AI 内容生成、展览落地与传播运营。</p></div><figure className="gallery-portrait"><img src={assetPath('/about/zhang-xinyu-portrait.jpg')} alt="张芯瑜个人照片" loading="lazy" /><figcaption>张芯瑜 / ZHANG XINYU<br />空间 · 文化 · 数字体验</figcaption></figure></div>
        <div className="gallery-facts"><div><span>EDUCATION</span><p>中国人民大学 · 设计学硕士<br />2024 — 2027</p></div><div><span>FOCUS</span><p>空间叙事 · 数字体验<br />生成式 AI 辅助设计</p></div><div><span>LOCATION</span><p>北京 · 中国</p></div></div>
      </section>
      <section id="experience" className="gallery-section gallery-experience"><div className="gallery-heading"><h2>研究与实践</h2><span className="gallery-kicker">EXPERIENCE</span></div><div className="gallery-experience-list"><article><p className="gallery-date">2025.06 — 2026.02</p><div><h3>DAC · 助理设计师实习</h3><p>参与数字文化展览的调研、空间设计与三维表达，配合展览现场协同及传播内容制作，连接概念方案与项目落地。</p></div></article><article><p className="gallery-date">2025.04 — 2025.09</p><div><h3>中国人民大学通州校区 · 空间小组组长</h3><p>参与艺术学院室内外空间设计，负责需求分析、场地调研、方案推敲与设计表达，组织小组沟通并推进成果整合。</p></div></article><article><p className="gallery-date">硕士研究 · 在研</p><div><h3>生成式 AI 与传统园林数字化设计</h3><p>以颐和园谐趣园为例，探索传统园林的空间要素、叙事与体验如何借助生成式 AI 转化为数字设计表达。</p></div></article></div></section>
      <section id="portfolio" className="gallery-section gallery-works"><div className="gallery-heading"><h2>精选作品</h2><span className="gallery-kicker">SELECTED WORKS</span></div><article className="gallery-feature"><a className="gallery-cover" href={caseUrl} target="_blank" rel="noopener noreferrer" aria-label="在新页面查看798艺术节项目介绍"><img src={assetPath('/projects/798/hero-final.jpg')} alt="2025北京798艺术节主题展现场" loading="lazy" /></a><div className="gallery-work-caption"><div><p className="gallery-kicker">EXHIBITION / 2025</p><h3>多觉共生 · 798 艺术科学节</h3><p>第十八届北京798艺术节《巨人星球》主题展<br />展览空间 / 三维呈现 / 现场协同</p></div><a className="gallery-case-link" href={caseUrl} target="_blank" rel="noopener noreferrer">查看介绍 <span aria-hidden="true">↗</span></a></div></article><div className="gallery-secondary">{['02', '03', '04'].map(index => <article key={index}><div className="gallery-placeholder" aria-hidden="true"><span>{index}</span><small>PROJECT ARCHIVE</small></div><p className="gallery-kicker">PROJECT / {index}</p><h3>作品项目 {index}</h3><p>预留项目档案位置</p><span className="gallery-status">待补充项目文件与图片</span></article>)}</div></section>
      <section id="contact" className="gallery-section gallery-contact"><p className="gallery-kicker">LET'S CONNECT</p><h2>让想法，继续生长。</h2><p>空间设计 · 数字体验 · 研究与表达</p><a href="https://github.com/88ladu" target="_blank" rel="noopener noreferrer">GitHub ↗</a></section>
      <footer className="gallery-footer"><span>张芯瑜 / XY STUDIO</span><button type="button" onClick={navigateHome}>返回工作室 ↑</button></footer>
    </main>
  )
}
