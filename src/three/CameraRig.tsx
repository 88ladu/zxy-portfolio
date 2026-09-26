// 相机系统：轴测开场 → 点击进入（滑入室内）→ 拖动环绕 → 物件聚焦 → 复位。
// 全程使用阻尼插值，机位始终保持在房间内部（orbit 有俯仰/偏航/距离限位），避免穿墙。
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useApp, dragState } from '@/store'
import { HOTSPOT_BY_ID } from './hotspotConfig'

const INTRO = { yaw: 0.12, pitch: 0.3, dist: 7.8, fov: 36, tx: 0.48, ty: 1.48, tz: -1.05 }
const ORBIT = { yaw: 0.16, pitch: 0.34, dist: 7.05, fov: 37, tx: 0.48, ty: 1.54, tz: -1.1 }
const FOCUS_FOV = 40
const LIM = {
  yawMin: -0.85,
  yawMax: 1.25,
  pitchMin: 0.2,
  pitchMax: 1.18,
  distMin: 4.6,
  distMax: 8.8,
}
const GLIDE_EPS = { yaw: 0.012, pitch: 0.012, dist: 0.06 }

interface CamState {
  yaw: number
  pitch: number
  dist: number
  fov: number
  tx: number
  ty: number
  tz: number
  pos: THREE.Vector3
  look: THREE.Vector3
}

function sphericalPos(c: CamState, out: THREE.Vector3) {
  out.set(
    c.tx + c.dist * Math.sin(c.yaw) * Math.cos(c.pitch),
    c.ty + c.dist * Math.sin(c.pitch),
    c.tz + c.dist * Math.cos(c.yaw) * Math.cos(c.pitch),
  )
  return out
}

/** 把相机约束在开放工作室内部：墙面留 0.25 缝隙。 */
function clampInside(p: THREE.Vector3) {
  p.x = THREE.MathUtils.clamp(p.x, -4.35, 4.35)
  p.z = THREE.MathUtils.clamp(p.z, -4.35, 6.6)
  p.y = THREE.MathUtils.clamp(p.y, 0.45, 4.9)
  return p
}

