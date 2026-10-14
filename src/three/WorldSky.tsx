import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useApp } from '@/store'

export function WorldSky() {
  const weather = useApp(s => s.weather), time = useApp(s => s.time)
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const resources = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 256
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
    const stars = new THREE.BufferGeometry(), points = new Float32Array(1800 * 3)
    let seed = 142; const rand = () => {seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296}
    for (let i = 0; i < 1800; i++) {
      const y = rand() * 1.5 - .5, a = rand() * Math.PI * 2, r = Math.sqrt(1-y*y)
      points[i*3]=61*r*Math.cos(a);points[i*3+1]=61*y;points[i*3+2]=61*r*Math.sin(a)
    }
    stars.setAttribute('position',new THREE.BufferAttribute(points,3))
    return { canvas, texture, stars }
  }, [])
  const last = useRef(-1)
  const paint = (clock: number) => {
    const c = resources.canvas, ctx = c.getContext('2d')!, night = time === 'night'
    const colors = weather === 'aurora' ? ['#060d22','#172e3b'] : weather === 'ocean' ? (night?['#071021','#243945']:['#8eb7cd','#d9e9e9']) : weather === 'rain' ? (night?['#0c1927','#253945']:['#5d7584','#9aabb1']) : weather === 'snow' ? (night?['#102134','#405969']:['#a8c0cf','#eff3f1']) : (night?['#101526','#303342']:['#e5dece','#f2eadc'])
    const bg = ctx.createLinearGradient(0,0,0,c.height);bg.addColorStop(0,colors[0]);bg.addColorStop(1,colors[1]);ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height)
    if(weather==='aurora') {
      ctx.save();ctx.filter='blur(6px)';ctx.globalAlpha=.7
      for(let band=0;band<3;band++) {
        const glow=ctx.createLinearGradient(0,120,0,245)
        glow.addColorStop(0,'rgba(47,199,169,0)');glow.addColorStop(.4,band===1?'rgba(123,100,226,.55)':'rgba(55,216,165,.6)');glow.addColorStop(1,'rgba(36,122,165,0)')
        ctx.beginPath()
        for(let x=0;x<=c.width;x+=4){const y=160+20*Math.sin(x*.014+clock*.1+band)+12*Math.sin(x*.032-clock*.07)+band*7;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
        for(let x=c.width;x>=0;x-=4){const y=205+20*Math.sin(x*.014+clock*.1+band)+12*Math.sin(x*.032-clock*.07)+band*7;ctx.lineTo(x,y)}
        ctx.closePath();ctx.fillStyle=glow;ctx.fill()
      }
      ctx.restore()
    }
    resources.texture.needsUpdate=true
  }
  useEffect(()=>{paint(0);last.current=-1},[weather,time,resources])
  useEffect(()=>()=>{resources.texture.dispose();resources.stars.dispose()},[resources])
  useFrame(state=>{
    if(weather!=='aurora'||reduced)return
    const t=state.clock.elapsedTime
    if(t-last.current<.12)return
    last.current=t;paint(t)
  })
  return <group position={[0,1,-1]}><mesh renderOrder={-10}><sphereGeometry args={[65,40,20]}/><meshBasicMaterial map={resources.texture} side={THREE.BackSide} depthWrite={false}/></mesh>{(weather==='aurora'||time==='night')&&<points geometry={resources.stars}><pointsMaterial color="#e9f0ff" size={.12} transparent opacity={.85} depthWrite={false}/></points>}</group>
}
export function OceanSurface() {
  const weather=useApp(s=>s.weather),time=useApp(s=>s.time)
  const reduced=useMemo(()=>matchMedia('(prefers-reduced-motion: reduce)').matches,[])
  const geometry=useMemo(()=>new THREE.PlaneGeometry(160,160,80,80),[])
  const material=useMemo(()=>new THREE.MeshPhongMaterial({color:'#247b94',specular:'#b6e0e8',shininess:95,side:THREE.DoubleSide}),[])
  useEffect(()=>{material.color.set(time==='night'?'#102c42':'#247b94')},[time,material])
  useEffect(()=>()=>{geometry.dispose();material.dispose()},[geometry,material])
  useFrame(state=>{
    if(weather!=='ocean')return
    const t=reduced?0:state.clock.elapsedTime,a=geometry.attributes.position
    for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i);a.setZ(i,Math.sin(x*.65+t*.9)*.025+Math.cos(y*.85-t*.7)*.025)}
    a.needsUpdate=true;geometry.computeVertexNormals()
  })
  if(weather!=='ocean')return null
  return <mesh position={[0,-.16,-1]} rotation={[-Math.PI/2,0,0]} geometry={geometry} material={material}/>
}
