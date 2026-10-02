/**
 * Birthday audio engine.
 *
 * - Plays public/audio/happy-birthday.mp3 when it exists at build time.
 * - Otherwise (or if the file fails) plays a synthesized music-box arrangement of
 *   "Happy Birthday to You" (the melody is in the public domain).
 * - start() must be called from inside a user gesture (the "Open" button click)
 *   so mobile browsers allow sound.
 * - Never throws: any failure just leaves the card silent.
 */

export type AudioStatus = 'idle' | 'playing' | 'ended' | 'unavailable'

type Listener = (status: AudioStatus) => void

const FILE_URL = `${import.meta.env.BASE_URL}audio/happy-birthday.mp3`
const VOLUME = 0.85
const FADE_IN_S = 2.4

type Ctor = typeof AudioContext

function getAudioContextCtor(): Ctor | undefined {
  const w = window as unknown as { AudioContext?: Ctor; webkitAudioContext?: Ctor }
  return w.AudioContext ?? w.webkitAudioContext
}

// Melody in C major, 3/4. [MIDI note, beats]
const MELODY: Array<[number, number]> = [
  [67, 0.75], [67, 0.25], [69, 1], [67, 1], [72, 1], [71, 2],
  [67, 0.75], [67, 0.25], [69, 1], [67, 1], [74, 1], [72, 2],
  [67, 0.75], [67, 0.25], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
  [77, 0.75], [77, 0.25], [76, 1], [72, 1], [74, 1], [72, 3],
]

// Soft bass under the melody: [beat offset from the downbeat after the pickup, MIDI, beats]
const BASS: Array<[number, number, number]> = [
  [0, 48, 3], [3, 43, 3], [6, 43, 3], [9, 48, 3],
  [12, 48, 3], [15, 41, 3], [18, 43, 3], [21, 48, 3],
]

const midiToHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12)

