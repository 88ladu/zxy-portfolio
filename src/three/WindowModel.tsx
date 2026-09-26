import { useMemo } from 'react'
import * as THREE from 'three'

export function WindowModel({
  position,
  height = 1.25,
  rotationY = 0,
}: {
  position: [number, number, number]
  height?: number
  rotationY?: number
  url?: string
}) {
  const mats = useMemo(
    () => ({
      outer: new THREE.MeshStandardMaterial({ color: '#e7e3d8', roughness: 0.78 }),
      inner: new THREE.MeshStandardMaterial({ color: '#fbf8ef', roughness: 0.74 }),
      gasket: new THREE.MeshStandardMaterial({ color: '#171614', roughness: 0.62 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: '#eaf0ec',
        transparent: true,
        opacity: 0.22,
        roughness: 0.16,
        transmission: 0.25,
        side: THREE.DoubleSide,
      }),
      handle: new THREE.MeshStandardMaterial({ color: '#8f8d84', roughness: 0.45, metalness: 0.25 }),
    }),
    [],
  )

  const width = height * 0.78
  const outerBar = height * 0.095
  const innerBar = height * 0.036
  const gasket = height * 0.014
  const paneW = (width - outerBar * 2 - innerBar) / 2
  const paneH = height - outerBar * 2

  return (
    <group position={position} rotation-y={rotationY}>
      {/* Outer recessed frame */}
      <mesh position={[0, height / 2 - outerBar / 2, 0]} material={mats.outer} castShadow receiveShadow>
        <boxGeometry args={[width, outerBar, 0.085]} />
      </mesh>
      <mesh position={[0, -height / 2 + outerBar / 2, 0]} material={mats.outer} castShadow receiveShadow>
        <boxGeometry args={[width, outerBar, 0.085]} />
      </mesh>
      <mesh position={[-width / 2 + outerBar / 2, 0, 0]} material={mats.outer} castShadow receiveShadow>
        <boxGeometry args={[outerBar, height, 0.085]} />
      </mesh>
      <mesh position={[width / 2 - outerBar / 2, 0, 0]} material={mats.outer} castShadow receiveShadow>
        <boxGeometry args={[outerBar, height, 0.085]} />
      </mesh>

      {/* Thin black inner gasket, like the reference photo. */}
      <mesh position={[0, paneH / 2, 0.04]} material={mats.gasket} castShadow>
        <boxGeometry args={[width - outerBar * 1.45, gasket, 0.05]} />
      </mesh>
      <mesh position={[0, -paneH / 2, 0.04]} material={mats.gasket} castShadow>
        <boxGeometry args={[width - outerBar * 1.45, gasket, 0.05]} />
      </mesh>
      <mesh position={[-width / 2 + outerBar * 0.92, 0, 0.04]} material={mats.gasket} castShadow>
        <boxGeometry args={[gasket, paneH, 0.05]} />
      </mesh>
      <mesh position={[width / 2 - outerBar * 0.92, 0, 0.04]} material={mats.gasket} castShadow>
        <boxGeometry args={[gasket, paneH, 0.05]} />
      </mesh>

      {/* White sash bars: central vertical plus two horizontal rails. */}
      <mesh position={[0, 0, 0.065]} material={mats.inner} castShadow>
        <boxGeometry args={[innerBar, paneH, 0.07]} />
      </mesh>
      {[-0.28, 0.28].map((y) => (
        <mesh key={y} position={[0, y * height, 0.062]} material={mats.inner} castShadow>
          <boxGeometry args={[width - outerBar * 1.45, innerBar, 0.065]} />
        </mesh>
      ))}

      {/* Subtle glass panes, kept behind the frame so the seasonal view reads clearly. */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (paneW / 2 + innerBar / 2), 0, 0.025]} material={mats.glass}>
          <planeGeometry args={[paneW, paneH]} />
        </mesh>
      ))}

      <mesh position={[0.22, -height / 2 + outerBar * 0.52, 0.095]} rotation={[0, 0, -0.12]} material={mats.handle} castShadow>
        <boxGeometry args={[0.32, 0.035, 0.035]} />
      </mesh>
      <mesh position={[0.08, -height / 2 + outerBar * 0.5, 0.09]} material={mats.handle} castShadow>
        <boxGeometry args={[0.12, 0.06, 0.045]} />
      </mesh>
    </group>
  )
}
