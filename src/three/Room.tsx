// 房间本体：地面、平直墙体、简化搁板、后墙作品板与窗户。
// 坐标约定：y 向上，后墙在 -z，左墙在 -x。
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { useFrame, useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { palette } from './palette'
import { dragState, useApp } from '@/store'
import { navigateToPage } from '@/navigation'
import { WindowModel } from './WindowModel'
import { GlbModel } from './GlbModel'
import { toggleCassetteMusic } from '@/music'
import {
  artTexture,
  woodFloorTexture,
  pinArtTexture,
  bookRowTexture,
} from './textures'

export function Room() {
  const mode = useApp((s) => s.mode)
  const season = useApp((s) => s.season)
  const activeId = useApp((s) => s.activeId)
  const focus = useApp((s) => s.focus)
  const setMusicOn = useApp((s) => s.setMusicOn)

  const mats = useMemo(
    () => ({
      wall: new THREE.MeshStandardMaterial({ color: palette.wall, roughness: 0.96 }),
      cork: new THREE.MeshStandardMaterial({ color: '#cda978', roughness: 0.9 }),
      woodTrim: new THREE.MeshStandardMaterial({ color: palette.deskWoodDark, roughness: 0.7 }),
    }),
    [],
  )

  const floorTex = useMemo(() => woodFloorTexture(), [])
  const interactive = mode !== 'intro'
  const hoverCursor = (on: boolean) => {
    document.body.style.cursor = on ? 'pointer' : ''
  }
  const stop = (e: ThreeEvent<MouseEvent>) => e.stopPropagation()
  const openPortfolio = (e: ThreeEvent<MouseEvent>) => {
    stop(e)
    if (interactive && !dragState.moved) focus('gallery')
  }
  const playMusic = (e: ThreeEvent<MouseEvent>) => {
    stop(e)
    if (interactive && !dragState.moved) setMusicOn(toggleCassetteMusic())
  }
  const [hoveredWork, setHoveredWork] = useState<number | null>(null)

  return (
    <group>
      {/* 地面 */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[9.2, 9.4]} />
        <meshStandardMaterial map={floorTex} roughness={0.85} />
      </mesh>

      {/* 平直后墙与左右墙，去掉建筑结构后直接延伸到顶。 */}
      <mesh position={[0, 2.6, -4.68]} material={mats.wall} receiveShadow>
        <boxGeometry args={[9.2, 5.2, 0.16]} />
      </mesh>
      <mesh position={[-4.68, 2.6, 0]} material={mats.wall} receiveShadow castShadow>
        <boxGeometry args={[0.16, 5.2, 9.4]} />
      </mesh>
      <mesh position={[4.68, 2.6, 0]} material={mats.wall} receiveShadow>
        <boxGeometry args={[0.16, 5.2, 9.4]} />
      </mesh>

      {/* 左上搁板：简化黄色区域，只保留少量书和小画框。 */}
      <mesh position={[-2.55, 2.9, -4.55]} material={mats.wall} castShadow>
        <boxGeometry args={[2.65, 0.055, 0.25]} />
      </mesh>
      <mesh position={[-2.55, 2.18, -4.55]} material={mats.wall} castShadow>
        <boxGeometry args={[2.65, 0.055, 0.25]} />
      </mesh>
      <LeanArt x={-3.18} y={2.94} z={-4.5} w={0.46} h={0.58} v={5} />
      <mesh position={[-2.45, 3.06, -4.5]} castShadow>
        <boxGeometry args={[0.52, 0.24, 0.22]} />
        <meshStandardMaterial map={bookRowTexture(1)} roughness={0.85} />
      </mesh>
      <mesh position={[-3.05, 2.32, -4.5]} castShadow>
        <cylinderGeometry args={[0.065, 0.07, 0.22, 16]} />
        <meshStandardMaterial color="#d8cdb6" roughness={0.8} />
      </mesh>
      <mesh position={[-2.42, 2.31, -4.5]} castShadow>
        <boxGeometry args={[0.42, 0.2, 0.22]} />
        <meshStandardMaterial color={palette.linen} roughness={0.9} />
      </mesh>

      {/* 蓝色区域：作品集板块移到后墙中部。 */}
      <group
        position={[0.45, 2.45, -4.57]}
        onClick={openPortfolio}
        onPointerOver={() => interactive && hoverCursor(true)}
        onPointerOut={() => hoverCursor(false)}
      >
        <mesh material={mats.woodTrim} receiveShadow>
          <boxGeometry args={[2.45, 1.55, 0.05]} />
        </mesh>
        <mesh position={[0, 0, 0.032]} material={mats.cork}>
          <planeGeometry args={[2.25, 1.35]} />
        </mesh>
        {Array.from({ length: 3 }, (_, r) =>
          Array.from({ length: 4 }, (_, c) => {
            const index = r * 4 + c
            const x = -0.78 + c * 0.52
            const y = 0.42 - r * 0.42
            return (
              <group
                key={`portfolio${r}${c}`}
                position={[x, y, activeId === 'gallery' && hoveredWork === index ? 0.078 : 0.065]}
                scale={activeId === 'gallery' && hoveredWork === index ? 1.035 : 1}
                rotation={[0, 0, r % 2 === 0 ? 0.03 : -0.03]}
                onPointerOver={(e) => {
                  if (activeId !== 'gallery') return
                  e.stopPropagation()
                  document.body.style.cursor = 'pointer'
                  setHoveredWork(index)
                }}
                onPointerOut={() => {
                  document.body.style.cursor = ''
                  setHoveredWork(null)
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (dragState.moved) return
                  if (activeId === 'gallery') navigateToPage('portfolio')
                  else focus('gallery')
                }}
              >
                <mesh>
                  <planeGeometry args={[0.36, 0.27]} />
                  <meshStandardMaterial map={pinArtTexture((r * 4 + c) % 8)} roughness={0.92} />
                </mesh>
                <mesh position={[0, 0.155, 0.01]}>
                  <boxGeometry args={[0.012, 0.035, 0.04]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.6} transparent opacity={0.78} />
                </mesh>
                {activeId === 'gallery' && hoveredWork === index && (
                  <Html position={[0.02, -0.28, 0.08]} center zIndexRange={[70, 0]} style={{ pointerEvents: 'none' }}>
                    <div className="work-card-tip">
                      <strong>{['数字文化展览', '空间叙事', 'AI 影像实验'][index % 3]}</strong>
                      <span>{['DIGITAL EXHIBITION', 'SPATIAL STORY', 'AI VISUAL STUDY'][index % 3]}</span>
                      <small>2025</small>
                    </div>
                  </Html>
                )}
              </group>
            )
          }),
        )}
      </group>

      {/* 黄色区域：放大窗户模型。 */}
      <SeasonWindowView season={season} />
      <WindowModel position={[3.0, 2.38, -4.54]} height={1.95} rotationY={0} />

      {/* 暖深色四屉矮柜与柜面书堆 */}
      <mesh
        position={[0.1, 0.46, -4.38]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4.9, 0.92, 0.55]} />
        <meshStandardMaterial color="#816750" roughness={0.72} />
      </mesh>
      {[-1.75, -0.58, 0.58, 1.75].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.5, -4.09]}>
            <boxGeometry args={[1.1, 0.68, 0.03]} />
            <meshStandardMaterial color="#92765c" roughness={0.68} />
          </mesh>
          <mesh position={[x, 0.72, -4.06]}>
            <boxGeometry args={[0.3, 0.035, 0.035]} />
            <meshStandardMaterial color={palette.metal} roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[-1.6, 1.08, -4.35]} castShadow>
        <boxGeometry args={[0.55, 0.32, 0.36]} />
        <meshStandardMaterial map={bookRowTexture(2)} roughness={0.85} />
      </mesh>
      <mesh position={[0.5, 1.06, -4.35]} castShadow>
        <boxGeometry args={[0.42, 0.26, 0.3]} />
        <meshStandardMaterial map={bookRowTexture(3)} roughness={0.85} />
      </mesh>
      <mesh position={[-0.55, 1.04, -4.38]} castShadow>
        <boxGeometry args={[0.35, 0.22, 0.28]} />
        <meshStandardMaterial color={palette.linen} roughness={0.9} />
      </mesh>
      <LeanArt x={1.55} y={0.92} z={-4.3} w={0.3} h={0.38} v={2} lean={0.1} />

      {/* 唱片竖直挂墙，作为音乐入口的视觉提示。 */}
      <VinylRecord position={[-1.12, 1.78, -4.56]} onClick={playMusic} interactive={interactive} hoverCursor={hoverCursor} />

      {/* 蓝色区域：音乐磁带落在矮柜台面，点击播放/暂停一段轻音乐。 */}
      <group
        position={[-0.72, 0.94, -4.08]}
        rotation={[0, -0.08, 0]}
        onClick={playMusic}
        onPointerOver={() => interactive && hoverCursor(true)}
        onPointerOut={() => hoverCursor(false)}
      >
        <GlbModel
          url="/models/cassette-tape.glb"
          fit="width"
          size={0.52}
          position={[0, 0.04, 0.02]}
          rotation={[0, 0.05, 0]}
        />
        <mesh position={[0, 0.16, 0]} visible={false}>
          <boxGeometry args={[0.78, 0.34, 0.45]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

    </group>
  )
}

