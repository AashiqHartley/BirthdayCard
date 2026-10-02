import { content } from '../content'
import { Polaroid } from './Photo'
import { Reveal } from './Reveal'

export function BirthdayMessage() {
  const { letter } = content
  return (
    <section className="section letter" aria-labelledby="letter-title">
      <Reveal className="section__head">
        <h2 id="letter-title" className="section__title">
          {letter.heading}
        </h2>
      </Reveal>
      <div className="letter__layout">
        <Reveal className="letter__photo">
          <Polaroid photo={letter.photo} tilt={-3} tape ratio="4 / 5" />
        </Reveal>
        <Reveal delay={120} className="letter__paper-wrap">
          <article className="letter__paper">
            <p className="letter__greeting">{letter.greeting}</p>
            {letter.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="letter__signoff">
              {letter.signOff}
              <span className="letter__signature">{letter.signature}</span>
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