export class BirthdayAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private el: HTMLAudioElement | null = null
  private endTimer = 0
  private usingSynth = false
  private muted = false
  status: AudioStatus = 'idle'
  private listeners = new Set<Listener>()

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => {
      this.listeners.delete(fn)
    }
  }

  private setStatus(s: AudioStatus) {
    this.status = s
    this.listeners.forEach((fn) => fn(s))
  }

  get isMuted() {
    return this.muted
  }

  /** Call synchronously from the click handler. */
  start() {
    try {
      // iOS 17+: let the song play even when the ringer switch is on silent.
      const nav = navigator as Navigator & { audioSession?: { type: string } }
      if (nav.audioSession) nav.audioSession.type = 'playback'
    } catch {
      /* optional enhancement */
    }

    const Ctx = getAudioContextCtor()
    if (Ctx) {
      try {
        this.ctx = new Ctx()
        this.master = this.ctx.createGain()
        this.master.gain.value = 0
        this.master.connect(this.ctx.destination)
        void this.ctx.resume().catch(() => {})
      } catch {
        this.ctx = null
        this.master = null
      }
    }

    if (__HAS_AUDIO_FILE__) {
      this.playFile()
    } else if (this.ctx) {
      this.playSynth()
    } else {
      this.setStatus('unavailable')
    }
  }

  private fadeIn() {
    if (!this.ctx || !this.master) return
    const g = this.master.gain
    const t = this.ctx.currentTime
    g.cancelScheduledValues(t)
    g.setValueAtTime(0.0001, t)
    g.linearRampToValueAtTime(this.muted ? 0 : VOLUME, t + FADE_IN_S)
  }

  private playFile() {
    const el = new Audio()
    el.preload = 'auto'
    el.src = FILE_URL
    this.el = el
    let settled = false

    const fallback = () => {
      if (settled) return
      settled = true
      el.pause()
      el.removeAttribute('src')
      this.el = null
      if (this.ctx) this.playSynth()
      else this.setStatus('unavailable')
    }

    el.addEventListener('error', fallback, { once: true })
    el.addEventListener('playing', () => {
      settled = true
      this.setStatus('playing')
    })
    el.addEventListener('ended', () => this.setStatus('ended'))

    if (this.ctx && this.master) {
      try {
        this.ctx.createMediaElementSource(el).connect(this.master)
      } catch {
        // Route directly if Web Audio can't take the element; fade is then skipped.
        this.master = null
      }
    }
    this.fadeIn()
    el.play().catch(fallback)
    window.setTimeout(() => {
      if (!settled && el.paused) fallback()
    }, 4000)
  }

  private playSynth() {
    const ctx = this.ctx
    const out = this.master
    if (!ctx || !out) {
      this.setStatus('unavailable')
      return
    }
    this.usingSynth = true

    // A little room so the music box doesn't sound dry.
    const wet = ctx.createGain()
    wet.gain.value = 0.22
    const delay = ctx.createDelay(1)
    delay.delayTime.value = 0.19
    const fb = ctx.createGain()
    fb.gain.value = 0.32
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 2600
    delay.connect(fb).connect(tone).connect(delay)
    delay.connect(wet).connect(out)

    const beat = 0.56
    const start = ctx.currentTime + 0.35
    let t = start
    const rounds = 2
    for (let round = 0; round < rounds; round++) {
      const downbeat = t + MELODY[0][1] * beat + MELODY[1][1] * beat
      for (const [note, beats] of MELODY) {
        this.chime(note, t, 1.25 + beats * 0.4, 0.26, out, delay)
        if (round === 1) this.chime(note + 12, t, 0.9, 0.06, out, delay)
        t += beats * beat
      }
      for (const [offset, note, beats] of BASS) {
        this.pad(note, downbeat + offset * beat, beats * beat, out)
      }
      t += beat
    }
    // Final sparkle
    ;[72, 76, 79, 84].forEach((n, i) => this.chime(n, t + i * 0.12, 1.8, 0.12, out, delay))

    this.fadeIn()
    this.setStatus('playing')
    const totalMs = (t - ctx.currentTime + 2.4) * 1000
    window.clearTimeout(this.endTimer)
    this.endTimer = window.setTimeout(() => this.setStatus('ended'), totalMs)
  }

  private chime(midi: number, when: number, length: number, level: number, out: AudioNode, send: AudioNode) {
    const ctx = this.ctx!
    const f = midiToHz(midi)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, when)
    env.gain.exponentialRampToValueAtTime(level, when + 0.006)
    env.gain.exponentialRampToValueAtTime(0.0001, when + length)
    env.connect(out)
    env.connect(send)
    // Fundamental + a few slightly detuned partials = music-box timbre
    const partials: Array<[number, number]> = [[1, 1], [2.0, 0.32], [3.01, 0.12], [4.2, 0.05]]
    for (const [mult, amp] of partials) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f * mult
      const g = ctx.createGain()
      g.gain.value = amp
      osc.connect(g).connect(env)
      osc.start(when)
      osc.stop(when + length + 0.05)
    }
  }

  private pad(midi: number, when: number, length: number, out: AudioNode) {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = midiToHz(midi)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, when)
    env.gain.linearRampToValueAtTime(0.09, when + 0.08)
    env.gain.exponentialRampToValueAtTime(0.0001, when + length + 0.4)
    osc.connect(env).connect(out)
    osc.start(when)
    osc.stop(when + length + 0.5)
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (this.ctx && this.master) {
      const g = this.master.gain
      const t = this.ctx.currentTime
      g.cancelScheduledValues(t)
      g.setValueAtTime(g.value, t)
      g.linearRampToValueAtTime(muted ? 0 : VOLUME, t + 0.35)
    } else if (this.el) {
      this.el.muted = muted
    }
  }

  replay() {
    if (this.status !== 'ended') return
    void this.ctx?.resume().catch(() => {})
    this.setMuted(false)
    if (this.usingSynth) {
      this.playSynth()
    } else if (this.el) {
      this.el.currentTime = 0
      this.fadeIn()
      this.el.play().catch(() => this.setStatus('ended'))
    }
  }
}
