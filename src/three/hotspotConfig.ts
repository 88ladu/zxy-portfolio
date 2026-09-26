// 热点定义：物件中心、悬停标签与聚焦机位。
// 家具移位时，同步修改 position 与 cameraPos/cameraLook。

export type HotspotId = 'profile' | 'shelves' | 'desk' | 'chair' | 'easel' | 'gallery'

export interface HotspotDef {
  id: HotspotId
  label: string
  /** 三维热点标记位置 */
  position: [number, number, number]
  /** 聚焦时相机位置与注视点（保持在房间内部，避免穿墙） */
  cameraPos: [number, number, number]
  cameraLook: [number, number, number]
}

export const HOTSPOTS: HotspotDef[] = [
  {
    id: 'desk',
    label: '桌面项目',
    position: [0.55, 1.42, -2.02],
    cameraPos: [2.35, 1.86, -0.12],
    cameraLook: [0.55, 1.04, -2.02],
  },
  {
    id: 'chair',
    label: '关于我',
    position: [0.52, 1.25, -0.78],
    cameraPos: [2.35, 1.72, 1.35],
    cameraLook: [0.52, 0.82, -0.78],
  },
  {
    id: 'gallery',
    label: '作品集',
    position: [0.45, 3.08, -4.22],
    cameraPos: [1.25, 2.45, -1.45],
    cameraLook: [0.45, 2.95, -4.65],
  },
  {
    id: 'easel',
    label: '灵感簿',
    position: [3.18, 1.52, -2.22],
    cameraPos: [2.15, 1.85, 0.05],
    cameraLook: [3.18, 1.2, -2.24],
  },
]

export const HOTSPOT_BY_ID: Record<HotspotId, HotspotDef> = Object.fromEntries(
  HOTSPOTS.map((h) => [h.id, h]),
) as Record<HotspotId, HotspotDef>
