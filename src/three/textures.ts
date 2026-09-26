// 程序化 Canvas 纹理：全部离线生成，不依赖外部图片资源。
import * as THREE from 'three'
import { palette } from './palette'

const cache = new Map<string, THREE.CanvasTexture>()

function make(key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const hit = cache.get(key)
  if (hit) return hit
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const ctx = cv.getContext('2d')!
  draw(ctx)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  cache.set(key, tex)
  return tex
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** 墙面小幅作品：暖底 + 色块 + 炭笔笔触，8 个变体 */
export function artTexture(variant: number): THREE.CanvasTexture {
  return make(`art-${variant}`, 256, 192, (ctx) => {
    const rnd = mulberry32(variant * 9176 + 13)
    ctx.fillStyle = ['#f4efe4', '#f0e8d8', '#f6f1e6', '#efe6d2'][variant % 4]
    ctx.fillRect(0, 0, 256, 192)
    const washes = ['#c96a3e', '#71815f', '#e2a13d', '#8a6a48', '#b0895c']
    const washCount = 2 + Math.floor(rnd() * 2)
    for (let i = 0; i < washCount; i++) {
      ctx.globalAlpha = 0.16 + rnd() * 0.2
      ctx.fillStyle = washes[Math.floor(rnd() * washes.length)]
      const x = 20 + rnd() * 150
      const y = 20 + rnd() * 110
      const w = 50 + rnd() * 110
      const h = 30 + rnd() * 80
      if (rnd() > 0.4) {
        ctx.fillRect(x, y, w, h)
      } else {
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
    ctx.strokeStyle = '#3a352e'
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      const x0 = rnd() * 200 + 20
      const y0 = rnd() * 140 + 25
      ctx.moveTo(x0, y0)
      ctx.bezierCurveTo(x0 + 40, y0 - 40 + rnd() * 80, x0 + 90, y0 + 40 - rnd() * 80, x0 + 150, y0 - 20 + rnd() * 40)
      ctx.stroke()
    }
    if (variant % 3 === 0) {
      // 植物小枝
      ctx.strokeStyle = '#5c6b4d'
      ctx.lineWidth = 2.6
      ctx.beginPath()
      ctx.moveTo(60, 170)
      ctx.quadraticCurveTo(80, 90, 130, 40)
      ctx.stroke()
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.ellipse(85 + i * 12, 120 - i * 18, 12, 5, -0.7, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(92,107,77,0.55)'
        ctx.fill()
      }
    }
    ctx.globalAlpha = 0.9
    ctx.strokeStyle = 'rgba(58,53,46,0.35)'
    ctx.lineWidth = 1
    ctx.strokeRect(8.5, 8.5, 239, 175)
    ctx.globalAlpha = 1
  })
}

/** 大画布：大面积暖色罩染 + 轮廓线 */
export function bigCanvasTexture(): THREE.CanvasTexture {
  return make('big-canvas', 512, 640, (ctx) => {
    ctx.fillStyle = '#f5efe2'
    ctx.fillRect(0, 0, 512, 640)
    const g1 = ctx.createRadialGradient(180, 220, 40, 180, 220, 260)
    g1.addColorStop(0, 'rgba(226,161,61,0.5)')
    g1.addColorStop(1, 'rgba(226,161,61,0)')
    ctx.fillStyle = g1
    ctx.fillRect(0, 0, 512, 640)
    const g2 = ctx.createRadialGradient(340, 420, 30, 340, 420, 280)
    g2.addColorStop(0, 'rgba(201,106,62,0.42)')
    g2.addColorStop(1, 'rgba(201,106,62,0)')
    ctx.fillStyle = g2
    ctx.fillRect(0, 0, 512, 640)
    const g3 = ctx.createRadialGradient(260, 520, 20, 260, 520, 220)
    g3.addColorStop(0, 'rgba(113,129,95,0.35)')
    g3.addColorStop(1, 'rgba(113,129,95,0)')
    ctx.fillStyle = g3
    ctx.fillRect(0, 0, 512, 640)
    ctx.strokeStyle = 'rgba(58,53,46,0.6)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(90, 520)
    ctx.bezierCurveTo(180, 380, 300, 430, 380, 260)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(140, 160)
    ctx.quadraticCurveTo(260, 90, 420, 150)
    ctx.stroke()
  })
}

/** 木地板：条板 + 顺纹 */
export function woodFloorTexture(): THREE.CanvasTexture {
  const tex = make('floor', 512, 512, (ctx) => {
    const rnd = mulberry32(42)
    ctx.fillStyle = palette.floor
    ctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 16; i++) {
      const y = i * 32
      ctx.fillStyle = i % 2 === 0 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.035)'
      ctx.fillRect(0, y, 512, 32)
      ctx.fillStyle = 'rgba(90,62,34,0.4)'
      ctx.fillRect(0, y, 512, 1.6)
      ctx.strokeStyle = 'rgba(120,86,50,0.25)'
      ctx.lineWidth = 1
      for (let g = 0; g < 5; g++) {
        const gy = y + 4 + rnd() * 24
        ctx.beginPath()
        ctx.moveTo(0, gy)
        ctx.bezierCurveTo(160, gy + rnd() * 5 - 2.5, 340, gy + rnd() * 5 - 2.5, 512, gy)
        ctx.stroke()
      }
    }
  })
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2.2, 2.2)
  return tex
}

