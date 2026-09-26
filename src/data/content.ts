// 站点全部中性示例内容：热点面板、总览、书单、简历卡片、作品集。
// 不包含任何真实姓名、履历、奖项或联系方式。

import type { HotspotId } from '@/three/hotspotConfig'

export type Tone = 'sage' | 'amber' | 'clay' | 'ink' | 'wood' | 'paper' | 'sky'

export interface PanelItem {
  title: string
  subtitle?: string
  tone: Tone
  tags?: string[]
  summary: string
  meta?: [string, string][]
  /** 点击面板内按钮触发的动作（打开对应浮层） */
  action?: 'drawer' | 'desktop' | 'photos' | 'books'
  actionLabel?: string
}

export interface PanelTab {
  label: string
  item: PanelItem
}

export interface PanelContent {
  category: string
  title: string
  tagline: string
  tabs: PanelTab[]
}

export const PANELS: Record<HotspotId, PanelContent> = {
  profile: {
    category: '个人介绍',
    title: '个人简介',
    tagline: '把这间 3D 工作室作为个人网站的入口，从墙上的资料卡开始认识我。',
    tabs: [
      {
        label: '简介',
        item: {
          title: '设计研究与数字叙事',
          subtitle: 'Personal Profile',
          tone: 'sky',
          tags: ['交互设计', '空间叙事', '数字文化'],
          summary:
            '这里是个人简介入口，适合放置你的姓名、教育背景、研究方向与设计兴趣。当前文案先以“生成式 AI、传统文化空间、交互叙事”为主线，方便后续替换为正式版本。',
          meta: [
            ['身份', '设计学方向 / 数字化设计研究'],
            ['关注', '传统园林、沉浸体验、AIGC 辅助设计'],
            ['入口', '墙上资料卡、桌面文件与作品板都可继续探索'],
          ],
        },
      },
      {
        label: '关键词',
        item: {
          title: '我正在建立的方向',
          subtitle: 'Research & Practice',
          tone: 'sage',
          tags: ['体验设计', '数字孪生', '作品集'],
          summary:
            '个人主页可以把研究、作品和方法连接成一个可探索的空间：墙面像资料板，桌面像工作台，文件与家具都成为通往不同页面的按钮。',
          meta: [
            ['研究', '生成式 AI 赋能传统园林数字化设计'],
            ['方法', '三维重建、交互叙事、信息可视化'],
            ['输出', '论文、方案、3D 网页、展陈体验'],
          ],
        },
      },
    ],
  },
  shelves: {
    category: '简历文件',
    title: '资料柜',
    tagline: '后墙的搁板和矮柜被改成简历与研究材料入口。',
    tabs: [
      {
        label: '经历',
        item: {
          title: '教育与研究经历',
          subtitle: 'Resume Files',
          tone: 'paper',
          tags: ['教育背景', '研究主题', '项目经历'],
          summary:
            '这里适合整理个人简历信息：教育背景、研究经历、项目角色、软件技能与展览/竞赛记录。点击矮柜可以打开文件夹式资料界面。',
          meta: [
            ['板块', '教育 / 技能 / 经历'],
            ['交互', '点击后墙搁板或黑色矮柜'],
            ['形式', '文件夹卡片，适合放简历摘要'],
          ],
          action: 'drawer',
          actionLabel: '打开简历文件',
        },
      },
      {
        label: '材料',
        item: {
          title: '可替换的个人材料',
          subtitle: 'CV · Notes · Plan',
          tone: 'ink',
          tags: ['简历', '研究计划', '方法卡'],
          summary:
            '抽屉卡片现在作为个人资料的占位内容：可以放简历摘要、研究计划、软件技能、联系方式或作品说明。',
          meta: [
            ['简历', '个人经历与能力概览'],
            ['计划', '毕业设计 / 研究路线'],
            ['联动', '打开“简历文件”浮层'],
          ],
          action: 'drawer',
          actionLabel: '打开简历文件',
        },
      },
    ],
  },
  desk: {
    category: '项目入口',
    title: '桌面项目',
    tagline: '桌上的电脑和纸张变成作品集与项目页面的入口。',
    tabs: [
      {
        label: '项目',
        item: {
          title: '正在进行的项目',
          subtitle: 'Work Desk',
          tone: 'wood',
          tags: ['毕业设计', '数字园林', '交互网页'],
          summary:
            '桌面保留原有布局，但功能转为项目索引。纸张可以直接打开作品集；电脑则适合承载更完整的个人主页、项目详情或外部链接。',
          meta: [
            ['纸张', '点击进入作品集界面'],
            ['电脑', '打开个人站内页'],
            ['桌面', '毕业设计、研究过程与草图归档'],
          ],
          action: 'photos',
          actionLabel: '进入作品集',
        },
      },
      {
        label: '电脑',
        item: {
          title: '个人主页内页',
          subtitle: 'Desktop Page',
          tone: 'sage',
          tags: ['主页', '作品索引', '图文版'],
          summary:
            '笔记本电脑仍然打开站点内页，可以继续扩展为“关于我 + 作品集 + 联系方式”的传统页面版本；手机则保留图文模式作为低性能设备入口。',
          meta: [
            ['电脑', '打开 public/desktop.html 内页'],
            ['手机', '进入图文降级模式'],
          ],
          action: 'desktop',
          actionLabel: '打开个人主页内页',
        },
      },
    ],
  },
  chair: {
    category: '关于我',
    title: '工作方式',
    tagline: '椅子代表“我在这里工作”的位置，点击可以查看个人状态与方法。',
    tabs: [
      {
        label: '状态',
        item: {
          title: '研究型创作者',
          subtitle: 'How I Work',
          tone: 'ink',
          tags: ['调研', '建模', '叙事设计'],
          summary:
            '这个入口可以写你的工作方法：从文献与案例调研出发，转译为空间叙事、交互原型与可浏览的三维网页。',
          meta: [
            ['方法', '研究梳理 → 场景建模 → 交互表达'],
            ['工具', 'AIGC、三维网页、视觉排版'],
          ],
        },
      },
      {
        label: '联系',
        item: {
          title: '联系方式占位',
          subtitle: 'Contact',
          tone: 'paper',
          tags: ['邮箱', '社交账号', '合作'],
          summary:
            '后续可以在这里放置邮箱、社交媒体、作品集平台链接，或者改成二维码卡片。',
          meta: [
            ['邮箱', 'your-email@example.com'],
            ['作品平台', 'Behance / 小红书 / 个人站链接'],
          ],
        },
      },
    ],
  },
  easel: {
    category: '代表作品',
    title: '项目画布',
    tagline: '画架区域作为代表作品入口，点击画布可以直接进入作品集。',
    tabs: [
      {
        label: '主项目',
        item: {
          title: '传统园林数字化设计研究',
          subtitle: 'Featured Project',
          tone: 'clay',
          tags: ['毕业设计', '园林空间', '交互叙事'],
          summary:
            '这一块适合放你的毕业设计主项目：研究背景、空间原型、交互机制、视觉系统和最终展示效果。',
          meta: [
            ['主题', '生成式 AI 赋能传统园林数字化设计'],
            ['形式', '3D 网页、方案文本、展陈叙事'],
          ],
          action: 'photos',
          actionLabel: '查看代表作品',
        },
      },
      {
        label: '过程',
        item: {
          title: '从草图到场景',
          subtitle: 'Process',
          tone: 'paper',
          tags: ['草图', '原型', '迭代'],
          summary:
            '作品集不只展示结果，也可以展示过程：调研笔记、关键词、空间草图、三维测试与交互脚本都可以放进这里。',
          meta: [
            ['过程', '资料收集、视觉试验、交互测试'],
            ['跳转', '点击桌面稿纸或墙面作品板'],
          ],
          action: 'photos',
          actionLabel: '进入作品集',
        },
      },
    ],
  },
  gallery: {
    category: '作品集',
    title: '墙面作品板',
    tagline: '后墙中部的作品板是个人作品集入口，适合陈列项目缩略图。',
    tabs: [
      {
        label: '作品墙',
        item: {
          title: '项目缩略图集合',
          subtitle: 'Portfolio Board',
          tone: 'amber',
          tags: ['项目卡片', '视觉记录', '可放大'],
          summary:
            '后墙中部保留项目缩略图的布局，语义改成作品集。点击任意作品或作品板会进入作品集页面，后续可替换为真实项目封面。',
          meta: [
            ['规格', '4 行 × 5 列作品缩略图'],
            ['内容', '毕业设计、视觉实验、交互原型'],
            ['联动', '打开“作品集”界面'],
          ],
          action: 'photos',
          actionLabel: '进入作品集',
        },
      },
      {
        label: '页面逻辑',
        item: {
          title: '3D 空间即导航',
          subtitle: 'Interaction Map',
          tone: 'sage',
          tags: ['墙面', '桌面', '家具'],
          summary:
            '个人主页的导航不再只是菜单，而是藏在空间里的物件：墙上文件看个人资料，桌面稿纸看作品集，家具和画布看工作方式与代表项目。',
          meta: [
            ['墙面', '个人简介与作品集'],
            ['桌面', '项目文件与内页入口'],
            ['家具', '关于我与创作方法'],
          ],
        },
      },
    ],
  },
}

