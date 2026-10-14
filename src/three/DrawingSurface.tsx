import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useApp } from '@/store'
export function DrawingSurface() {
  const drawing = useApp(s => s.drawing)
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 900; c.height = 840
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#f6f0e3'; ctx.fillRect(0, 0, 900, 840)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
    if (drawing) { const img = new Image(); img.onload = () => {ctx.drawImage(img, 0, 120, 900, 600); t.needsUpdate = true}; img.src = drawing }
    else { ctx.fillStyle = '#806b54'; ctx.font = '30px sans-serif'; ctx.fillText('Leave a little idea here', 235, 400) }
    return t
  }, [drawing])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={[0.065, 1.09, 0.10]} rotation={[-0.10, 0.10, 0]}><planeGeometry args={[0.72, 0.60]} /><meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.9} /></mesh>
}
