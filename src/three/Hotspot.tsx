// 3D 热点：公告牌圆环 + 悬停标签；点击聚焦（拖动后不触发）。
import { Billboard, Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useApp, dragState } from '@/store'
import { HOTSPOTS, type HotspotDef } from './hotspotConfig'

export function HotspotMarkers() {
  const mode = useApp((s) => s.mode)
  if (mode === 'intro' || mode === 'focus') return null
  return (
    <>
      {HOTSPOTS.map((h) => (
        <Marker key={h.id} def={h} />
      ))}
    </>
  )
}

function Marker({ def }: { def: HotspotDef }) {
  const setHovered = useApp((s) => s.setHovered)
  const focus = useApp((s) => s.focus)
  const hovered = useApp((s) => s.hovered === def.id)
  const activeId = useApp((s) => s.activeId)
  const hint = useApp((s) => !s.activeId && s.mode === 'orbit')

  if (activeId && activeId !== def.id) return null

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    setHovered(def.id)
  }
  const onOut = () => {
    document.body.style.cursor = ''
    setHovered(null)
  }

  return (
    <group position={def.position}>
      <Billboard>
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            if (dragState.moved) return
            focus(def.id)
          }}
          onPointerOver={onOver}
          onPointerOut={onOut}
        >
          <circleGeometry args={[0.17, 24]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.05, 0.072, 28]} />
          <meshBasicMaterial color={hovered ? '#c96a3e' : '#fdfaf3'} transparent opacity={0.95} toneMapped={false} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.024, 16]} />
          <meshBasicMaterial color="#c96a3e" toneMapped={false} />
        </mesh>
      </Billboard>
      <Html position={[0, 0.15, 0]} center zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`hotspot-label${hovered ? ' is-hover' : ''}${hint ? ' is-hint' : ''}`}>
          <span>
            <em>{def.label}</em>
          </span>
        </div>
      </Html>
    </group>
  )
}
