// 精细版工作椅（按用户参考图重建）：
// 网布靠背（镂空纹理 + 弧形边框）、皮质坐垫、扶手、座下机构、镀铬五星脚与滚轮。
// 局部坐标系：人面向 -z（背朝 +z），由 Objects 的定位组控制房间中的位置与朝向。
import { useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

function makeMeshTextures(): { map: THREE.CanvasTexture; alphaMap: THREE.CanvasTexture } {
  const size = 256
  const cv = document.createElement('canvas')
  cv.width = cv.height = size
  const ctx = cv.getContext('2d')!
  // 网布底色 + 细编织纹
  ctx.fillStyle = '#26262a'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < size; i += 4) {
    ctx.strokeStyle = 'rgba(255,255,255,0.045)'
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, size)
    ctx.stroke()
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'
    ctx.beginPath()
    ctx.moveTo(0, i + 2)
    ctx.lineTo(size, i + 2)
    ctx.stroke()
  }
  const map = new THREE.CanvasTexture(cv)
  map.wrapS = map.wrapT = THREE.RepeatWrapping
  map.repeat.set(3, 4)

  // 镂空孔洞（白=不透明，黑=孔）
  const cv2 = document.createElement('canvas')
  cv2.width = cv2.height = size
  const ctx2 = cv2.getContext('2d')!
  ctx2.fillStyle = '#ffffff'
  ctx2.fillRect(0, 0, size, size)
  ctx2.fillStyle = '#000000'
  for (let y = 0; y < size; y += 8) {
    for (let x = 0; x < size; x += 8) {
      ctx2.beginPath()
      ctx2.arc(x + 4, y + 4, 2.3, 0, Math.PI * 2)
      ctx2.fill()
    }
  }
  const alphaMap = new THREE.CanvasTexture(cv2)
  alphaMap.wrapS = alphaMap.wrapT = THREE.RepeatWrapping
  alphaMap.repeat.set(3, 4)
  return { map, alphaMap }
}

// 弧长 1.15 的圆弧中点在 XZ 平面上需要绕 y 轴补的角度（使弧段中心朝 +z）
const ARC = 1.15
const FRAME_Y = Math.PI / 2 - ARC / 2

