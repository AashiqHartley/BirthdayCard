import type { Photo } from '../content'
import { Polaroid } from './Photo'
import { Reveal } from './Reveal'

type Props = {
  id: string
  heading: string
  intro: string
  photos: Photo[]
}

// A gentle, repeatable scatter so the page feels like a scrapbook rather than a grid
const TILTS = [-2.5, 1.8, -1.2, 2.6, -2, 1.2]

export function PhotoGallery({ id, heading, intro, photos }: Props) {
  return (
    <section className="section gallery" aria-labelledby={id}>
      <Reveal className="section__head">
        <h2 id={id} className="section__title">
          {heading}
        </h2>
        <p className="section__intro">{intro}</p>
      </Reveal>
      <ul className="gallery__list">
        {photos.map((photo, i) => (
          <li key={photo.src + i} className={`gallery__item gallery__item--${photo.shape}`}>
            <Reveal delay={(i % 3) * 90}>
              <Polaroid
                photo={photo}
                tilt={TILTS[i % TILTS.length]}
                tape={i % 2 === 0}
                ratio={photo.shape === 'portrait' ? '4 / 5' : '4 / 3'}
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