/** 米色地毯：双层边线 + 淡菱格 */
export function rugTexture(): THREE.CanvasTexture {
  return make('rug', 256, 256, (ctx) => {
    ctx.fillStyle = palette.rug
    ctx.fillRect(0, 0, 256, 256)
    ctx.strokeStyle = 'rgba(58,53,46,0.5)'
    ctx.lineWidth = 5
    ctx.strokeRect(14, 14, 228, 228)
    ctx.lineWidth = 2
    ctx.strokeRect(26, 26, 204, 204)
    ctx.strokeStyle = 'rgba(138,106,72,0.3)'
    ctx.lineWidth = 1.4
    for (let i = -4; i < 9; i++) {
      ctx.beginPath()
      ctx.moveTo(i * 32 + 64, 30)
      ctx.lineTo(i * 32 - 64, 226)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(i * 32 - 64, 30)
      ctx.lineTo(i * 32 + 64, 226)
      ctx.stroke()
    }
  })
}

/** 克制的奶油色抽象地毯：低对比细线、轻微织物噪声。 */
export function minimalRugTexture(): THREE.CanvasTexture {
  return make('minimal-rug-v2', 512, 512, (ctx) => {
    const rnd = mulberry32(913)
    ctx.fillStyle = '#ddd3c3'
    ctx.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 8000; i++) {
      const a = 0.025 + rnd() * 0.035
      ctx.fillStyle = rnd() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(128,103,78,${a})`
      ctx.fillRect(rnd() * 512, rnd() * 512, 1, 1)
    }
    ctx.strokeStyle = 'rgba(132,112,91,0.16)'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(96, 330)
    ctx.bezierCurveTo(160, 250, 260, 250, 342, 310)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(142, 384)
    ctx.bezierCurveTo(238, 318, 322, 350, 402, 420)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(132,112,91,0.12)'
    ctx.lineWidth = 1.4
    ctx.strokeRect(128, 126, 198, 126)
    ctx.beginPath()
    ctx.moveTo(318, 126)
    ctx.lineTo(392, 210)
    ctx.lineTo(326, 252)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(162, 180, 46, 0.1, Math.PI * 1.28)
    ctx.stroke()
  })
}

/** 一体机屏幕：柔和虚化自然风景壁纸，无文字。 */
export function monitorWallpaperTexture(): THREE.CanvasTexture {
  return make('monitor-wallpaper-soft', 512, 288, (ctx) => {
    const sky = ctx.createLinearGradient(0, 0, 0, 288)
    sky.addColorStop(0, '#dce9e8')
    sky.addColorStop(0.45, '#dfe8dd')
    sky.addColorStop(1, '#f2ead8')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, 512, 288)

    const hill1 = ctx.createLinearGradient(0, 120, 0, 288)
    hill1.addColorStop(0, 'rgba(118,143,114,0.18)')
    hill1.addColorStop(1, 'rgba(118,143,114,0.02)')
    ctx.fillStyle = hill1
    ctx.beginPath()
    ctx.moveTo(0, 200)
    ctx.bezierCurveTo(130, 130, 260, 230, 512, 150)
    ctx.lineTo(512, 288)
    ctx.lineTo(0, 288)
    ctx.closePath()
    ctx.fill()

    const glow = ctx.createRadialGradient(350, 90, 20, 350, 90, 230)
    glow.addColorStop(0, 'rgba(255,246,223,0.65)')
    glow.addColorStop(1, 'rgba(255,246,223,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 512, 288)

    ctx.globalAlpha = 0.28
    ctx.filter = 'blur(18px)'
    ctx.fillStyle = '#a7c2b4'
    ctx.beginPath()
    ctx.ellipse(190, 154, 96, 40, -0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#c9b889'
    ctx.beginPath()
    ctx.ellipse(340, 200, 130, 56, -0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.filter = 'none'
    ctx.globalAlpha = 1
  })
}

/** 桌面纸本：暖白 + 淡横线/速写 */
export function paperTexture(variant = 0): THREE.CanvasTexture {
  return make(`paper-${variant}`, 256, 192, (ctx) => {
    const rnd = mulberry32(variant * 331 + 7)
    ctx.fillStyle = palette.paper
    ctx.fillRect(0, 0, 256, 192)
    if (variant % 2 === 0) {
      ctx.strokeStyle = 'rgba(58,53,46,0.35)'
      ctx.lineWidth = 1.6
      for (let i = 0; i < 6; i++) {
        const y = 40 + i * 22
        ctx.beginPath()
        ctx.moveTo(28, y)
        ctx.bezierCurveTo(90, y + rnd() * 6 - 3, 170, y + rnd() * 6 - 3, 230, y)
        ctx.stroke()
      }
    } else {
      ctx.strokeStyle = 'rgba(58,53,46,0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(40, 150)
      ctx.quadraticCurveTo(128, 40 + rnd() * 40, 220, 140)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(120, 90, 34, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(58,53,46,0.14)'
    ctx.strokeRect(0.5, 0.5, 255, 191)
  })
}

/** 书脊排（矮柜/搁板上的书堆侧面） */
export function bookRowTexture(seed: number): THREE.CanvasTexture {
  return make(`books-${seed}`, 256, 64, (ctx) => {
    const rnd = mulberry32(seed * 77 + 3)
    const colors = ['#71815f', '#c96a3e', '#e2a13d', '#8a6a48', '#5b564c', '#b0895c', '#5c6b4d']
    let x = 0
    while (x < 256) {
      const w = 14 + rnd() * 22
      ctx.fillStyle = colors[Math.floor(rnd() * colors.length)]
      ctx.fillRect(x, 6 + rnd() * 10, w - 2, 58)
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.fillRect(x + 3, 14, w - 8, 2)
      x += w
    }
  })
}

/** 渐变天空纹理（预留给需要窗景的场景）。 */
export function skyTexture(top: string, bottom: string): THREE.CanvasTexture {
  return make(`sky-${top}-${bottom}`, 8, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256)
    g.addColorStop(0, top)
    g.addColorStop(1, bottom)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 8, 256)
  })
}

/** 笔记本电脑屏幕：个人作品集站点小样 */
export function laptopScreenTexture(): THREE.CanvasTexture {
  return make('laptop', 512, 320, (ctx) => {
    ctx.fillStyle = '#fbf8f0'
    ctx.fillRect(0, 0, 512, 320)
    ctx.fillStyle = '#71815f'
    ctx.fillRect(0, 0, 512, 44)
    ctx.fillStyle = '#fdfaf3'
    ctx.font = '700 20px sans-serif'
    ctx.fillText('个人作品集', 18, 30)
    const tones = ['#e2a13d', '#c96a3e', '#8a6a48', '#5c6b4d', '#b0895c', '#5b564c']
    for (let i = 0; i < 6; i++) {
      const x = 18 + (i % 3) * 162
      const y = 66 + Math.floor(i / 3) * 118
      ctx.fillStyle = tones[i]
      ctx.fillRect(x, y, 146, 62)
      ctx.fillStyle = 'rgba(0,0,0,0.14)'
      ctx.fillRect(x, y + 62, 146, 14)
      ctx.fillStyle = '#fbf8f0'
      ctx.fillRect(x + 10, y + 66, 80, 6)
    }
  })
}

/** 右墙作品钉墙：单幅小画（更粗糙的速写感） */
export function pinArtTexture(variant: number): THREE.CanvasTexture {
  return make(`pin-${variant}`, 128, 96, (ctx) => {
    const rnd = mulberry32(variant * 517 + 29)
    const bgs = ['#f6f1e6', '#efe6d2', '#f0e8d8', '#e9dfc8', '#f4efe4']
    ctx.fillStyle = bgs[variant % bgs.length]
    ctx.fillRect(0, 0, 128, 96)
    const inks = ['rgba(58,53,46,0.75)', 'rgba(92,107,77,0.7)', 'rgba(201,106,62,0.6)', 'rgba(91,86,76,0.65)']
    ctx.strokeStyle = inks[variant % inks.length]
    ctx.lineWidth = 1.8
    ctx.lineCap = 'round'
    const n = 2 + Math.floor(rnd() * 3)
    for (let i = 0; i < n; i++) {
      ctx.beginPath()
      const x = rnd() * 100 + 12
      const y = rnd() * 70 + 12
      if (rnd() > 0.5) {
        ctx.arc(x, y, 6 + rnd() * 16, 0, Math.PI * 2)
      } else {
        ctx.moveTo(x, y)
        ctx.quadraticCurveTo(x + 20, y - 18, x + 40 + rnd() * 30, y + 8)
      }
      ctx.stroke()
    }
    if (variant % 4 === 0) {
      ctx.fillStyle = 'rgba(226,161,61,0.35)'
      ctx.fillRect(10, 10, 108, 76)
    }
  })
}