export function CameraRig() {
  const { camera, gl } = useThree()
  const mode = useApp((s) => s.mode)
  const activeId = useApp((s) => s.activeId)
  const resetTick = useApp((s) => s.resetTick)

  const cur = useRef<CamState>({
    yaw: INTRO.yaw,
    pitch: INTRO.pitch,
    dist: INTRO.dist,
    fov: INTRO.fov,
    tx: INTRO.tx,
    ty: INTRO.ty,
    tz: INTRO.tz,
    pos: new THREE.Vector3(),
    look: new THREE.Vector3(),
  })
  const gliding = useRef(false)
  const lastMode = useRef<typeof mode>(mode)
  const tmpPos = useRef(new THREE.Vector3())
  const tmpLook = useRef(new THREE.Vector3())

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    sphericalPos(cur.current, cam.position)
    cam.lookAt(cur.current.tx, cur.current.ty, cur.current.tz)
    cam.fov = INTRO.fov
    cam.updateProjectionMatrix()
    // 供自动化验收读取相机状态
    ;(window as unknown as { __room?: object }).__room = {
      camera: () => camera.position.toArray().map((n) => Math.round(n * 100) / 100),
      mode: () => useApp.getState().mode,
    }
  }, [camera])

  // 模式切换：进入滑行期（按收敛判定结束）；聚焦时以当前位置为插值起点
  useEffect(() => {
    if (lastMode.current === 'intro' && mode === 'orbit') {
      gliding.current = true
    }
    if (mode === 'focus' && activeId) {
      const c = cur.current
      c.pos.copy(camera.position)
      c.look.set(c.tx, c.ty, c.tz)
    }
    lastMode.current = mode
  }, [mode, activeId, camera])

  // 复位视角
  useEffect(() => {
    if (resetTick === 0) return
    const c = cur.current
    c.yaw = ORBIT.yaw
    c.pitch = ORBIT.pitch
    c.dist = ORBIT.dist
    gliding.current = true
  }, [resetTick])

  // 指针交互：拖动环绕 / 点击（进入、交给热点）
  useEffect(() => {
    const el = gl.domElement
    let down = false
    let moved = false
    let lx = 0
    let ly = 0
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      down = true
      moved = false
      dragState.moved = false
      lx = e.clientX
      ly = e.clientY
      el.setPointerCapture?.(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - lx
      const dy = e.clientY - ly
      lx = e.clientX
      ly = e.clientY
      if (Math.hypot(dx, dy) > 5) moved = true
      dragState.moved = moved
      const st = useApp.getState()
      if (st.mode !== 'orbit' || st.overlay || gliding.current) return
      const c = cur.current
      c.yaw = THREE.MathUtils.clamp(c.yaw - dx * 0.0042, LIM.yawMin, LIM.yawMax)
      c.pitch = THREE.MathUtils.clamp(c.pitch + dy * 0.0032, LIM.pitchMin, LIM.pitchMax)
    }
    const onUp = (e: PointerEvent) => {
      if (!down) return
      down = false
      if (e.type === 'pointercancel') {
        dragState.moved = false
        return
      }
      const st = useApp.getState()
      if (!moved && st.mode === 'intro') st.enter()
      setTimeout(() => {
        dragState.moved = false
      }, 0)
    }
    const onWheel = (e: WheelEvent) => {
      const st = useApp.getState()
      if (st.mode !== 'orbit' || st.overlay) return
      if (!e.altKey && !e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      const c = cur.current
      c.dist = THREE.MathUtils.clamp(c.dist + e.deltaY * 0.004, LIM.distMin, LIM.distMax)
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('wheel', onWheel)
    }
  }, [gl])

  const debugAcc = useRef(0)
  useFrame((_, dtRaw) => {
    const st = useApp.getState()
    const c = cur.current
    const cam = camera as THREE.PerspectiveCamera
    const dt = Math.min(dtRaw, 0.05)
    const k = 1 - Math.exp(-dt * 3.6)

    let goalFov = ORBIT.fov
    if (st.mode === 'intro') {
      goalFov = INTRO.fov
      c.yaw += (INTRO.yaw - c.yaw) * k
      c.pitch += (INTRO.pitch - c.pitch) * k
      c.dist += (INTRO.dist - c.dist) * k
      c.tx += (INTRO.tx - c.tx) * k
      c.ty += (INTRO.ty - c.ty) * k
      c.tz += (INTRO.tz - c.tz) * k
    } else if (st.mode === 'orbit') {
      if (gliding.current) {
        c.yaw += (ORBIT.yaw - c.yaw) * k
        c.pitch += (ORBIT.pitch - c.pitch) * k
        c.dist += (ORBIT.dist - c.dist) * k
        if (
          Math.abs(c.yaw - ORBIT.yaw) < GLIDE_EPS.yaw &&
          Math.abs(c.pitch - ORBIT.pitch) < GLIDE_EPS.pitch &&
          Math.abs(c.dist - ORBIT.dist) < GLIDE_EPS.dist
        ) {
          c.yaw = ORBIT.yaw
          c.pitch = ORBIT.pitch
          c.dist = ORBIT.dist
          gliding.current = false
        }
      }
      c.tx += (ORBIT.tx - c.tx) * k
      c.ty += (ORBIT.ty - c.ty) * k
      c.tz += (ORBIT.tz - c.tz) * k
    } else if (st.mode === 'focus' && st.activeId) {
      const hp = HOTSPOT_BY_ID[st.activeId]
      goalFov = FOCUS_FOV
      tmpPos.current.set(hp.cameraPos[0], hp.cameraPos[1], hp.cameraPos[2])
      tmpLook.current.set(hp.cameraLook[0], hp.cameraLook[1], hp.cameraLook[2])
      c.pos.lerp(tmpPos.current, k)
      c.look.lerp(tmpLook.current, k)
    }
    c.fov += (goalFov - c.fov) * k

    if (st.mode === 'focus' && st.activeId) {
      cam.position.copy(c.pos)
      cam.lookAt(c.look)
    } else if (st.mode === 'orbit') {
      sphericalPos(c, cam.position)
      clampInside(cam.position)
      cam.lookAt(c.tx, c.ty, c.tz)
    } else {
      sphericalPos(c, cam.position)
      cam.lookAt(c.tx, c.ty, c.tz)
    }
    cam.fov = c.fov
    cam.updateProjectionMatrix()
    // 调试输出写到 DOM（自动化验收的隔离脚本环境读不到 window 全局）
    debugAcc.current += dtRaw
    if (debugAcc.current > 0.2) {
      debugAcc.current = 0
      document.documentElement.dataset.room = JSON.stringify({
        mode: st.mode,
        cam: camera.position.toArray().map((n) => Math.round(n * 100) / 100),
      })
    }
  })

  return null
}
