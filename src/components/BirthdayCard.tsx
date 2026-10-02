import { forwardRef, type CSSProperties } from 'react'
import { content } from '../content'
import { Photo, Polaroid } from './Photo'

export type CardPhase = 'closed' | 'opening' | 'open'

type Props = {
  phase: CardPhase
  onOpen: () => void
}

/**
 * The physical card: a front cover hinged on the left over the inside page.
 * The inside page is the hero of the open experience.
 */
export const BirthdayCard = forwardRef<HTMLHeadingElement, Props>(function BirthdayCard(
  { phase, onOpen },
  titleRef,
) {
  const closed = phase === 'closed'
  const { cover, insideLeft, hero, name } = content

  return (
    <div className="card" data-phase={phase}>
      {/* Inside right page — revealed as the cover swings open */}
      <div className="card__inside paper" inert={closed}>
        <p className="inside__eyebrow stagger" style={{ '--i': 0 } as CSSProperties}>
          {hero.eyebrow}
        </p>
        <h1 ref={titleRef} tabIndex={-1} className="inside__title stagger" style={{ '--i': 1 } as CSSProperties}>
          <span className="inside__title-small">Happy</span>
          <span className="inside__title-big">
            19<sup>th</sup>
          </span>
          <span className="inside__title-small">Birthday{name ? `, ${name}` : ''}</span>
        </h1>
        <div className="inside__photo stagger" style={{ '--i': 2 } as CSSProperties}>
          <Photo photo={hero.photo} className="arch" eager />
        </div>
        <p className="inside__line stagger" style={{ '--i': 3 } as CSSProperties}>
          {hero.line}
        </p>
      </div>

      {/* Front cover: front face + back face (the inside-left page on wide screens) */}
      <div className="card__cover" inert={!closed}>
        <div className="cover__front paper">
          <div className="cover__frame">
            <p className="cover__eyebrow">{cover.eyebrow}</p>
            <Photo photo={cover.photo} className="cover__photo arch" ratio="4 / 4.2" eager />
            <h1 className="cover__title">
              <span className="visually-hidden">Happy birthday — </span>
              {cover.title}
            </h1>
            <p className="cover__subtitle">{cover.subtitle}</p>
            <button type="button" className="btn btn--open" onClick={onOpen} disabled={!closed}>
              <span>Open your card</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
                <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="cover__back paper" aria-hidden="true">
          <Polaroid photo={insideLeft.photo} tilt={-4} tape ratio="4 / 3" />
          <p className="cover__back-text">{insideLeft.text}</p>
        </div>
      </div>
    </div>
  )
})