export interface OverviewCard {
  key: string
  title: string
  desc: string
  cta: string
  hotspot?: HotspotId
  overlay?: 'books' | 'drawer' | 'photos' | 'desktop'
}

export const OVERVIEW_CARDS: OverviewCard[] = [
  { key: 'k-chair', title: '关于我', desc: '点击椅子进入个人简介页面。', cta: '聚焦查看', hotspot: 'chair' },
  { key: 'k-desk', title: '桌面项目', desc: '点击桌面进入项目页面。', cta: '聚焦查看', hotspot: 'desk' },
  { key: 'k-gallery', title: '作品集', desc: '点击后墙作品板进入作品集页面。', cta: '聚焦查看', hotspot: 'gallery' },
]

export interface DrawerCard {
  key: string
  title: string
  sub: string
  tone: Tone
  lines: string[]
  note: string
}

export const DRAWER_CARDS: DrawerCard[] = [
  {
    key: 'profile',
    title: '简历摘要',
    sub: '个人资料 · CV',
    tone: 'paper',
    lines: ['设计学方向', '生成式 AI 与数字文化空间', '交互叙事与三维网页'],
    note: '占位内容：可替换为正式姓名、教育背景、联系方式和个人简介。',
  },
  {
    key: 'research-plan',
    title: '研究计划',
    sub: '毕业设计 · 路线',
    tone: 'clay',
    lines: ['传统园林数字化设计', '沉浸式体验与信息组织', '生成式 AI 辅助创作流程'],
    note: '占位内容：可替换为开题、论文摘要或项目说明。',
  },
  {
    key: 'skill-card',
    title: '能力卡片',
    sub: '工具 · 方法',
    tone: 'sage',
    lines: ['AIGC 辅助设计', '三维场景搭建', '网页交互与视觉叙事'],
    note: '占位内容：可替换为软件技能、获奖经历或项目职责。',
  },
]

