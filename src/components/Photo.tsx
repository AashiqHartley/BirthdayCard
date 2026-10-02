import { useState, type CSSProperties } from 'react'
import type { Photo as PhotoData } from '../content'

type Props = {
  photo: PhotoData
  className?: string
  eager?: boolean
  /** Aspect ratio of the frame, e.g. '4 / 5'. Defaults to the photo's own ratio. */
  ratio?: string
}

/** An image that keeps faces in frame and degrades to a soft paper tile if it fails to load. */
export function Photo({ photo, className = '', eager = false, ratio }: Props) {
  const [failed, setFailed] = useState(false)
  const style = {
    aspectRatio: ratio ?? `${photo.width} / ${photo.height}`,
    '--focus': photo.focus ?? '50% 50%',
  } as CSSProperties

  return (
    <div className={`photo ${className}`} style={style}>
      {failed ? (
        <div className="photo__fallback" role="img" aria-label={photo.alt}>
          <span aria-hidden="true">♡</span>
        </div>
      ) : (
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

type PolaroidProps = Props & { tilt?: number; tape?: boolean }

export function Polaroid({ photo, tilt = 0, tape = false, className = '', ...rest }: PolaroidProps) {
  return (
    <figure className={`polaroid ${className}`} style={{ '--tilt': `${tilt}deg` } as CSSProperties}>
      {tape && <span className="polaroid__tape" aria-hidden="true" />}
      <Photo photo={photo} {...rest} />
      {photo.caption && <figcaption className="polaroid__caption">{photo.caption}</figcaption>}
    </figure>
  )
}
