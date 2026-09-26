import { create } from 'zustand'
import type { HotspotId } from '@/three/hotspotConfig'
import type { Season, TimeOfDay } from '@/three/environment'

export type Mode = 'intro' | 'orbit' | 'focus'
export type OverlayId = 'overview' | 'books' | 'drawer' | 'photos' | 'desktop' | null

interface AppState {
  ready: boolean
  webgl: boolean
  mode: Mode
  activeId: HotspotId | null
  overlay: OverlayId
  season: Season
  time: TimeOfDay
  deskLampOn: boolean
  musicOn: boolean
  lowSpec: boolean
  fallback: boolean
  hovered: HotspotId | null
  resetTick: number
  setReady: (v: boolean) => void
  setWebgl: (v: boolean) => void
  enter: () => void
  focus: (id: HotspotId) => void
  closeFocus: () => void
  resetView: () => void
  setSeason: (s: Season) => void
  setTime: (t: TimeOfDay) => void
  toggleDeskLamp: () => void
  setMusicOn: (v: boolean) => void
  setLowSpec: (v: boolean) => void
  setFallback: (v: boolean) => void
  setOverlay: (o: OverlayId) => void
  setHovered: (id: HotspotId | null) => void
}

export const useApp = create<AppState>((set, get) => ({
  ready: false,
  webgl: true,
  mode: 'intro',
  activeId: null,
  overlay: null,
  season: 'autumn',
  time: 'noon',
  deskLampOn: false,
  musicOn: false,
  lowSpec: false,
  fallback: false,
  hovered: null,
  resetTick: 0,
  setReady: (v) => set({ ready: v }),
  setWebgl: (v) => set({ webgl: v }),
  enter: () => {
    if (get().mode === 'intro') set({ mode: 'orbit' })
  },
  focus: (id) => set({ activeId: id, mode: 'focus', overlay: null }),
  closeFocus: () => set({ activeId: null, mode: 'orbit' }),
  resetView: () =>
    set((s) => ({
      activeId: null,
      overlay: null,
      mode: s.mode === 'intro' ? 'intro' : 'orbit',
      resetTick: s.resetTick + 1,
    })),
  setSeason: (season) => set({ season }),
  setTime: (time) => set({ time }),
  toggleDeskLamp: () => set((s) => ({ deskLampOn: !s.deskLampOn })),
  setMusicOn: (musicOn) => set({ musicOn }),
  setLowSpec: (lowSpec) => set({ lowSpec }),
  setFallback: (fallback) => set({ fallback }),
  setOverlay: (overlay) => set({ overlay }),
  setHovered: (hovered) => set({ hovered }),
}))

/** 供 3D 事件循环读写的非响应式拖动状态：区分“点击”与“拖动环绕”。 */
export const dragState = { moved: false }
