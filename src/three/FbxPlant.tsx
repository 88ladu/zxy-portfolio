// 用户提供的 FBX 绿植模型：自动归一化尺寸（按目标高度缩放、底面落地、中心对齐）。
// lowSpec 下由 Decor 回退到程序化的简化绿植。
import { Suspense, useCallback, useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

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
  const fbx = useLoader(FBXLoader, url) as THREE.Group

  const model = useMemo(() => {
    const root = fbx.clone(true)
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
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    onReady?.({ meshes, vertices, textured })
    return root
  }, [fbx, height, onReady])

  return <primitive object={model} rotation-y={rotationY} />
}

export function FbxPlant({
  position,
  height = 1.55,
  rotationY = 0,
  url = '/models/plant.fbx',
}: {
  position: [number, number, number]
  height?: number
  rotationY?: number
  url?: string
}) {
  const onReady = useCallback(
    (info: { meshes: number; vertices: number; textured: boolean }) => {
      document.documentElement.dataset.plant = JSON.stringify(info)
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