function VinylRecord({
  position,
  onClick,
  interactive,
  hoverCursor,
}: {
  position: [number, number, number]
  onClick: (e: ThreeEvent<MouseEvent>) => void
  interactive: boolean
  hoverCursor: (on: boolean) => void
}) {
  const musicOn = useApp((s) => s.musicOn)
  const disc = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!disc.current || !musicOn) return
    disc.current.rotation.z -= dt * 0.45
  })
  return (
    <group position={position} onClick={onClick} onPointerOver={() => interactive && hoverCursor(true)} onPointerOut={() => hoverCursor(false)}>
      <group ref={disc}>
        <mesh>
          <circleGeometry args={[0.3, 64]} />
          <meshStandardMaterial color="#1d1c1a" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <ringGeometry args={[0.07, 0.12, 36]} />
          <meshStandardMaterial color="#d8c7a2" roughness={0.7} />
        </mesh>
      </group>
      {musicOn && (
        <Html position={[0.88, -0.03, 0.08]} center zIndexRange={[80, 0]} style={{ pointerEvents: 'none' }}>
          <div className="radio-widget">
            <strong>Mariah Carey/Without You</strong>
            <div className="radio-controls" aria-hidden="true">
              <span className="radio-play" />
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

function SeasonWindowView({ season }: { season: 'spring' | 'summer' | 'autumn' | 'winter' }) {
  const src = {
    spring: '/window-scenes/spring.png',
    summer: '/window-scenes/summer.png',
    autumn: '/window-scenes/autumn.png',
    winter: '/window-scenes/winter.png',
  }[season]
  const texture = useLoader(THREE.TextureLoader, src)
  useMemo(() => {
    const image = texture.image as HTMLImageElement | undefined
    const planeAspect = 1.45 / 1.62
    const imageAspect = image?.width && image?.height ? image.width / image.height : 0.68
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.repeat.set(1, 1)
    texture.offset.set(0, 0)
    if (planeAspect > imageAspect) {
      const repeatY = imageAspect / planeAspect
      texture.repeat.set(1, repeatY)
      texture.offset.set(0, (1 - repeatY) / 2)
    } else {
      const repeatX = planeAspect / imageAspect
      texture.repeat.set(repeatX, 1)
      texture.offset.set((1 - repeatX) / 2, 0)
    }
    texture.needsUpdate = true
  }, [texture])

  return (
    <group position={[3, 2.38, -4.59]}>
      <mesh>
        <planeGeometry args={[1.45, 1.62]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.94}
          emissive="#ffffff"
          emissiveIntensity={0.05}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/** 斜倚在搁板/柜面上的小画框 */
function LeanArt({
  x,
  y,
  z,
  w,
  h,
  v,
  lean = 0.16,
}: {
  x: number
  y: number
  z: number
  w: number
  h: number
  v: number
  lean?: number
}) {
  const woodTrim = useMemo(
    () => new THREE.MeshStandardMaterial({ color: palette.deskWoodDark, roughness: 0.7 }),
    [],
  )
  return (
    <group position={[x, y, z]} rotation={[lean, 0, 0]}>
      <mesh position={[0, h / 2 + 0.012, 0.02]} material={woodTrim}>
        <boxGeometry args={[w + 0.05, h + 0.05, 0.03]} />
      </mesh>
      <mesh position={[0, h / 2 + 0.015, 0.038]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={artTexture(v)} roughness={0.9} />
      </mesh>
    </group>
  )
}