export function OfficeChair() {
  const { gl } = useThree()

  const { mats, geos } = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()

    const { map, alphaMap } = makeMeshTextures()
    const mesh = new THREE.MeshStandardMaterial({
      color: '#3d3d44',
      map,
      alphaMap,
      alphaTest: 0.35,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0,
    })
    const plastic = new THREE.MeshStandardMaterial({ color: '#1d1d20', roughness: 0.5, metalness: 0.1 })
    const pad = new THREE.MeshStandardMaterial({ color: '#141416', roughness: 0.42, metalness: 0.05 })
    const chrome = new THREE.MeshStandardMaterial({
      color: '#d6d9dd',
      roughness: 0.22,
      metalness: 0.9,
      envMap,
      envMapIntensity: 1.1,
    })
    const chromeDark = new THREE.MeshStandardMaterial({
      color: '#9ea3a9',
      roughness: 0.3,
      metalness: 0.85,
      envMap,
      envMapIntensity: 1.0,
    })
    const wheel = new THREE.MeshStandardMaterial({ color: '#17171a', roughness: 0.55 })

    const R = 0.5 // 靠背弧面半径
    const backGeo = new THREE.CylinderGeometry(R, R, 0.58, 28, 1, true, -ARC / 2, ARC)
    const frameGeo = new THREE.TorusGeometry(R, 0.022, 10, 40, ARC)
    const seatGeo = new RoundedBoxGeometry(0.54, 0.09, 0.52, 4, 0.035)
    const mechGeo = new RoundedBoxGeometry(0.3, 0.1, 0.26, 3, 0.03)
    const padGeo = new RoundedBoxGeometry(0.095, 0.035, 0.28, 3, 0.015)
    const postGeo = new RoundedBoxGeometry(0.045, 0.62, 0.045, 2, 0.015)

    // 五星脚刀臂（顶视图轮廓 → 挤出）
    const blade = new THREE.Shape()
    blade.moveTo(0.06, 0.035)
    blade.quadraticCurveTo(0.22, 0.05, 0.36, 0.022)
    blade.quadraticCurveTo(0.38, 0.012, 0.36, 0)
    blade.quadraticCurveTo(0.22, -0.03, 0.06, -0.035)
    blade.quadraticCurveTo(0.0, -0.03, 0.0, 0)
    blade.quadraticCurveTo(0.0, 0.03, 0.06, 0.035)
    const bladeGeo = new THREE.ExtrudeGeometry(blade, {
      depth: 0.032,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
    })

    return {
      mats: { mesh, plastic, pad, chrome, chromeDark, wheel },
      geos: { backGeo, frameGeo, seatGeo, mechGeo, padGeo, postGeo, bladeGeo },
    }
  }, [gl])

  const arms = useMemo(() => [0, 1, 2, 3, 4].map((i) => (i * Math.PI * 2) / 5), [])

  return (
    <group>
      {/* ── 坐垫 ── */}
      <mesh geometry={geos.seatGeo} material={mats.pad} position={[0, 0.5, 0]} rotation={[0.05, 0, 0]} castShadow />

      {/* ── 座下机构与升降柱 ── */}
      <mesh geometry={geos.mechGeo} material={mats.plastic} position={[0, 0.42, 0.02]} castShadow />
      <mesh position={[0, 0.335, 0.02]} material={mats.chromeDark}>
        <cylinderGeometry args={[0.042, 0.05, 0.06, 18]} />
      </mesh>
      <mesh position={[0, 0.235, 0.02]} material={mats.plastic} castShadow>
        <cylinderGeometry args={[0.03, 0.033, 0.24, 16]} />
      </mesh>
      <mesh position={[0, 0.12, 0.02]} material={mats.chromeDark}>
        <cylinderGeometry args={[0.034, 0.04, 0.05, 18]} />
      </mesh>

      {/* ── 镀铬五星脚 + 滚轮 ── */}
      {arms.map((a) => (
        <group key={a} rotation={[0, a, 0]}>
          <mesh
            geometry={geos.bladeGeo}
            material={mats.chrome}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0.02, 0.088, 0]}
            castShadow
          />
          {/* 轮叉支架与滚轮 */}
          <mesh position={[0.35, 0.05, 0]} rotation={[0, 0, 0.35]} material={mats.chromeDark}>
            <cylinderGeometry args={[0.011, 0.011, 0.07, 10]} />
          </mesh>
          <group position={[0.375, 0.034, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.wheel} castShadow>
              <cylinderGeometry args={[0.032, 0.032, 0.022, 18]} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={mats.chromeDark}>
              <cylinderGeometry args={[0.014, 0.014, 0.026, 12]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* ── 靠背（网布 + 弧形边框），整体后仰，凹面朝 -z（面向入座方向） ── */}
      <group position={[0, 0.72, 0]} rotation={[0.12, 0, 0]}>
        {/* 圆柱轴心在 (0, ·, -0.28)，弧面中心 z ≈ +0.22，边缘 z ≈ +0.14 */}
        <mesh geometry={geos.backGeo} material={mats.mesh} position={[0, 0.29, -0.28]} castShadow />
        {/* 上下弧形边框（与网布同轴同半径） */}
        {[0.29, -0.29].map((dy) => (
          <mesh
            key={dy}
            geometry={geos.frameGeo}
            material={mats.plastic}
            position={[0, dy, -0.28]}
            rotation={[-Math.PI / 2, -FRAME_Y, 0, 'YXZ']}
          />
        ))}
        {/* 两侧立柱边框 */}
        {[-0.273, 0.273].map((x) => (
          <mesh key={x} geometry={geos.postGeo} material={mats.plastic} position={[x, 0, 0.14]} castShadow />
        ))}
        {/* 中央竖向张紧带 */}
        <mesh position={[0, 0.29, 0.226]} material={mats.plastic}>
          <boxGeometry args={[0.05, 0.5, 0.012]} />
        </mesh>
      </group>

      {/* ── 扶手（座侧竖直立柱 + 前伸垫面） ── */}
      {[-0.31, 0.31].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.585, 0.06]} material={mats.plastic} castShadow>
            <boxGeometry args={[0.042, 0.17, 0.05]} />
          </mesh>
          <mesh position={[x, 0.665, -0.02]} material={mats.plastic}>
            <boxGeometry args={[0.038, 0.035, 0.26]} />
          </mesh>
          <mesh geometry={geos.padGeo} material={mats.pad} position={[x, 0.705, -0.02]} castShadow />
        </group>
      ))}
    </group>
  )
}
