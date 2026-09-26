// 家具与桌面物件：工作台、转椅、纸本、笔筒、台灯、电脑、手机。
import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Html, RoundedBox } from '@react-three/drei'
import { palette } from './palette'
import { dragState, useApp } from '@/store'
import { monitorWallpaperTexture, paperTexture } from './textures'
import { ChairModel } from './ChairModel'
import { DeferredGlbModel, GlbModel } from './GlbModel'
import type { ThreeEvent } from '@react-three/fiber'

export function Objects() {
  const lowSpec = useApp((s) => s.lowSpec)
  const setFallback = useApp((s) => s.setFallback)
  const mode = useApp((s) => s.mode)
  const focus = useApp((s) => s.focus)
  const deskLampOn = useApp((s) => s.deskLampOn)
  const toggleDeskLamp = useApp((s) => s.toggleDeskLamp)

  const mats = useMemo(
    () => ({
      desk: new THREE.MeshStandardMaterial({ color: palette.deskWood, roughness: 0.68 }),
      leg: new THREE.MeshStandardMaterial({ color: palette.deskWoodDark, roughness: 0.72 }),
      charcoal: new THREE.MeshStandardMaterial({ color: palette.charcoal, roughness: 0.55 }),
      fabric: new THREE.MeshStandardMaterial({ color: '#d8d4cc', roughness: 0.95 }),
      metal: new THREE.MeshStandardMaterial({ color: '#3c3936', roughness: 0.4, metalness: 0.55 }),
      paper1: new THREE.MeshStandardMaterial({ color: palette.paper, roughness: 0.92 }),
      paper2: new THREE.MeshStandardMaterial({ color: '#efe7d4', roughness: 0.92 }),
      paper3: new THREE.MeshStandardMaterial({ color: '#e7ddc6', roughness: 0.92 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#eef7f4',
        roughness: 0.08,
        transmission: 0.4,
        transparent: true,
        opacity: 0.5,
        thickness: 0.04,
      }),
    }),
    [],
  )

  const sheet1 = useMemo(() => paperTexture(1), [])
  const sheet2 = useMemo(() => paperTexture(2), [])
  const sheet3 = useMemo(() => paperTexture(3), [])
  const wallpaper = useMemo(() => monitorWallpaperTexture(), [])

  const hoverCursor = (on: boolean) => {
    document.body.style.cursor = on ? 'pointer' : ''
  }
  const stop = (e: ThreeEvent<MouseEvent>) => e.stopPropagation()
  const openProjects = (e: ThreeEvent<MouseEvent>) => {
    stop(e)
    if (interactive && !dragState.moved) focus('desk')
  }
  const openAbout = (e: ThreeEvent<MouseEvent>) => {
    stop(e)
    if (interactive && !dragState.moved) focus('chair')
  }

  const interactive = mode !== 'intro'

  return (
    <group>
      {/* ── 工作台（矮柜前居中，正对转椅） ── */}
      <group
        position={[0.55, 0, -2.12]}
        onClick={openProjects}
        onPointerOver={() => interactive && hoverCursor(true)}
        onPointerOut={() => hoverCursor(false)}
      >
        <MinimalDesk />
        <mesh position={[0, 0.92, 0]} visible={false}>
          <boxGeometry args={[2.55, 0.16, 0.95]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* 纸摞与作品稿：点击进入作品集 */}
        <group
          onClick={openProjects}
          onPointerOver={() => interactive && hoverCursor(true)}
          onPointerOut={() => hoverCursor(false)}
        >
          <mesh position={[-0.36, 0.945, -0.02]} rotation={[0, 0.06, 0]} material={mats.paper1} castShadow>
            <boxGeometry args={[0.52, 0.016, 0.68]} />
          </mesh>
          <mesh position={[-0.34, 0.96, -0.01]} rotation={[0, -0.05, 0]} material={mats.paper2}>
            <boxGeometry args={[0.5, 0.014, 0.66]} />
          </mesh>
          <mesh position={[-0.38, 0.975, -0.03]} rotation={[0, 0.1, 0]} material={mats.paper3}>
            <boxGeometry args={[0.48, 0.014, 0.64]} />
          </mesh>
          <mesh position={[0.16, 0.941, 0.22]} rotation={[-Math.PI / 2, 0, 0.14]}>
            <planeGeometry args={[0.66, 0.88]} />
            <meshStandardMaterial map={sheet1} roughness={0.92} />
          </mesh>
          <mesh position={[0.54, 0.942, 0.2]} rotation={[-Math.PI / 2, 0, -0.22]}>
            <planeGeometry args={[0.5, 0.66]} />
            <meshStandardMaterial map={sheet2} roughness={0.92} />
          </mesh>
          <mesh position={[-0.1, 0.94, 0.36]} rotation={[-Math.PI / 2, 0, 0.05]}>
            <planeGeometry args={[0.44, 0.58]} />
            <meshStandardMaterial map={sheet3} roughness={0.92} />
          </mesh>
        </group>

        {/* 笔筒与倒插画笔 */}
        <mesh position={[0.82, 1.025, -0.18]} material={mats.glass} castShadow>
          <cylinderGeometry args={[0.075, 0.07, 0.18, 18]} />
        </mesh>
        <mesh position={[0.9, 1.045, -0.02]} material={mats.glass} castShadow>
          <cylinderGeometry args={[0.08, 0.072, 0.2, 24]} />
        </mesh>
        {[
          { dx: -0.045, dz: -0.005, rx: -0.16, rz: -0.12, color: palette.charcoal },
          { dx: -0.015, dz: 0.02, rx: -0.08, rz: 0.05, color: palette.deskWoodDark },
          { dx: 0.018, dz: -0.015, rx: 0.06, rz: -0.08, color: palette.charcoal },
          { dx: 0.047, dz: 0.012, rx: 0.13, rz: 0.11, color: palette.deskWoodDark },
        ].map(({ dx, dz, rx, rz, color }, i) => (
          <group key={i} position={[0.9 + dx, 1.19, -0.02 + dz]} rotation={[rx, 0, rz]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.006, 0.006, 0.34, 8]} />
              <meshStandardMaterial color={color} roughness={0.72} />
            </mesh>
            <mesh position={[0, -0.19, 0]} rotation={[Math.PI, 0, 0]} castShadow>
              <coneGeometry args={[0.012, 0.045, 8]} />
              <meshStandardMaterial color="#2b2520" roughness={0.75} />
            </mesh>
          </group>
        ))}

        <CoffeeCup interactive={interactive} />

        {/* 台灯：默认关闭，点击切换桌面暖光。 */}
        <group
          position={[-0.68, 0.92, -0.18]}
          rotation={[0, 0.18, 0]}
          onClick={(e) => {
            stop(e)
            if (interactive && !dragState.moved) toggleDeskLamp()
          }}
          onPointerOver={() => interactive && hoverCursor(true)}
          onPointerOut={() => hoverCursor(false)}
        >
          <mesh position={[0, 0.32, 0.02]} castShadow={false}>
            <boxGeometry args={[0.38, 0.68, 0.32]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <GlbModel url="/models/light-desk.glb" fit="height" size={0.62} position={[0, 0, 0]} />
          <mesh position={[0.02, 0.49, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.065, 24]} />
            <meshStandardMaterial
              color="#3a3128"
              emissive="#ffd9a0"
              emissiveIntensity={deskLampOn ? 1.7 : 0}
              roughness={0.45}
            />
          </mesh>
          {deskLampOn && (
            <>
              <pointLight position={[0.08, 0.48, 0.05]} color="#ffd6a0" intensity={0.48} distance={1.25} decay={2.2} />
              <spotLight
                position={[0.06, 0.5, 0.02]}
                color="#ffd6a0"
                intensity={0.72}
                distance={1.35}
                angle={0.62}
                penumbra={0.82}
                decay={2.1}
              />
            </>
          )}
        </group>

        {/* 一体式电脑 → 打开站点内页 */}
        <group
          position={[0.0, 0.94, -0.34]}
          onClick={(e) => {
            stop(e)
            if (interactive && !dragState.moved) focus('desk')
          }}
          onPointerOver={() => interactive && hoverCursor(true)}
          onPointerOut={() => hoverCursor(false)}
        >
          <AllInOneComputer wallpaper={wallpaper} />
          <mesh position={[0, 0.4, 0.02]} visible={false}>
            <boxGeometry args={[1.05, 0.76, 0.12]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        </group>

        {/* 显示器前方：键盘与鼠标，贴近参考图的办公桌布局。 */}
        <group position={[0.0, 0.972, 0.18]} rotation={[0, -0.02, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.58, 0.024, 0.18]} />
            <meshStandardMaterial color="#e7e0d2" roughness={0.55} />
          </mesh>
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 11 }, (_, col) => (
              <mesh key={`${row}-${col}`} position={[-0.25 + col * 0.05, 0.021, -0.072 + row * 0.034]}>
                <boxGeometry args={[0.032, 0.01, 0.018]} />
                <meshStandardMaterial color="#c8c0b2" roughness={0.58} />
              </mesh>
            )),
          )}
        </group>
        <group position={[0.5, 0.976, 0.17]} rotation={[0, -0.08, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.018, 0.25]} />
            <meshStandardMaterial color="#2d2925" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.025, 0]} castShadow>
            <sphereGeometry args={[0.07, 24, 12]} />
            <meshStandardMaterial color="#f0ede6" roughness={0.45} />
          </mesh>
        </group>

        {/* 手机 → 图文降级模式 */}
        <group
          position={[-1.0, 0.94, 0.26]}
          rotation={[0, -0.4, 0]}
          onClick={(e) => {
            stop(e)
            if (interactive) setFallback(true)
          }}
          onPointerOver={() => interactive && hoverCursor(true)}
          onPointerOut={() => hoverCursor(false)}
        >
          <mesh material={mats.charcoal}>
            <boxGeometry args={[0.082, 0.009, 0.16]} />
          </mesh>
          <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.07, 0.145]} />
            <meshStandardMaterial color="#9aa7b0" roughness={0.3} emissive="#26323c" emissiveIntensity={0.5} />
          </mesh>
        </group>
      </group>

      {/* ── 黑色工作转椅（地毯中央，背对入口、面向工作台） ── */}
      <group
        position={[0.52, 0.022, -0.78]}
        rotation={[0, 3.15, 0]}
        onClick={openAbout}
        onPointerOver={() => interactive && hoverCursor(true)}
        onPointerOut={() => hoverCursor(false)}
      >
        {lowSpec ? <SimpleChair /> : <ChairModel position={[0, 0, 0]} height={1.25} url="/models/executive-chair.fbx" />}
      </group>
    </group>
  )
}

