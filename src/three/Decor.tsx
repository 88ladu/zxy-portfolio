// 陈设：画架与大画布、左侧小画架与推车、绿植、地毯、小猫以外的装饰。
import { useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { palette } from './palette'
import { dragState, useApp } from '@/store'
import { getEnv } from './environment'
import { artTexture, bookRowTexture, paperTexture } from './textures'
import { FbxPlant } from './FbxPlant'
import { DeferredGlbModel } from './GlbModel'

export function Decor() {
  const season = useApp((s) => s.season)
  const time = useApp((s) => s.time)
  const lowSpec = useApp((s) => s.lowSpec)
  const mode = useApp((s) => s.mode)
  const focus = useApp((s) => s.focus)
  const env = useMemo(() => getEnv(season, time), [season, time])

  const mats = useMemo(
    () => ({
      leg: new THREE.MeshStandardMaterial({ color: palette.deskWoodDark, roughness: 0.72 }),
      wood: new THREE.MeshStandardMaterial({ color: palette.deskWood, roughness: 0.75 }),
      clay: new THREE.MeshStandardMaterial({ color: palette.clay, roughness: 0.8 }),
      linen: new THREE.MeshStandardMaterial({ color: palette.linen, roughness: 0.9 }),
      paper: new THREE.MeshStandardMaterial({ color: palette.paper, roughness: 0.92 }),
      plainCanvas: new THREE.MeshStandardMaterial({ color: '#f3ecdd', roughness: 0.95, side: THREE.DoubleSide }),
    }),
    [],
  )
  const plainSheet = useMemo(() => paperTexture(0), [])
  const interactive = mode !== 'intro'
  const hoverCursor = (on: boolean) => {
    document.body.style.cursor = on ? 'pointer' : ''
  }
  const openPortfolio = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (interactive && !dragState.moved) focus('easel')
  }

  return (
    <group>
      {/* ── 参考图式奶油色软地毯：干净、低对比、轻微绒感。 ── */}
      <CozyReferenceRug />

      {/* ── 黄色框：用户提供的新柜子，靠左墙收纳展示。 ── */}
      <group position={[-4.06, 0, -2.35]} rotation={[0, Math.PI / 2, 0]}>
        <DeferredGlbModel url="/models/new-cabinet.optimized.glb" fit="height" size={1.62} position={[0, 0, 0]} delay={650} />
        <pointLight position={[0.02, 1.18, 0.05]} color="#ffd9a5" intensity={0.18} distance={1.35} decay={2} />
        <group position={[0, 1.52, -0.18]}>
          <mesh position={[-0.28, 0.08, 0]} castShadow>
            <boxGeometry args={[0.36, 0.18, 0.22]} />
            <meshStandardMaterial map={bookRowTexture(4)} roughness={0.82} />
          </mesh>
          <mesh position={[0.28, 0.08, 0.02]} castShadow>
            <cylinderGeometry args={[0.075, 0.065, 0.16, 16]} />
            <meshStandardMaterial color="#efe5d4" roughness={0.86} />
          </mesh>
        </group>
      </group>

      {/* ── 绿色框：用户提供的新画架，替换旧的大型程序化画架。 ── */}
      <group
        position={[3.25, 0, -2.25]}
        rotation={[0, -0.55, 0]}
        onClick={openPortfolio}
        onPointerOver={() => interactive && hoverCursor(true)}
        onPointerOut={() => hoverCursor(false)}
      >
        <DeferredGlbModel url="/models/new-easel.optimized.glb" fit="height" size={1.5} position={[0, 0, 0]} delay={900} />
        <mesh position={[0, 0.86, 0]} visible={false}>
          <boxGeometry args={[1.0, 1.7, 0.75]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      {/* ── 右侧墙面装饰画：平衡窗户和画架附近的留白。 ── */}
      <DeferredGlbModel
        url="/models/decor-art.optimized.glb"
        fit="height"
        size={1.22}
        position={[4.5, 1.48, -2.72]}
        rotation={[0, Math.PI / 2, 0]}
        delay={1200}
      />

      {/* ── 左侧小画架 ── */}
      <group position={[-3.95, 0, 2.5]} rotation={[0, 0.6, 0]}>
        <mesh position={[-0.22, 0.75, 0.03]} rotation={[0, 0, 0.22]} material={mats.leg} castShadow>
          <boxGeometry args={[0.06, 1.55, 0.045]} />
        </mesh>
        <mesh position={[0.22, 0.75, 0.03]} rotation={[0, 0, -0.22]} material={mats.leg} castShadow>
          <boxGeometry args={[0.06, 1.55, 0.045]} />
        </mesh>
        <mesh position={[0, 0.76, 0.38]} rotation={[0.3, 0, 0]} material={mats.leg} castShadow>
          <boxGeometry args={[0.06, 1.6, 0.045]} />
        </mesh>
        <mesh position={[0, 1.0, 0.02]} rotation={[-0.06, 0, 0]} material={mats.plainCanvas}>
          <planeGeometry args={[0.85, 1.1]} />
        </mesh>
        <mesh position={[0, 0.42, 0.05]} material={mats.leg}>
          <boxGeometry args={[0.7, 0.04, 0.1]} />
        </mesh>
      </group>

      {/* ── 带轮木推车（左前） ── */}
      <group position={[-4.05, 0, 0.9]} rotation={[0, 0.15, 0]}>
        {[0.45, 0.82].map((y) => (
          <mesh key={y} position={[0, y, 0]} material={mats.wood} castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.04, 0.5]} />
          </mesh>
        ))}
        {[
          [-0.38, -0.2],
          [0.38, -0.2],
          [-0.38, 0.2],
          [0.38, 0.2],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.45, z]} material={mats.leg}>
            <cylinderGeometry args={[0.018, 0.018, 0.9, 10]} />
          </mesh>
        ))}
        {[
          [-0.34, -0.18],
          [0.34, -0.18],
          [-0.34, 0.18],
          [0.34, 0.18],
        ].map(([x, z]) => (
          <mesh key={`w${x}${z}`} position={[x, 0.045, z]}>
            <sphereGeometry args={[0.045, 10, 8]} />
            <meshStandardMaterial color="#3c3936" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[-0.15, 0.58, 0.02]} rotation={[0, 0.2, 0]} material={mats.paper} castShadow>
          <boxGeometry args={[0.4, 0.1, 0.3]} />
        </mesh>
        <mesh position={[0.18, 0.9, -0.05]} rotation={[0, -0.15, 0]} material={mats.paper} castShadow>
          <boxGeometry args={[0.36, 0.08, 0.28]} />
        </mesh>
      </group>

      {/* ── 绿植（用户提供 FBX 模型；流畅模式回退为程序化简化绿植） ── */}
      {lowSpec ? (
        <group position={[-3.35, 0, -3.85]}>
          <mesh position={[0, 0.17, 0]} material={mats.clay} castShadow>
            <cylinderGeometry args={[0.24, 0.19, 0.34, 18]} />
          </mesh>
          <mesh position={[0, 0.52, 0]} material={mats.leg} castShadow>
            <cylinderGeometry args={[0.03, 0.045, 0.45, 10]} />
          </mesh>
          <Foliage color={env.foliage} />
        </group>
      ) : (
        <FbxPlant position={[-3.35, 0, -3.85]} height={1.55} rotationY={0.6} />
      )}
      <DeferredGlbModel
        url="/models/orchid.glb"
        fit="height"
        size={0.46}
        position={[2.3, 0.92, -4.35]}
        rotation={[0, -0.25, 0]}
        delay={900}
      />
      <group position={[-2.55, 0, 3.6]}>
        <mesh position={[0, 0.12, 0]} material={mats.linen} castShadow>
          <cylinderGeometry args={[0.14, 0.12, 0.24, 14]} />
        </mesh>
        <mesh position={[0, 0.36, 0]} castShadow>
          <icosahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial color={env.foliage} roughness={1} flatShading />
        </mesh>
      </group>

      {/* ── 地面零散纸本 ── */}
      <mesh position={[-2.9, 0.012, 1.6]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <planeGeometry args={[0.42, 0.56]} />
        <meshStandardMaterial map={plainSheet} roughness={0.95} />
      </mesh>
      <mesh position={[-1.4, 0.012, -3.3]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <planeGeometry args={[0.5, 0.66]} />
        <meshStandardMaterial map={plainSheet} roughness={0.95} />
      </mesh>
      {/* 靠墙小画 */}
      <mesh position={[-4.56, 1.5, -1.6]} rotation={[0, Math.PI / 2, 0.04]}>
        <planeGeometry args={[0.52, 0.68]} />
        <meshStandardMaterial map={artTexture(6)} roughness={0.92} />
      </mesh>
      <mesh position={[-4.56, 1.2, 2.9]} rotation={[0, Math.PI / 2, -0.03]}>
        <planeGeometry args={[0.44, 0.58]} />
        <meshStandardMaterial map={artTexture(3)} roughness={0.92} />
      </mesh>
    </group>
  )
}

function CozyReferenceRug() {
  const texture = useMemo(() => softRugTexture(), [])
  const shape = useMemo(() => {
    const pts: THREE.Vector2[] = []
    const count = 96
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const wobble = 1 + Math.sin(a * 2.2 + 0.4) * 0.035 + Math.cos(a * 3.1 - 0.8) * 0.025
      const rx = 2.42 * wobble
      const rz = 1.48 * (1 + Math.sin(a * 2.6 - 0.2) * 0.03)
      pts.push(new THREE.Vector2(Math.cos(a) * rx, Math.sin(a) * rz))
    }
    return new THREE.Shape(pts)
  }, [])

  return (
    <group position={[0.52, 0.017, -0.78]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shapeGeometry args={[shape, 24]} />
        <meshStandardMaterial
          map={texture}
          color="#ded6c9"
          roughness={0.98}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shapeGeometry args={[shape, 12]} />
        <meshStandardMaterial color="#cfc5b7" roughness={1} transparent opacity={0.38} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function softRugTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ded6c9'
  ctx.fillRect(0, 0, 512, 512)
  let seed = 721
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
  for (let i = 0; i < 15000; i++) {
    const x = rnd() * 512
    const y = rnd() * 512
    const alpha = 0.025 + rnd() * 0.07
    ctx.fillStyle = rnd() > 0.52 ? `rgba(255,255,255,${alpha})` : `rgba(154,136,114,${alpha * 0.42})`
    ctx.fillRect(x, y, 1 + rnd() * 1.4, 1)
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  for (let y = 0; y < 512; y += 7) {
    ctx.beginPath()
    ctx.moveTo(0, y + rnd() * 2)
    ctx.bezierCurveTo(150, y + rnd() * 4 - 2, 350, y + rnd() * 4 - 2, 512, y + rnd() * 2)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2.2, 1.55)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

function Foliage({ color }: { color: string }) {
  const blobs = useMemo(
    () =>
      [
        [0, 1.05, 0, 0.38],
        [0.22, 0.95, 0.1, 0.3],
        [-0.2, 1.0, -0.08, 0.28],
        [0.05, 1.3, -0.05, 0.3],
        [-0.12, 1.22, 0.14, 0.24],
      ] as const,
    [],
  )
  return (
    <group>
      {blobs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color={color} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}
