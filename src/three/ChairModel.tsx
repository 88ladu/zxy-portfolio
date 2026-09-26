// 用户提供的椅子模型（FBX/GLB 自动识别）：按目标高度归一化、底面落地、中心对齐。
// lowSpec 下由 Objects 回退为程序化简化椅子。
import { Suspense, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { assetPath } from '@/assetPath'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

function Inner({
  url,
  height,
  rotationY,
  onReady,
}: {
  url: string
  height: number
  rotationY: number
  onReady?: (info: { meshes: number; vertices: number; textured: boolean }) => void
}) {
  const isGlb = /\.(glb|gltf)$/i.test(url)
  const loaded = useLoader(isGlb ? GLTFLoader : FBXLoader, url) as
    | THREE.Group
    | { scene: THREE.Group }
  const source = isGlb ? (loaded as { scene: THREE.Group }).scene : (loaded as THREE.Group)

  const model = useMemo(() => {
    const root = source.clone(true)
    const chairGrey = new THREE.MeshStandardMaterial({
      color: '#cfc9bd',
      roughness: 0.78,
      metalness: 0.05,
      side: THREE.DoubleSide,
    })
    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    box.getSize(size)
    const scale = height / Math.max(size.y, 0.0001)
    root.scale.setScalar(scale)

    const box2 = new THREE.Box3().setFromObject(root)
    const center = new THREE.Vector3()
    box2.getCenter(center)
    root.position.x -= center.x
    root.position.z -= center.z
    root.position.y -= box2.min.y

    let meshes = 0
    let vertices = 0
    let textured = false
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (mesh.isMesh) {
        meshes += 1
        const geo = mesh.geometry as THREE.BufferGeometry
        vertices += geo.attributes.position ? geo.attributes.position.count : 0
        const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[]
        const list = Array.isArray(mat) ? mat : [mat]
        for (const m of list) {
          if (m && (m as THREE.MeshStandardMaterial).map) textured = true
          m.side = THREE.DoubleSide
        }
        if (url.includes('executive-chair')) mesh.material = chairGrey
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    onReady?.({ meshes, vertices, textured })
    return root
  }, [source, height, onReady, url])

  return <primitive object={model} rotation-y={rotationY} />
}

export function ChairModel({
  position,
  height = 1.0,
  rotationY = 0,
  url = assetPath('/models/chair.fbx'),
}: {
  position: [number, number, number]
  height?: number
  rotationY?: number
  url?: string
}) {
  const onReady = useCallback(
    (info: { meshes: number; vertices: number; textured: boolean }) => {
      document.documentElement.dataset.chair = JSON.stringify(info)
    },
    [],
  )
  return (
    <group position={position}>
      <Suspense fallback={null}>
        <Inner url={url} height={height} rotationY={rotationY} onReady={onReady} />
      </Suspense>
    </group>
  )
}