function MinimalDesk() {
  const mats = useMemo(
    () => ({
      top: new THREE.MeshStandardMaterial({ color: '#d0ab7b', roughness: 0.78 }),
      leg: new THREE.MeshStandardMaterial({ color: '#bb9366', roughness: 0.82 }),
      shadow: new THREE.MeshStandardMaterial({ color: '#ad855a', roughness: 0.86 }),
    }),
    [],
  )
  return (
    <group>
      <RoundedBox
        args={[2.46, 0.1, 0.9]}
        radius={0.045}
        smoothness={8}
        position={[0, 0.86, 0]}
        material={mats.top}
        castShadow
        receiveShadow
      />
      {[
        [-1.05, -0.32],
        [1.05, -0.32],
        [-1.05, 0.32],
        [1.05, 0.32],
      ].map(([x, z]) => (
        <RoundedBox
          key={`${x}-${z}`}
          args={[0.09, 0.82, 0.09]}
          radius={0.025}
          smoothness={6}
          position={[x, 0.41, z]}
          material={mats.leg}
          castShadow
          receiveShadow
        />
      ))}
      <RoundedBox
        args={[1.52, 0.055, 0.055]}
        radius={0.018}
        smoothness={5}
        position={[0, 0.69, -0.36]}
        material={mats.shadow}
        castShadow
      />
    </group>
  )
}

