// 与 photo-spec.json / styles.css 保持一致的色板。
// 只接受六位十六进制颜色。

export interface Palette {
  wall: string
  floor: string
  floorDark: string
  rug: string
  charcoal: string
  deskWood: string
  deskWoodDark: string
  linen: string
  paper: string
  sage: string
  clay: string
  amber: string
  metal: string
}

export const palette: Palette = {
  wall: '#eeeae1',
  floor: '#d1af82',
  floorDark: '#c09a68',
  rug: '#ddd3c3',
  charcoal: '#4b4036',
  deskWood: '#c9a477',
  deskWoodDark: '#8b6746',
  linen: '#f1e8d8',
  paper: '#f8f0e2',
  sage: '#6f835f',
  clay: '#c77f50',
  amber: '#dfad61',
  metal: '#9a948a',
}
