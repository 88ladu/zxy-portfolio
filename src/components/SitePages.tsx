import { useEffect } from 'react'
import { navigateHome, navigateToPage, pageFromHash, scrollToPage } from '@/navigation'

const aboutInfo = [
  {
    label: 'EDUCATION',
    lines: ['中国人民大学', '设计学硕士', '2024—2027'],
  },
  {
    label: 'FOCUS',
    lines: ['Spatial Design', 'Digital Experience', 'Generative AI'],
  },
  {
    label: 'CURRENT',
    lines: ["Master's Student", 'Designer'],
  },
  {
    label: 'LOCATION',
    lines: ['Beijing', 'China'],
  },
]

const experienceItems = [
  {
    number: '01',
    date: '2026.03-now',
    title: '毕业设计研究',
    subtitle: '生成式 AI 赋能传统园林数字化设计',
    text: '围绕传统园林的空间叙事、数字资产整理与交互展示，搭建从研究、模型到网页体验的完整表达。',
    tags: ['论文研究', '3D 网页', '交互叙事'],
  },
  {
    number: '02',
    date: '2025.10-2026.01',
    title: '3D 个人工作室',
    subtitle: '把个人简介、项目资料和作品入口放进可探索空间',
    text: '用桌面、椅子、作品板等物件承载不同页面入口，让作品集不只是目录，而是一个可以进入的场景。',
    tags: ['Three.js', '网页原型', '作品集'],
  },
  {
    number: '03',
    date: '2025',
    title: '视觉与内容整理',
    subtitle: '项目封面、作品说明、过程档案',
    text: '将调研材料、模型截图、界面草图与最终成果整理成清晰的阅读路径，方便后续替换真实作品内容。',
    tags: ['版式', '内容策划', '展示设计'],
  },
]

const works = [
  {
    index: '01',
    type: '展览策划 · 2025',
    title: '2025北京798艺术节《巨人星球》',
    text: '从主题梳理、空间设计到现场执行，参与艺术科技展览的完整落地。',
    href: '#/festival',
  },
  {
    index: '02',
    type: '互动网页 · 2026',
    title: '可以走进去的个人作品集',
    text: '以 3D 工作室作为首页，把不同家具与文件转化为网页导航。',
    href: '#/portfolio',
  },
  {
    index: '03',
    type: '视觉系统 · 2025',
    title: '作品集版式与项目档案',
    text: '统一作品封面、项目信息、过程记录和最终成果的展示语言。',
    href: '#/portfolio',
  },
]

const festivalSteps = [
  {
    label: '01',
    title: '发现问题',
    text: '艺术节包含主题展、论坛、讲堂、工作坊与导览等多种内容，需要建立统一的体验秩序。',
  },
  {
    label: '02',
    title: '调研分析',
    text: '围绕展览内容、场地条件和观众路径，梳理入口、动线、展区与停留节点。',
  },
  {
    label: '03',
    title: '确定方向',
    text: '以空间承载主题，以活动延展体验，将“多觉·共生”转化为可进入的现场。',
  },
  {
    label: '04',
    title: '方案迭代',
    text: '通过方案 PDF、平面推敲和 Enscape 渲染，验证空间氛围、观看关系与互动路径。',
  },
  {
    label: '05',
    title: '最终落地',
    text: '全程参与布展、导览系统、媒体物料与活动执行协同，推动方案进入真实现场。',
  },
]