function AllInOneComputer({ wallpaper }: { wallpaper: THREE.Texture }) {
  return (
    <group>
      <RoundedBox
        args={[1.02, 0.59, 0.045]}
        radius={0.045}
        smoothness={10}
        position={[0, 0.44, 0]}
        castShadow
      >
        <meshStandardMaterial color="#1d1d1b" roughness={0.48} />
      </RoundedBox>
      <mesh position={[0, 0.45, 0.026]}>
        <planeGeometry args={[0.9, 0.48]} />
        <meshStandardMaterial
          map={wallpaper}
          emissive="#dce7df"
          emissiveIntensity={0.16}
          roughness={0.52}
          toneMapped={false}
        />
      </mesh>
      <RoundedBox args={[1.04, 0.09, 0.05]} radius={0.026} smoothness={8} position={[0, 0.12, 0]} castShadow>
        <meshStandardMaterial color="#eee8dc" roughness={0.62} />
      </RoundedBox>
      <RoundedBox args={[0.22, 0.32, 0.055]} radius={0.024} smoothness={8} position={[0, -0.08, -0.02]} castShadow>
        <meshStandardMaterial color="#dfd9ce" roughness={0.68} />
      </RoundedBox>
      <RoundedBox args={[0.54, 0.04, 0.22]} radius={0.03} smoothness={8} position={[0, -0.28, 0.02]} castShadow>
        <meshStandardMaterial color="#e9e2d6" roughness={0.7} />
      </RoundedBox>
    </group>
  )
}