export interface BookItem {
  key: string
  title: string
  tag: string
  spine: string
  accent: string
  height: number
  intro: string
  reason: string
}

export const BOOKS: BookItem[] = [
  { key: 'b1', title: '交互叙事', tag: '方法', spine: '#8a6a48', accent: '#e2a13d', height: 300, intro: '围绕空间、路径与用户选择组织信息，把页面变成可以探索的叙事结构。', reason: '对应这个个人主页的空间化导航方式。' },
  { key: 'b2', title: '数字园林', tag: '研究', spine: '#5c6b4d', accent: '#c79a63', height: 260, intro: '以传统园林为对象，讨论数字化记录、重建、展示与体验更新。', reason: '对应毕业设计主题和研究背景。' },
  { key: 'b3', title: 'AIGC 流程', tag: '工具', spine: '#c96a3e', accent: '#f3d9a4', height: 320, intro: '记录生成式 AI 在图像、文本、建模和视觉方案迭代中的辅助方式。', reason: '用于解释作品集背后的方法与工具。' },
  { key: 'b4', title: '视觉系统', tag: '设计', spine: '#5b564c', accent: '#f6f1e6', height: 240, intro: '从字体、色彩、版式到组件状态，建立可复用的个人视觉语言。', reason: '适合作为个人作品集的设计规范。' },
  { key: 'b5', title: '空间原型', tag: '原型', spine: '#b0895c', accent: '#c96a3e', height: 280, intro: '用低成本三维原型快速验证动线、焦点与交互入口。', reason: '与当前 3D 工作室的搭建方式直接相关。' },
  { key: 'b6', title: '展陈体验', tag: '展陈', spine: '#71815f', accent: '#f3d9a4', height: 300, intro: '讨论如何在展览或网页中组织信息层级、观看节奏与沉浸体验。', reason: '帮助作品页从展示结果升级为体验路径。' },
  { key: 'b7', title: '项目档案', tag: '整理', spine: '#e2a13d', accent: '#71815f', height: 230, intro: '把项目过程、资料来源、迭代版本和最终产出整理成可读档案。', reason: '适合替换为你的真实项目目录。' },
  { key: 'b8', title: '个人陈述', tag: '文本', spine: '#6b5034', accent: '#e2a13d', height: 310, intro: '用清晰、克制的语言说明自己的研究兴趣、能力结构和未来方向。', reason: '可作为个人简介和申请材料的文本底稿。' },
]

