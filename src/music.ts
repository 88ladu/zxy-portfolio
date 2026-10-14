import { assetPath } from './assetPath'
import { useApp } from './store'
let audio: HTMLAudioElement | null = null
export function studioAudio() {
  if (!audio) {
    audio = new Audio(assetPath('/audio/studio-ambient.mp3'))
    audio.loop = true
    audio.volume = 0.45
    audio.addEventListener('play', () => useApp.getState().setMusicOn(true))
    audio.addEventListener('pause', () => useApp.getState().setMusicOn(false))
    audio.addEventListener('error', () => useApp.getState().setMusicOn(false))
  }
  return audio
}
export function openStudioPlayer() {
  useApp.getState().setMusicPanelOpen(true)
}
