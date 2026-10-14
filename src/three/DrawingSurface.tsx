import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useApp } from '@/store'
export function DrawingSurface() {
  const drawing = useApp(s => s.drawing)
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 900; c.height = 600
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#f6f0e3'; ctx.fillRect(0, 0, 900, 600)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
    if (drawing) { const img = new Image(); img.onload = () => {ctx.drawImage(img, 0, 0, 900, 600); t.needsUpdate = true}; img.src = drawing }
    else { ctx.fillStyle = '#806b54'; ctx.font = '30px sans-serif'; ctx.fillText('Leave a little idea here', 235, 280) }
    return t
  }, [drawing])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={[0, 1.13, 0.43]}><planeGeometry args={[0.82, 0.55]} /><meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.9} /></mesh>
}