function CoffeeCup({ interactive }: { interactive: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [note, setNote] = useState(false)
  useEffect(() => {
    if (!note) return
    const t = window.setTimeout(() => setNote(false), 1500)
    return () => window.clearTimeout(t)
  }, [note])

  return (
    <group
      position={[-0.8, 0.915, 0.1]}
      rotation={[0, -0.55 + (note ? 0.035 : 0), 0]}
      onClick={(e) => {
        e.stopPropagation()
        if (!interactive || dragState.moved) return
        setNote(true)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        if (!interactive) return
        document.body.style.cursor = 'pointer'
        setHovered(true)
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
        setHovered(false)
      }}
    >
      <mesh position={[0, 0.15, 0]} visible>
        <boxGeometry args={[0.44, 0.42, 0.44]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <DeferredGlbModel url="/models/coffee-cup.optimized.glb" fit="max" size={0.34} position={[0, 0, 0]} delay={1400} />
      {(hovered || note) && (
        <group position={[0, 0.35, 0.01]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[-0.035 + i * 0.035, 0.04 + i * 0.035, 0]} rotation={[0, 0, i * 0.5]}>
              <planeGeometry args={[0.028, 0.12]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.2 - i * 0.035} depthWrite={false} />
            </mesh>
          ))}
        </group>
      )}
      {note && (
        <Html position={[0, 0.52, 0]} center zIndexRange={[60, 0]} style={{ pointerEvents: 'none' }}>
          <div className="tiny-toast">今天也在做东西</div>
        </Html>
      )}
    </group>
  )
}

/** 程序化简化椅子：流畅模式降级用。 */
function SimpleChair() {
  const mats = useMemo(
    () => ({
      fabric: new THREE.MeshStandardMaterial({ color: '#d8d4cc', roughness: 0.95 }),
      charcoal: new THREE.MeshStandardMaterial({ color: '#3d3833', roughness: 0.55 }),
    }),
    [],
  )
  return (
    <group>
      <mesh position={[0, 0.5, 0]} material={mats.fabric} castShadow>
        <boxGeometry args={[0.5, 0.09, 0.46]} />
      </mesh>
      <mesh position={[0, 0.85, -0.235]} rotation={[0.14, 0, 0]} material={mats.fabric} castShadow>
        <boxGeometry args={[0.46, 0.54, 0.07]} />
      </mesh>
      {[0.26, -0.26].map((ax) => (
        <group key={ax}>
          <mesh position={[ax, 0.58, 0.02]} material={mats.charcoal}>
            <boxGeometry args={[0.04, 0.14, 0.04]} />
          </mesh>
          <mesh position={[ax, 0.67, 0.02]} material={mats.charcoal} castShadow>
            <boxGeometry args={[0.05, 0.05, 0.32]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.31, 0]} material={mats.charcoal}>
        <cylinderGeometry args={[0.028, 0.028, 0.36, 12]} />
      </mesh>
      {Array.from({ length: 5 }, (_, i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <mesh position={[0.17, 0.09, 0]} material={mats.charcoal} castShadow>
            <boxGeometry args={[0.3, 0.03, 0.05]} />
          </mesh>
          <mesh position={[0.3, 0.036, 0]}>
            <sphereGeometry args={[0.034, 12, 10]} />
            <meshStandardMaterial color="#1c1a18" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
