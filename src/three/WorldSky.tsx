import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useApp } from '@/store'

export function WorldSky() {
  const weather = useApp(s => s.weather), time = useApp(s => s.time)
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const resources = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512
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
      ctx.save();ctx.filter='blur(8px)';ctx.globalAlpha=.85;ctx.globalCompositeOperation='screen'
      for(let band=0;band<5;band++) {
        const glow=ctx.createLinearGradient(0,230,0,495)
        const palette = ['72,235,174','56,205,245','126,111,255','231,105,218','91,238,216']
        glow.addColorStop(0,`rgba(${palette[band]},0)`);glow.addColorStop(.35,`rgba(${palette[band]},.25)`);glow.addColorStop(.65,`rgba(${palette[band]},.8)`);glow.addColorStop(1,`rgba(${palette[band]},0)`)
        ctx.beginPath()
        for(let x=0;x<=c.width;x+=4){const y=310+42*Math.sin(x*.007+clock*.13+band*.8)+24*Math.sin(x*.016-clock*.09)+band*12;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
        for(let x=c.width;x>=0;x-=4){const y=405+42*Math.sin(x*.007+clock*.13+band*.8)+24*Math.sin(x*.016-clock*.09)+band*12;ctx.lineTo(x,y)}
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
  const weather = useApp(s => s.weather), time = useApp(s => s.time), low = useApp(s => s.lowSpec)
  const reduced = useMemo(() => matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const last = useRef(-1)
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(160,160,low ? 120 : 240,low ? 120 : 240)
    g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(g.attributes.position.count*3),3))
    return g
  },[low])
  const material = useMemo(() => new THREE.MeshPhongMaterial({
    color:'#ffffff',vertexColors:true,specular:'#c6e6eb',shininess:110,side:THREE.FrontSide
  }),[])
  const waterColors = useMemo(() => ({
    deep:new THREE.Color(time==='night'?'#081d32':'#12617d'),
    shallow:new THREE.Color(time==='night'?'#205269':'#439fac'),
    foam:new THREE.Color(time==='night'?'#668a9b':'#c0e3df'),
    current:new THREE.Color()
  }),[time])
  useEffect(() => { last.current=-1 },[weather,time,geometry])
  useEffect(() => () => geometry.dispose(),[geometry])
  useEffect(() => () => material.dispose(),[material])
  useFrame(state => {
    if(weather!=='ocean') return
    const t=reduced?0:state.clock.elapsedTime
    if(last.current>=0 && (reduced || t-last.current<1/30)) return
    last.current=t
    const p=geometry.attributes.position,c=geometry.attributes.color
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i)
      const longWave=Math.sin(x*.85+y*.42-t*1.15)
      const crossing=Math.sin(x*-.36+y*1.15-t*.8)
      const ripple=Math.sin(x*3.5+y*2.2-t*2.1)
      p.setZ(i,longWave*.075+crossing*.035+ripple*.012)
      const light=(longWave+crossing*.35+1.35)/2.7
      waterColors.current.copy(waterColors.deep).lerp(waterColors.shallow,light)
      const crest=Math.pow(Math.max(0,(longWave-.72)/.28),3)
      const broken=.5+.5*Math.sin(x*5-y*3+t*.5)
      waterColors.current.lerp(waterColors.foam,crest*broken*.6)
      c.setXYZ(i,waterColors.current.r,waterColors.current.g,waterColors.current.b)
    }
    p.needsUpdate=true;c.needsUpdate=true;geometry.computeVertexNormals()
  })
  if(weather!=='ocean') return null
  return <mesh position={[0,-.2,-1]} rotation={[-Math.PI/2,0,0]} geometry={geometry} material={material}/>
}
