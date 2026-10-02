import type { AudioStatus } from '../audio/birthdayAudio'

type Props = {
  status: AudioStatus
  muted: boolean
  onToggleMute: () => void
  onReplay: () => void
}

export function AudioToggle({ status, muted, onToggleMute, onReplay }: Props) {
  if (status === 'unavailable' || status === 'idle') return null

  const ended = status === 'ended'
  const playing = status === 'playing' && !muted
  const label = ended ? 'Play the birthday song again' : muted ? 'Unmute the birthday song' : 'Mute the birthday song'
  const text = ended ? 'Play again' : muted ? 'Muted' : 'Playing'

  return (
    <button
      type="button"
      className={`audio-toggle${playing ? ' is-playing' : ''}`}
      onClick={ended ? onReplay : onToggleMute}
      aria-label={label}
      aria-pressed={ended ? undefined : muted}
      title={label}
    >
      <span className="audio-toggle__icon" aria-hidden="true">
        {ended ? (
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
        ) : muted ? (
          <svg viewBox="0 0 24 24">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
            <path d="M16 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <span className="eq">
            <i />
            <i />
            <i />
            <i />
          </span>
        )}
      </span>
      <span className="audio-toggle__text">{text}</span>
    </button>
  )
}