export function SitePages() {
  useEffect(() => {
    const scrollFromHash = () => {
      const page = pageFromHash()
      if (page) window.setTimeout(() => scrollToPage(page, 'auto'), 0)
    }
    scrollFromHash()
    window.addEventListener('hashchange', scrollFromHash)
    return () => window.removeEventListener('hashchange', scrollFromHash)
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="site-page" aria-label="个人介绍内容">
      <section id="about" className="content-section about-section">
        <div className="section-media">
          <div className="profile-card identity-card">
            <div className="clipboard-clip" aria-hidden="true">
              <span />
            </div>
            <div className="identity-paper">
              <span className="paperclip" aria-hidden="true" />
              <div className="identity-photo" aria-label="张芯瑜个人照片">
                <img src="/about/zhang-xinyu-portrait.jpg" alt="张芯瑜个人照片" />
              </div>
              <div className="identity-top">
                <span className="identity-eyebrow">ABOUT / 01</span>
                <div className="identity-name">
                  <strong>张芯瑜</strong>
                  <em>ZHANG XINYU</em>
                </div>
              </div>
              <div className="identity-body">
                <div className="identity-role">
                  <span>DESIGNER</span>
                  <strong>
                    空间设计
                    <br />
                    数字体验
                    <br />
                    生成式 AI
                  </strong>
                </div>
                <div className="identity-row">
                  <span>EDUCATION</span>
                  <strong>
                    中国人民大学
                    <br />
                    设计学硕士
                  </strong>
                  <small>2024 — 2027</small>
                </div>
                <div className="identity-row">
                  <strong>
                    中国人民大学
                    <br />
                    环境艺术设计
                  </strong>
                  <small>2019 — 2023</small>
                </div>
                <div className="identity-row">
                  <span>FOCUS</span>
                  <strong>
                    Spatial Design
                    <br />
                    Digital Experience
                    <br />
                    Generative AI
                  </strong>
                </div>
                <div className="identity-footer">
                  <span>LOCATION</span>
                  <strong>Beijing · China</strong>
                </div>
              </div>
              <div className="identity-focus">
                <strong>SPACE · CULTURE · DIGITAL</strong>
                <span>空间 · 文化 · 数字体验</span>
              </div>
              <div className="identity-dossier">
                DESIGNER PROFILE
                <br />
                2026 / BEIJING
              </div>
            </div>
          </div>
        </div>
        <div className="section-copy">
          <button type="button" className="back-to-studio-link" onClick={navigateHome}>
            ← 返回工作室
            <b>BACK TO STUDIO</b>
          </button>
          <span className="section-kicker">/ 关于我 ABOUT</span>
          <h1>
            在空间、文化与数字媒介之间，
            <br />
            寻找新的体验方式。
          </h1>
          <div className="about-body">
            <p className="about-lead">
              我是张芯瑜，中国人民大学艺术学院设计学硕士在读，本科就读于环境艺术设计专业。我的实践关注
              <strong>空间设计、数字文化展示与生成式 AI</strong>
              ，尝试将研究、叙事、视觉与技术转化为可以被真实感知和参与的体验。
            </p>
            <p>
              曾参与
              <strong>第十八届798艺术节、国家级文化遗产数字展示、数字艺术展厅</strong>
              等项目，工作覆盖前期调研、空间方案、三维视觉、AIGC内容生成、展览落地与传播运营。我希望自己不仅完成“设计结果”，也能够理解内容、用户与项目如何共同构成一次完整体验。
            </p>
            <p>
              目前，我也在持续探索
              <strong>生成式 AI 与传统园林数字化设计</strong>
              ，以及 AI 如何进入真实的空间、文化与设计工作流。
            </p>
          </div>
          <div className="about-info-strip" aria-label="个人信息摘要">
            {aboutInfo.map((item) => (
              <div key={item.label} className="about-info-item">
                <span>{item.label}</span>
                {item.lines.map((line) => (
                  <strong key={line}>{line}</strong>
                ))}
              </div>
            ))}
          </div>
          <div className="about-actions">
            <button type="button" className="about-action" onClick={() => navigateToPage('projects')}>
              <span>查看我的经历 →</span>
              <b>VIEW EXPERIENCE</b>
            </button>
            <button type="button" className="about-action" onClick={scrollToContact}>
              <span>联系我 →</span>
              <b>CONTACT ME</b>
            </button>
          </div>
        </div>
      </section>

      <section id="experience" className="content-section timeline-section">
        <aside className="section-title-sticky">
          <span>02</span>
          <h2>个人经历</h2>
          <p>从桌面项目继续往下读，看到研究、原型和作品整理的过程。</p>
        </aside>
        <div className="timeline-list">
          {experienceItems.map((item) => (
            <article key={item.number} className="timeline-item">
              <div className="timeline-dot">{item.number}</div>
              <div>
                <div className="timeline-meta">{item.date}</div>
                <h3>{item.title}</h3>
                <strong>{item.subtitle}</strong>
                <p>{item.text}</p>
                <ul>
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="portfolio" className="content-section works-section">
        <div className="works-head">
          <span>03 / 代表作品</span>
          <h2>作品集入口</h2>
          <p>从作品板进入项目档案，按项目类型、年份与角色快速阅读代表作品。</p>
        </div>
        <div className="works-grid">
          <div className="featured-work">
            <a className="work-cover work-cover-image" href="#/festival" aria-label="查看2025北京798艺术节项目介绍">
              <img src="/projects/798/hero-final.jpg" alt="2025北京798艺术节主题展现场" />
              <span>PROJECT 01</span>
            </a>
            <strong>展览策划 · 2025</strong>
            <a href="#/festival">查看项目介绍</a>
          </div>
          <div className="work-list">
            {works.map((work) => (
              <article key={work.index} className="work-row">
                <span>{work.index}</span>
                <div>
                  <small>{work.type}</small>
                  <h3>{work.title}</h3>
                  <p>{work.text}</p>
                </div>
                <a href={work.href}>查看介绍</a>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section id="festival-case" className="content-section case-study-section">
        <div className="case-kicker">PROJECT 01 / 展览策划与空间设计</div>
        <div className="case-hero">
          <div className="case-hero-copy">
            <span>2025 · 北京 798国际艺术交流中心</span>
            <h2>2025北京798艺术节《巨人星球：多觉艺术科技》</h2>
            <p>以“多觉·共生”为主题，参与主题展空间设计、整体策划、方案表达与现场执行协同。</p>
            <dl>
              <div><dt>身份</dt><dd>实习设计师</dd></div>
              <div><dt>工作</dt><dd>空间方案 / Enscape 渲染 / 方案 PDF / 策划支持 / 现场落地</dd></div>
              <div><dt>方向</dt><dd>艺术科技展览 · 策划运营 · 空间体验</dd></div>
            </dl>
          </div>
          <figure className="case-hero-image">
            <img src="/projects/798/hero-final.jpg" alt="2025北京798艺术节主题展沉浸空间现场" />
            <figcaption>主题展现场 / 798国际艺术交流中心 / 2025</figcaption>
          </figure>
        </div>

        <div className="case-overview">
          <div>
            <span className="case-label">项目概述</span>
            <p>2025 北京 798 艺术节以“多觉·共生”为主题，围绕艺术、科技与多感官体验展开。作为实习设计师，我综合参与主题展《巨人星球：多觉艺术科技》的空间设计与策划执行工作，协助将抽象主题转化为可进入、可感知、可参与的展览现场。</p>
          </div>
          <figure>
            <img src="/projects/798/visual-banner.jpg" alt="2025北京798艺术节园区主视觉物料" />
            <figcaption>艺术节园区物料与主视觉</figcaption>
          </figure>
        </div>

        <div className="case-process" aria-label="项目闭环流程">
          {festivalSteps.map((step) => (
            <article key={step.label} className="case-process-item">
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <div className="case-editorial case-editorial-plan">
          <div className="case-editorial-copy">
            <span className="case-label">调研分析 / 确定方向</span>
            <h3>用空间承载主题，用活动延展体验。</h3>
            <p>项目初期需要在主题展、论坛、讲堂、工作坊和导览之间建立统一逻辑。我围绕内容、空间和观众路径进行梳理，明确空间不仅承担展示功能，也需要成为串联感官体验与活动内容的媒介。</p>
          </div>
          <div className="case-image-grid">
            <figure>
              <img src="/projects/798/theme-page.jpg" alt="多觉共生主题分析页面" />
              <figcaption>主题分析</figcaption>
            </figure>
            <figure>
              <img src="/projects/798/plan-page.jpg" alt="空间平面与动线方案页面" />
              <figcaption>空间动线</figcaption>
            </figure>
            <figure>
              <img src="/projects/798/interaction-page.jpg" alt="互动设计方案页面" />
              <figcaption>互动节点</figcaption>
            </figure>
          </div>
        </div>

        <div className="case-editorial case-editorial-render">
          <figure className="case-large-image">
            <img src="/projects/798/render-immersive.jpg" alt="798主题展沉浸空间Enscape渲染图" />
            <figcaption>Enscape 空间渲染 / 本人制作</figcaption>
          </figure>
          <div className="case-editorial-copy">
            <span className="case-label">方案迭代</span>
            <h3>用渲染提前验证观看关系。</h3>
            <p>通过平面布局、分区关系、视角推敲和沉浸空间效果图，持续验证观众进入、停留、观看和互动的体验路径。</p>
          </div>
        </div>

        <div className="case-comparison">
          <div className="case-comparison-head">
            <span className="case-label">最终落地</span>
            <h3>从方案图到真实现场</h3>
            <p>渲染用于预演空间氛围和视觉节奏，现场照片记录方案落地后的真实观看关系。</p>
          </div>
          <div className="case-comparison-grid">
            <figure>
              <img src="/projects/798/render-wall.jpg" alt="主题展入口方案渲染图" />
              <figcaption>方案渲染</figcaption>
            </figure>
            <figure>
              <img src="/projects/798/hero-entrance.jpg" alt="主题展最终现场照片" />
              <figcaption>最终现场</figcaption>
            </figure>
          </div>
        </div>

        <div className="case-editorial case-editorial-operation">
          <div className="case-editorial-copy">
            <span className="case-label">策划执行</span>
            <h3>在真实项目中理解设计如何被执行。</h3>
            <p>我全程参与现场布展、导览系统、媒体物料和活动执行协同，进一步理解艺术科技项目从概念提出、内容组织、空间表达，到现场运营的完整推进过程。</p>
          </div>
          <div className="case-image-grid case-image-grid-small">
            <figure>
              <img src="/projects/798/forum.jpg" alt="2025北京798艺术节论坛现场" />
              <figcaption>论坛现场</figcaption>
            </figure>
            <figure>
              <img src="/projects/798/workshop.jpg" alt="多觉巨人星球儿童艺术工作坊视觉" />
              <figcaption>工作坊</figcaption>
            </figure>
            <figure>
              <img src="/projects/798/guide.jpg" alt="策展人导览活动现场" />
              <figcaption>导览活动</figcaption>
            </figure>
          </div>
        </div>

        <div className="case-reflection">
          <span>REFLECTION</span>
          <p>这个项目让我从空间设计进入真实策展与运营现场，理解一个艺术科技项目如何从概念、方案、视觉表达走向公众体验。</p>
          <a href="#/portfolio">← 返回作品列表</a>
        </div>
      </section>

      <section id="contact" className="content-section contact-section">
        <span>CONTACT</span>
        <h2>联系与后续更新</h2>
        <p>这里可以放邮箱、社交媒体、作品平台链接，也可以加二维码或下载简历按钮。</p>
      </section>
    </main>
  )
}
