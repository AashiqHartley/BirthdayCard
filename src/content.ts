/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to personalise the card.
 *  Everything she reads lives here — no need to touch components.
 * ─────────────────────────────────────────────────────────────
 */
import coverButterfly from './assets/photos/cover-butterfly.jpg'
import littleGarden from './assets/photos/little-garden.jpg'
import littlePink from './assets/photos/little-pink.jpg'
import littleSofa from './assets/photos/little-sofa.jpg'
import heroGreenDress from './assets/photos/hero-green-dress.jpg'
import crownJersey from './assets/photos/crown-jersey.jpg'
import togetherRobe from './assets/photos/together-robe.jpg'
import capNight from './assets/photos/cap-night.jpg'
import poseTogether from './assets/photos/pose-together.jpg'
import greenDressSitting from './assets/photos/green-dress-sitting.jpg'
import selfieTogether from './assets/photos/selfie-together.jpg'

export type Photo = {
  src: string
  width: number
  height: number
  alt: string
  /** Short handwritten caption under the polaroid. Leave '' for none. */
  caption: string
  /** CSS object-position — keeps faces in frame when the photo is cropped. */
  focus?: string
  shape: 'portrait' | 'landscape'
}

export const content = {
  /** Her name. Leave '' to just show "Happy 19th Birthday". */
  name: 'Kayla',

  cover: {
    eyebrow: 'For you',
    title: 'Nineteen',
    subtitle: 'A birthday card',
    photo: {
      src: coverButterfly,
      width: 1024,
      height: 768,
      alt: 'Her as a little girl with a purple butterfly painted on her face',
      caption: '',
      focus: '52% 38%',
      shape: 'landscape',
    } satisfies Photo,
  },

  /** Desktop only: the inside of the front cover once the card is open. */
  insideLeft: {
    text: 'From the very beginning…',
    photo: {
      src: littleGarden,
      width: 800,
      height: 600,
      alt: 'The two of us as small children standing in the garden in the sun',
      caption: 'then',
      focus: '50% 35%',
      shape: 'landscape',
    } satisfies Photo,
  },

  hero: {
    eyebrow: '…to today',
    line: 'Nice I guess.',
    photo: {
      src: heroGreenDress,
      width: 480,
      height: 640,
      alt: 'Her smiling in a sage green dress and a sparkling crown',
      caption: '',
      focus: '50% 22%',
      shape: 'portrait',
    } satisfies Photo,
  },

  early: {
    heading: 'The early chapters',
    intro: 'Before the dresses and what what, there was this cutie patootie',
    photos: [
      {
        src: littleGarden,
        width: 800,
        height: 600,
        alt: 'The two of us as small children in the garden, her in a red gingham dress laughing',
        caption: 'my shaylaaa',
        focus: '50% 40%',
        shape: 'landscape',
      },
      {
        src: littlePink,
        width: 600,
        height: 800,
        alt: 'Her as a toddler in a pink top standing on the lawn next to a purple flower',
        caption: 'POOKIE',
        focus: '45% 30%',
        shape: 'portrait',
      },
      {
        src: coverButterfly,
        width: 1024,
        height: 768,
        alt: 'A close-up of her as a little girl with a butterfly painted on her face',
        caption: 'TOO noonos',
        focus: '55% 45%',
        shape: 'portrait',
      },
      {
        src: littleSofa,
        width: 314,
        height: 235,
        alt: 'The two of us as toddlers sitting side by side on a cream sofa',
        caption: 'Sidekick',
        focus: '50% 50%',
        shape: 'landscape',
      },
    ] satisfies Photo[],
  },

  grown: {
    heading: 'And now, nineteen',
    intro: 'Same smile. Bigger head.',
    photos: [
      {
        src: crownJersey,
        width: 480,
        height: 640,
        alt: 'Her wearing a crystal crown and a cream baseball jersey, smiling to the side',
        caption: 'crown on(Lucky it fit)',
        focus: '50% 25%',
        shape: 'portrait',
      },
      {
        src: togetherRobe,
        width: 480,
        height: 640,
        alt: 'The two of us sitting together on a bed, her in a white satin robe and crown',
        caption: 'Me...And you also',
        focus: '50% 30%',
        shape: 'portrait',
      },
      {
        src: capNight,
        width: 480,
        height: 640,
        alt: 'Her in a backwards black cap and glasses, smiling on a night out',
        caption: 'eiSH',
        focus: '50% 35%',
        shape: 'portrait',
      },
      {
        src: poseTogether,
        width: 480,
        height: 640,
        alt: 'The two of us striking a playful pose, her in the green dress and crown',
        caption: 'YAYYYYY...ME AGAIN...you also I suppose',
        focus: '50% 25%',
        shape: 'portrait',
      },
      {
        src: greenDressSitting,
        width: 480,
        height: 640,
        alt: 'Her sitting on the bed in the green dress and crown, smiling down',
        caption: 'glowing..white light',
        focus: '50% 25%',
        shape: 'portrait',
      },
    ] satisfies Photo[],
  },

  /**
   * ✏️  YOUR MESSAGE — replace the text below with your own words.
   * Each string in `paragraphs` becomes its own paragraph.
   */
  letter: {
    heading: 'A note from me',
    greeting: 'Happy Birthday Kayla,',
    paragraphs: [
      'This is just like the 5 year high school conversation we had. Just yesterday you were a small little brat that played WWE with me (you were a small brat yesterday, we just didn’t play WWE).',
      'But seriously, I am proud of the woman you are becoming, and I know you will continue making me proud. And I know you will reach all the goals and plans your heart desires.',
      'To end off, it is my pleasure to allow you to love me.',
    ],
    signOff: 'Thank you kindly,',
    /** ✏️  Your name */
    signature: 'Aashiq',
    photo: {
      src: selfieTogether,
      width: 480,
      height: 640,
      alt: 'A close-up selfie of the two of us smiling, her wearing her crown',
      caption: 'Milk and caramel',
      focus: '50% 40%',
      shape: 'portrait',
    } satisfies Photo,
  },

  closing: {
    heading: 'Here’s to nineteen',
    wish: 'To new chapters, loud laughs, and every good thing that is on its way to you.',
    replay: 'Celebrate again',
    footer: 'Made with my fingers and my laptop, for you I suppose',
  },
}
