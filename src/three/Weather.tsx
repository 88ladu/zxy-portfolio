import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useApp } from '@/store'
export function WeatherParticles() {
  const weather = useApp(s => s.weather), low = useApp(s => s.lowSpec)
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const geometry = useMemo(() => {
    const n = low ? 100 : 280, rain = weather === 'rain', vertices = new Float32Array(n * (rain ? 6 : 3))
    for (let i = 0; i < n; i++) { const k = i * (rain ? 6 : 3); vertices[k] = Math.random()*16-8; vertices[k+1] = Math.random()*10; vertices[k+2] = Math.random()*12-7; if(rain){vertices[k+3]=vertices[k]+0.08;vertices[k+4]=vertices[k+1]+0.32;vertices[k+5]=vertices[k+2]} }
    const g = new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(vertices,3));return g
  }, [weather, low])
  useEffect(() => () => geometry.dispose(), [geometry])
  useFrame((state, dt) => {
    if(reduced || (weather !== 'rain' && weather !== 'snow'))return
    const a = geometry.attributes.position, rain = weather === 'rain', step = rain ? 2 : 1
    for(let i=0;i<a.count;i+=step){let y=a.getY(i)-Math.min(dt,.05)*(rain?7:.8);if(y<0)y=10;const x=a.getX(i)+(rain?-.12:Math.sin(state.clock.elapsedTime+i)*.12)*dt;a.setXYZ(i,x,y,a.getZ(i));if(rain)a.setXYZ(i+1,x+.08,y+.32,a.getZ(i))} a.needsUpdate=true
  })
  if(weather !== 'rain' && weather !== 'snow') return null
  return weather==='rain'?<lineSegments geometry={geometry}><lineBasicMaterial color="#c8d9e4" transparent opacity={.45} depthWrite={false} /></lineSegments>:<points geometry={geometry}><pointsMaterial color="#ffffff" size={.045} transparent opacity={.85} depthWrite={false} /></points>
}