export interface PhotoItem {
  key: string
  title: string
  meta: string
  src: string
}

/** 生成作品集用 SVG data-url（暖色抽象项目图） */
function artSvg(i: number): string {
  const w = 300 + (i % 3) * 60
  const h = 240 + ((i * 7) % 3) * 70
  const rnd = (n: number) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1
  const bgs = ['#f6f1e6', '#efe6d2', '#f0e8d8', '#e9dfc8']
  const washes = ['#c96a3e', '#71815f', '#e2a13d', '#8a6a48', '#b0895c']
  const bg = bgs[i % bgs.length]
  const w1 = washes[Math.floor(rnd(1) * washes.length)]
  const w2 = washes[Math.floor(rnd(2) * washes.length)]
  const x1 = Math.round(rnd(3) * 160 + 20)
  const y1 = Math.round(rnd(4) * 120 + 20)
  const sw = Math.round(rnd(5) * 120 + 60)
  const sh = Math.round(rnd(6) * 90 + 40)
  const cx = Math.round(rnd(7) * (w - 120) + 60)
  const cy = Math.round(rnd(8) * (h - 120) + 60)
  const r1 = Math.round(rnd(9) * 40 + 20)
  const px = Math.round(rnd(10) * (w - 100) + 30)
  const py = Math.round(rnd(11) * (h - 80) + 40)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${bg}"/><rect x="${x1}" y="${y1}" width="${sw}" height="${sh}" fill="${w1}" opacity="0.28"/><circle cx="${cx}" cy="${cy}" r="${r1}" fill="${w2}" opacity="0.3"/><path d="M ${px} ${py} q ${sw / 2} -60 ${sw} 10" stroke="rgba(58,53,46,0.65)" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M ${px + 20} ${py + 40} q ${sw / 3} -30 ${sw / 1.5} 6" stroke="rgba(58,53,46,0.4)" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="6" y="6" width="${w - 12}" height="${h - 12}" fill="none" stroke="rgba(58,53,46,0.18)" stroke-width="2"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const PHOTOS: PhotoItem[] = Array.from({ length: 12 }, (_, i) => ({
  key: `p${i + 1}`,
  title: `项目 No.${i + 1}`,
  meta: ['交互设计 · 原型', '数字空间 · 研究', '视觉系统 · 作品'][i % 3],
  src: artSvg(i),
}))
