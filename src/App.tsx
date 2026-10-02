import { useCallback, useEffect, useRef, useState } from 'react'
import { BirthdayAudio, type AudioStatus } from './audio/birthdayAudio'
import { AudioToggle } from './components/AudioToggle'
import { BalloonScene } from './components/BalloonScene'
import { BirthdayCard, type CardPhase } from './components/BirthdayCard'
import { BirthdayMessage } from './components/BirthdayMessage'
import { Confetti, type ConfettiHandle } from './components/Confetti'
import { PhotoGallery } from './components/PhotoGallery'
import { Reveal } from './components/Reveal'
import { content } from './content'

const prefersReducedMotion = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Opening choreography, in ms after the tap. */
const TIMELINE = { balloons: 380, confetti: 700, settled: 1900 }
const TIMELINE_REDUCED = { balloons: 0, confetti: 0, settled: 350 }

export default function App() {
  const [phase, setPhase] = useState<CardPhase>('closed')
  const [balloons, setBalloons] = useState(false)
  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle')
  const [muted, setMuted] = useState(false)

  const audio = useRef<BirthdayAudio | null>(null)
  const confetti = useRef<ConfettiHandle>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const burstFrom = useCallback((el: Element | null) => {
    if (!el || prefersReducedMotion()) return
    try {
      const r = el.getBoundingClientRect()
      confetti.current?.burst(r.left + r.width / 2, r.top + r.height * 0.45)
    } catch {
      /* decorative only */
    }
  }, [])

  const open = () => {
    if (phase !== 'closed') return

    // Audio must start inside this click handler for mobile autoplay rules.
    try {
      const a = new BirthdayAudio()
      a.subscribe(setAudioStatus)
      audio.current = a
      a.start()
    } catch {
      setAudioStatus('unavailable')
    }

    setPhase('opening')
    const t = prefersReducedMotion() ? TIMELINE_REDUCED : TIMELINE
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
    later(() => setBalloons(true), t.balloons)
    later(() => burstFrom(stageRef.current?.querySelector('.card') ?? null), t.confetti)
    later(() => {
      setPhase('open')
      titleRef.current?.focus({ preventScroll: true })
    }, t.settled)
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    audio.current?.setMuted(next)
  }

  const replayAudio = () => {
    setMuted(false)
    audio.current?.replay()
  }

  const isClosed = phase === 'closed'

  return (
    <>
      <main className={`app${isClosed ? ' is-closed' : ''}`}>
        <div className="stage" ref={stageRef}>
          <BalloonScene active={balloons} />
          <BirthdayCard ref={titleRef} phase={phase} onOpen={open} />
          {isClosed && (
            <p className="stage__hint" aria-hidden="true">
              tap to open
            </p>
          )}
          {phase === 'open' && (
            <a className="stage__scroll" href="#early-title">
              <span>Keep scrolling</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" width="16" height="16">
                <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </a>
          )}
        </div>

        {phase === 'open' && (
          <div className="story">
            <PhotoGallery id="early-title" {...content.early} />
            <PhotoGallery id="grown-title" {...content.grown} />
            <BirthdayMessage />
            <section className="section closing" aria-labelledby="closing-title">
              <Reveal>
                <h2 id="closing-title" className="closing__title">
                  {content.closing.heading}
                </h2>
                <p className="closing__wish">{content.closing.wish}</p>
                <button type="button" className="btn btn--soft" onClick={(e) => burstFrom(e.currentTarget)}>
                  {content.closing.replay}
                </button>
              </Reveal>
            </section>
            <footer className="footer">{content.closing.footer}</footer>
          </div>
        )}
      </main>

      {!isClosed && (
        <AudioToggle status={audioStatus} muted={muted} onToggleMute={toggleMute} onReplay={replayAudio} />
      )}
      <Confetti ref={confetti} />
    </>
  )
}
