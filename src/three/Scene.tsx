// 场景入口：Canvas、环境光、日光与全部 3D 内容。
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, useProgress } from '@react-three/drei'
import { useApp } from '@/store'
import { getEnv } from './environment'
import { Room } from './Room'
import { Objects } from './Objects'
import { Decor } from './Decor'
import { HotspotMarkers } from './Hotspot'
import { CameraRig } from './CameraRig'

function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
}

function EnvSetup() {
  const { gl, scene } = useThree()
  const season = useApp((s) => s.season)
  const time = useApp((s) => s.time)
  const env = useMemo(() => getEnv(season, time), [season, time])
  useEffect(() => {
    scene.background = new THREE.Color(env.background)
    gl.toneMappingExposure = env.exposure
  }, [gl, scene, env])
  return null
}

function LoadReporter({ onReady }: { onReady: () => void }) {
  const progress = useProgress((s) => s.progress)
  useEffect(() => {
    if (progress >= 100) onReady()
  }, [onReady, progress])
  return null
}

function Lights() {
  const lowSpec = useApp((s) => s.lowSpec)
  const mobile = useMemo(isMobileDevice, [])
  const season = useApp((s) => s.season)
  const time = useApp((s) => s.time)
  const env = useMemo(() => getEnv(season, time), [season, time])
  const shadowSize = lowSpec || mobile ? 1024 : 2048
  return (
    <>
      <ambientLight color={env.ambientColor} intensity={env.ambientIntensity} />
      <hemisphereLight args={[env.skyTop, '#c2a982', 0.42]} />
      <directionalLight
        castShadow={!lowSpec}
        position={env.sunPos}
        color={env.sunColor}
        intensity={env.sunIntensity}
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-5.5, 3.4, 3.2]} color="#fff5df" intensity={lowSpec ? 0.22 : 0.34} />
    </>
  )
}

export function Scene({ onReady }: { onReady: () => void }) {
  const lowSpec = useApp((s) => s.lowSpec)
  const mobile = useMemo(isMobileDevice, [])
  return (
    <Canvas
      shadows={!lowSpec}
      dpr={lowSpec ? 1 : mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: !lowSpec, toneMapping: THREE.ACESFilmicToneMapping }}
      camera={{ fov: 21, near: 0.1, far: 90, position: [10.2, 13.5, 12.8] }}
    >
      <LoadReporter onReady={onReady} />
      <EnvSetup />
      <Lights />
      <Room />
      <Objects />
      <Decor />
      {!lowSpec && (
        <ContactShadows
          position={[0, 0.025, -0.65]}
          scale={7.6}
          opacity={0.22}
          blur={mobile ? 2.2 : 2.8}
          far={2.8}
          frames={mobile ? 1 : Infinity}
          resolution={mobile ? 512 : 1024}
          color="#7c684f"
        />
      )}
      <HotspotMarkers />
      <CameraRig />
    </Canvas>
  )
}
