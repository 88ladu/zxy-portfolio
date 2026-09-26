let audioContext: AudioContext | null = null
let timer: number | null = null
let master: GainNode | null = null
let playing = false

const notes = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66]

function getContext() {
  audioContext ??= new AudioContext()
  return audioContext
}

function playNote(ctx: AudioContext, frequency: number, start: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.16, start + 0.025)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.34)
  osc.connect(gain)
  gain.connect(master ?? ctx.destination)
  osc.start(start)
  osc.stop(start + 0.36)
}

function scheduleLoop() {
  const ctx = getContext()
  const base = ctx.currentTime + 0.04
  notes.forEach((frequency, index) => playNote(ctx, frequency, base + index * 0.25))
}

export function toggleCassetteMusic() {
  const ctx = getContext()
  if (ctx.state === 'suspended') void ctx.resume()
  if (playing) {
    if (timer) window.clearInterval(timer)
    master?.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1)
    timer = null
    playing = false
    return false
  }

  master = ctx.createGain()
  master.gain.setValueAtTime(0.22, ctx.currentTime)
  master.connect(ctx.destination)
  scheduleLoop()
  timer = window.setInterval(scheduleLoop, notes.length * 250)
  playing = true
  return true
}
