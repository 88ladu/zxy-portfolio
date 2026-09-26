import { Suspense, useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type Fit = 'height' | 'width' | 'depth' | 'max'

function Inner({
  url,
  fit,
  size,
  rotation,
  colorOverride,
  roughness = 0.82,
  metalness = 0,
}: {
  url: string
  fit: Fit
  size: number
  rotation?: [number, number, number]
  colorOverride?: string
  roughness?: number
  metalness?: number
}) {
  const gltf = useLoader(GLTFLoader, url) as { scene: THREE.Group }

  const model = useMemo(() => {
    const root = gltf.scene.clone(true)
    const box = new THREE.Box3().setFromObject(root)
    const dimensions = new THREE.Vector3()
    box.getSize(dimensions)
    const basis =
      fit === 'width'
        ? dimensions.x
        : fit === 'depth'
          ? dimensions.z
          : fit === 'max'
            ? Math.max(dimensions.x, dimensions.y, dimensions.z)
            : dimensions.y
    root.scale.setScalar(size / Math.max(basis, 0.0001))

    const fittedBox = new THREE.Box3().setFromObject(root)
    const center = new THREE.Vector3()
    fittedBox.getCenter(center)
    root.position.x -= center.x
    root.position.z -= center.z
    root.position.y -= fittedBox.min.y

    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
      if (colorOverride) {
        mesh.material = new THREE.MeshStandardMaterial({
          color: colorOverride,
          roughness,
          metalness,
        })
        return
      }
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((mat) => {
        if (mat) mat.side = THREE.DoubleSide
      })
    })
    return root
  }, [colorOverride, fit, gltf.scene, metalness, roughness, size])

  return <primitive object={model} rotation={rotation} />
}

export function GlbModel({
  position,
  rotation,
  url,
  fit = 'height',
  size = 1,
  colorOverride,
  roughness,
  metalness,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  url: string
  fit?: Fit
  size?: number
  colorOverride?: string
  roughness?: number
  metalness?: number
}) {
  return (
    <group position={position}>
      <Suspense fallback={null}>
        <Inner
          url={url}
          fit={fit}
          size={size}
          rotation={rotation}
          colorOverride={colorOverride}
          roughness={roughness}
          metalness={metalness}
        />
      </Suspense>
    </group>
  )
}

export function DeferredGlbModel({
  delay = 0,
  ...props
}: Parameters<typeof GlbModel>[0] & {
  delay?: number
}) {
  const [enabled, setEnabled] = useState(delay <= 0)
  useEffect(() => {
    if (enabled) return
    const timer = window.setTimeout(() => setEnabled(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay, enabled])

  if (!enabled) return <group position={props.position} />
  return <GlbModel {...props} />
}
