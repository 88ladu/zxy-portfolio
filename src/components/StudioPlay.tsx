import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { useApp } from '@/store'
import { studioAudio } from '@/music'
import { assetPath } from '@/assetPath'
import './StudioPlay.css'

export function Atmosphere() {
  const weather=useApp(s=>s.weather)
  return <div className={`studio-sky sky-${weather}`} aria-hidden="true">{(weather==='rain'||weather==='snow')&&<div className={`weather-flakes flakes-${weather}`}>{Array.from({length:weather==='rain'?48:36},(_,i)=><span key={i} style={{left:`${(i*37)%100}%`,animationDelay:`-${(i*1.7)%12}s`,animationDuration:`${weather==='rain'?1.1+(i%4)*.18:7+(i%5)}s`,top:`${(i*19)%100}%`}} />)}</div>}{weather==='aurora'&&<><div className="aurora-ribbon ribbon-one"/><div className="aurora-ribbon ribbon-two"/></>}</div>
}
export function MusicPlayer() {
  const open=useApp(s=>s.musicPanelOpen),playing=useApp(s=>s.musicOn)
  const [position,setPosition]=useState(0),[duration,setDuration]=useState(48),[volume,setVolume]=useState(.45),[title,setTitle]=useState('工作岛 · 原创环境音乐'),[error,setError]=useState('')
  const custom=useRef<string|null>(null)
  useEffect(()=>{const a=studioAudio();const sync=()=>{setPosition(a.currentTime);setDuration(Number.isFinite(a.duration)?a.duration:48)};const fail=()=>setError('音乐未能加载，请重试或选择本地音乐。');a.addEventListener('timeupdate',sync);a.addEventListener('loadedmetadata',sync);a.addEventListener('error',fail);return()=>{a.removeEventListener('timeupdate',sync);a.removeEventListener('loadedmetadata',sync);a.removeEventListener('error',fail)}},[])
  useEffect(()=>()=>{if(custom.current)URL.revokeObjectURL(custom.current)},[])
  if(!open)return null
  const toggle=async()=>{const a=studioAudio();setError('');if(!a.paused)a.pause();else try{await a.play()}catch{setError('播放失败，请选择其他音频或重试。')}}
  const format=(n:number)=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`
  return <aside className="studio-player" aria-label="唱片音乐播放器"><div className="player-heading"><span>STUDIO RADIO</span><button aria-label="收起音乐播放栏" onClick={()=>useApp.getState().setMusicPanelOpen(false)}>×</button></div><strong>{title}</strong><div className="player-track"><button className="play-toggle" onClick={toggle} aria-label={playing?'暂停音乐':'播放音乐'}>{playing?'Ⅱ':'▶'}</button><div><input type="range" aria-label="音乐播放进度" min="0" max={duration} step=".1" value={Math.min(position,duration)} onChange={e=>{studioAudio().currentTime=Number(e.target.value);setPosition(Number(e.target.value))}}/><small>{format(position)} / {format(duration)}</small></div></div><label className="volume-row">音量<input type="range" aria-label="音乐音量" min="0" max="1" step=".01" value={volume} onChange={e=>{const v=Number(e.target.value);setVolume(v);studioAudio().volume=v}}/></label><label className="local-music">选择自己的音乐<input type="file" accept="audio/*" onChange={e=>{const f=e.target.files?.[0];if(!f)return;const a=studioAudio();a.pause();if(custom.current)URL.revokeObjectURL(custom.current);custom.current=URL.createObjectURL(f);a.src=custom.current;setTitle(f.name);setPosition(0);setError('');a.load()}}/></label>{custom.current&&<button className="restore-music" onClick={()=>{const a=studioAudio();a.pause();a.src=assetPath('/audio/studio-ambient.mp3');a.load();setTitle('工作岛 · 原创环境音乐');if(custom.current)URL.revokeObjectURL(custom.current);custom.current=null;setPosition(0);setError('')}}>恢复原创音乐</button>}{error&&<p role="alert">{error}</p>}</aside>
}
export function StudioExperiences() {
  const overlay=useApp(s=>s.overlay),close=()=>useApp.getState().setOverlay(null)
  const drawing=useApp(s=>s.drawing)
  const [view,setView]=useState<'render'|'site'>('site')
  const dialog=useRef<HTMLElement>(null)
  useEffect(()=>{
    if(!['project-files','case-preview','draw'].includes(overlay||''))return
    const previous=document.activeElement as HTMLElement|null
    const root=dialog.current
    root?.querySelector<HTMLButtonElement>('button')?.focus()
    const keys=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.stopPropagation();close();return}
      if(e.key!=='Tab'||!root)return
      const list=[...root.querySelectorAll<HTMLElement>('button,a[href],input')].filter(el=>!el.hasAttribute('disabled'))
      const first=list[0],last=list[list.length-1]
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
    }
    const old=document.body.style.overflow;document.body.style.overflow='hidden'
    document.addEventListener('keydown',keys,true)
    return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',keys,true);previous?.focus()}
  },[overlay])
  if(!['project-files','case-preview','draw'].includes(overlay||''))return null
  return <div className="studio-experience-backdrop" onClick={e=>{if(e.target===e.currentTarget)close()}}><section ref={dialog} className={`studio-experience ${overlay}`} role="dialog" aria-modal="true" aria-label={overlay==='draw'?'画架涂鸦':overlay==='project-files'?'桌面项目文件':'798方案与现场'}><button className="experience-close" aria-label="关闭体验" onClick={close}>×</button>{overlay==='project-files'?<><p className="experience-kicker">ON MY DESK</p><h2>打开一份设计实践</h2><div className="project-folders"><button onClick={()=>useApp.getState().setOverlay('case-preview')}><img src={assetPath('/projects/798/hero-final.jpg')} alt="798艺术节现场"/><span>798 · 多觉共生</span><small>方案 / 现场 / 项目档案</small></button><a href="#/portfolio" onClick={close}><span>更多项目档案</span><small>项目 02 / 03 / 04 · 待补充</small></a><a href="#/projects" onClick={close}><span>我的实践经历</span><small>设计 / 研究 / 项目协同</small></a></div></>:overlay==='case-preview'?<><p className="experience-kicker">FROM CONCEPT TO REALITY</p><h2>798 · 从方案到现场</h2><div className="case-switch"><button aria-pressed={view==='render'} onClick={()=>setView('render')}>方案渲染</button><button aria-pressed={view==='site'} onClick={()=>setView('site')}>落地现场</button></div><img className="case-preview-image" src={assetPath(view==='render'?'/projects/798/render-immersive.jpg':'/projects/798/hero-final.jpg')} alt={view==='render'?'798项目方案渲染资料':'798主题展落地现场'}/><p className="case-context">{view==='render'?'方案阶段：空间氛围与三维设计表达':'落地阶段：展览现场与真实观众体验'} · 两张资料用于展示项目不同阶段。</p><a className="experience-link" href={assetPath('/projects/798.html')} target="_blank" rel="noopener noreferrer">查看完整项目介绍 ↗</a></>:<DrawPad key="drawing" initial={drawing} close={close}/>}</section></div>
}
function DrawPad({initial,close}:{initial:string|null;close:()=>void}) {
  const canvas=useRef<HTMLCanvasElement>(null),down=useRef(false),[color,setColor]=useState('#655040'),[width,setWidth]=useState(5)
  const blank=()=>{const c=canvas.current;if(!c)return;const ctx=c.getContext('2d')!;ctx.fillStyle='#f6f0e3';ctx.fillRect(0,0,c.width,c.height)}
  useEffect(()=>{blank();if(initial){const img=new Image();img.onload=()=>canvas.current?.getContext('2d')?.drawImage(img,0,0);img.src=initial}},[initial])
  const point=(e:PointerEvent<HTMLCanvasElement>)=>{const c=e.currentTarget,r=c.getBoundingClientRect();return[(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height]}
  const save=()=>{if(canvas.current)useApp.getState().setDrawing(canvas.current.toDataURL('image/png'));close()}
  return <><p className="experience-kicker">A LITTLE IDEA</p><h2>在我的画架上，留下一笔</h2><div className="draw-tools"><label>颜色<input aria-label="画笔颜色" type="color" value={color} onChange={e=>setColor(e.target.value)}/></label><label>笔触<input aria-label="画笔粗细" type="range" min="2" max="24" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label><button onClick={blank}>清空画布</button></div><canvas ref={canvas} width="900" height="600" aria-label="可用鼠标或触控绘画的画布" onPointerDown={e=>{down.current=true;e.currentTarget.setPointerCapture(e.pointerId);const ctx=e.currentTarget.getContext('2d')!,[x,y]=point(e);ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,width/2,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(x,y)}} onPointerMove={e=>{if(!down.current)return;const ctx=e.currentTarget.getContext('2d')!,[x,y]=point(e);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(x,y);ctx.stroke()}} onPointerUp={()=>down.current=false} onPointerCancel={()=>down.current=false}/><div className="draw-finish"><small>画作会留在本次浏览的工作岛里。</small><button onClick={save}>放回画架 →</button></div></>
}
