import { useId, type CSSProperties } from 'react'

type BalloonColor = { light: string; base: string; deep: string }

const COLORS: Record<string, BalloonColor> = {
  blush: { light: '#ffe9ee', base: '#f2b3c3', deep: '#c9788f' },
  lavender: { light: '#f3ecff', base: '#cbb7ec', deep: '#9077bf' },
  gold: { light: '#fff6dc', base: '#e8c983', deep: '#b98f3e' },
  pearl: { light: '#ffffff', base: '#f6eadf', deep: '#cdb7a3' },
  sage: { light: '#f1f8ec', base: '#bfd5b2', deep: '#819d73' },
}

type BalloonSpec = {
  color: keyof typeof COLORS
  /** Final resting position, % of the scene box */
  x: number
  y: number
  /** Resting position on wide screens, where there is room beside the open card */
  lg: [number, number]
  /** Width in px at the 'md' size; scaled with --balloon-scale */
  size: number
  delay: number
  /** 0 = far back (smaller, softer), 1 = front */
  depth: number
  /** Horizontal start offset (vw) so balloons fan out from behind the card */
  fromX: number
  /** Drifts off the top instead of settling */
  away?: boolean
  tilt: number
}

// Settled balloons sit behind the card's top corners, so they never cover the content.
const BALLOONS: BalloonSpec[] = [
  { color: 'blush', x: 6, y: 4, size: 96, delay: 0.15, depth: 1, fromX: 30, tilt: -6, lg: [4, 12] },
  { color: 'lavender', x: 74, y: 1, size: 104, delay: 0.3, depth: 1, fromX: -26, tilt: 5, lg: [85, 8] },
  { color: 'gold', x: 20, y: -2, size: 70, delay: 0.5, depth: 0.4, fromX: 18, tilt: 3, lg: [13, 30] },
  { color: 'sage', x: 86, y: 14, size: 68, delay: 0.62, depth: 0.35, fromX: -30, tilt: -4, lg: [90, 34] },
  { color: 'pearl', x: 60, y: -8, size: 64, delay: 0.42, depth: 0.25, fromX: -6, tilt: 2, away: true, lg: [70, -10] },
  { color: 'blush', x: 32, y: -6, size: 58, delay: 0.85, depth: 0.2, fromX: 8, tilt: -3, away: true, lg: [24, -8] },
]

function Balloon({ spec }: { spec: BalloonSpec }) {
  const id = useId().replace(/:/g, '')
  const c = COLORS[spec.color]
  const style = {
    '--x': `${spec.x}%`,
    '--y': `${spec.y}%`,
    '--x-lg': `${spec.lg[0]}%`,
    '--y-lg': `${spec.lg[1]}%`,
    '--w': `${spec.size}px`,
    '--delay': `${spec.delay}s`,
    '--from-x': `${spec.fromX}vw`,
    '--tilt': `${spec.tilt}deg`,
    '--blur': `${(1 - spec.depth) * 1.6}px`,
    '--bob-delay': `${-spec.delay * 3}s`,
    zIndex: Math.round(spec.depth * 10),
  } as CSSProperties

  return (
    <div className={`balloon${spec.away ? ' balloon--away' : ''}`} style={style}>
      <div className="balloon__bob">
        <svg viewBox="0 0 100 190" className="balloon__svg">
          <defs>
            <radialGradient id={`b${id}`} cx="34%" cy="30%" r="78%">
              <stop offset="0" stopColor={c.light} />
              <stop offset="0.42" stopColor={c.base} />
              <stop offset="1" stopColor={c.deep} />
            </radialGradient>
            <radialGradient id={`r${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            className="balloon__string"
            d="M50 124 C 43 142, 58 156, 49 172 S 46 184, 52 190"
            fill="none"
            stroke={c.deep}
            strokeOpacity="0.55"
            strokeWidth="0.9"
          />
          <path d="M45.5 125 L54.5 125 L50 117.5 Z" fill={c.deep} />
          <path
            d="M50 3 C 77 3, 95 25, 95 54 C 95 86, 71 112, 53 118.5 Q 50 119.6 47 118.5 C 29 112, 5 86, 5 54 C 5 25, 23 3, 50 3 Z"
            fill={`url(#b${id})`}
          />
          {/* specular highlight + soft rim reflection give the volume */}
          <ellipse cx="32" cy="34" rx="11" ry="19" fill={`url(#r${id})`} transform="rotate(-24 32 34)" />
          <ellipse cx="27" cy="27" rx="3.2" ry="5.5" fill="#fff" opacity="0.75" transform="rotate(-24 27 27)" />
          <path
            d="M80 64 C 78 80, 70 94, 60 102"
            stroke="#fff"
            strokeOpacity="0.28"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  )
}

export function BalloonScene({ active }: { active: boolean }) {
  return (
    <div className={`balloons${active ? ' is-active' : ''}`} aria-hidden="true">
      {BALLOONS.map((b, i) => (
        <Balloon key={i} spec={b} />
      ))}
    </div>
  )
}
