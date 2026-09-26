// 四季 × 四时段的环境参数。getEnv 为纯函数，UI 与场景共用。

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type TimeOfDay = 'dawn' | 'noon' | 'dusk' | 'night'

export const SEASONS: { id: Season; label: string }[] = [
  { id: 'spring', label: '春' },
  { id: 'summer', label: '夏' },
  { id: 'autumn', label: '秋' },
  { id: 'winter', label: '冬' },
]

export const TIMES: { id: TimeOfDay; label: string }[] = [
  { id: 'noon', label: '正午' },
  { id: 'dusk', label: '黄昏' },
  { id: 'night', label: '夜晚' },
]

export interface EnvParams {
  background: string
  skyTop: string
  skyBottom: string
  sunPos: [number, number, number]
  sunColor: string
  sunIntensity: number
  ambientColor: string
  ambientIntensity: number
  exposure: number
  lampOn: boolean
  foliage: string
}

const TIME_BASE: Record<TimeOfDay, Omit<EnvParams, 'foliage'>> = {
  dawn: {
    background: '#e9ddc9',
    skyTop: '#ffe9c8',
    skyBottom: '#b9d2e6',
    sunPos: [-8.5, 3.6, -1.2],
    sunColor: '#ffd9a8',
    sunIntensity: 2.1,
    ambientColor: '#cfd8e8',
    ambientIntensity: 0.52,
    exposure: 1.0,
    lampOn: false,
  },
  noon: {
    background: '#f0e9dd',
    skyTop: '#dbe8e6',
    skyBottom: '#fff7ed',
    sunPos: [-4.8, 7.8, 2.1],
    sunColor: '#fff1d7',
    sunIntensity: 2.15,
    ambientColor: '#f3e8d8',
    ambientIntensity: 1.02,
    exposure: 1.08,
    lampOn: false,
  },
  dusk: {
    background: '#eadfd2',
    skyTop: '#eecaa4',
    skyBottom: '#ded0bf',
    sunPos: [-8.7, 2.8, 2.2],
    sunColor: '#ffd5a1',
    sunIntensity: 1.28,
    ambientColor: '#ead6c2',
    ambientIntensity: 0.9,
    exposure: 1.0,
    lampOn: true,
  },
  night: {
    background: '#2b2928',
    skyTop: '#1f2535',
    skyBottom: '#453f4d',
    sunPos: [-4.2, 6.2, -2.0],
    sunColor: '#c0b3a3',
    sunIntensity: 0.52,
    ambientColor: '#5a4b42',
    ambientIntensity: 0.48,
    exposure: 0.92,
    lampOn: true,
  },
}

const SEASON_FOLIAGE: Record<Season, string> = {
  spring: '#8fae6b',
  summer: '#5f7d4a',
  autumn: '#c07a3a',
  winter: '#9a8a76',
}

// 季节对光线的轻微修正（暖/冷、强/弱）
const SEASON_TINT: Record<Season, { warm: number; dim: number }> = {
  spring: { warm: 0.02, dim: 0.0 },
  summer: { warm: -0.01, dim: -0.08 },
  autumn: { warm: 0.05, dim: 0.0 },
  winter: { warm: -0.03, dim: 0.1 },
}

function shiftColor(hex: string, warm: number): string {
  // warm > 0 偏暖（R↑ B↓），< 0 偏冷
  const n = parseInt(hex.slice(1), 16)
  let r = (n >> 16) & 255
  let g = (n >> 8) & 255
  let b = n & 255
  r = Math.min(255, Math.max(0, Math.round(r + warm * 90)))
  b = Math.min(255, Math.max(0, Math.round(b - warm * 70)))
  const to2 = (v: number) => v.toString(16).padStart(2, '0')
  return `#${to2(r)}${to2(g)}${to2(b)}`
}

export function getEnv(season: Season, time: TimeOfDay): EnvParams {
  const base = TIME_BASE[time]
  const tint = SEASON_TINT[season]
  return {
    ...base,
    sunColor: shiftColor(base.sunColor, tint.warm),
    ambientColor: shiftColor(base.ambientColor, tint.warm * 0.5),
    sunIntensity: Math.max(0.2, base.sunIntensity * (1 - tint.dim)),
    foliage: SEASON_FOLIAGE[season],
  }
}
