export type Hairstyle = {
  id: string
  name: string
  src: string
  referenceSrc?: string
  views?: Record<'Front' | 'Back' | 'Left' | 'Right', string>
  referenceViews?: Record<'Front' | 'Back' | 'Left' | 'Right', string>
  gender: string
  category: string
  length: string
  showBoard?: boolean
  description: string
}

export const hairstyles: Hairstyle[] = [
  {
    id: 'short-side-part',
    name: 'Short Side Part',
    src: '/hairstyles/side-part-reference.png',
    gender: 'men',
    category: 'classic',
    length: 'short',
    showBoard: true,
    description: 'A compact off-centre side part, short swept top with modest lift, and a gentle low taper. Keep dark coverage on the upper sides.',
  },
  {
    id: 'pompadour',
    name: 'The Flow',
    src: '/hairstyles/pompadour.jpg',
    gender: 'men',
    category: 'classic',
    length: 'medium-long',
    description: 'Medium-long layered hair with a loose centre part, wavy curtain fringe and swept-out sides reaching around the ears and nape. Keep the length and flowing silhouette shown in the reference; no short quiff or clipped fade.',
  },
  {
    id: 'textured-fringe',
    name: 'Textured Fringe',
    src: '/hairstyles/textured-fringe/front.jpg',
    views: {
      Front: '/hairstyles/textured-fringe/front.jpg',
      Left: '/hairstyles/textured-fringe/left.jpg',
      Right: '/hairstyles/textured-fringe/right.jpg',
      Back: '/hairstyles/textured-fringe/back.jpg',
    },
    referenceViews: {
      Front: '/hairstyles/textured-fringe/faceless-front.jpg',
      Left: '/hairstyles/textured-fringe/faceless-left.jpg',
      Right: '/hairstyles/textured-fringe/faceless-right.jpg',
      Back: '/hairstyles/textured-fringe/faceless-back.jpg',
    },
    gender: 'men',
    category: 'modern',
    length: 'short',
    description: 'A modern textured crop with forward-swept textured fringe, piecey volume on top, and a clean low taper fade on the sides and neckline.',
  },
  {
    id: 'burst-fade',
    name: 'Burst Fade',
    src: '/hairstyles/burst-fade/front.jpg',
    views: {
      Front: '/hairstyles/burst-fade/front.jpg',
      Left: '/hairstyles/burst-fade/left.jpg',
      Right: '/hairstyles/burst-fade/right.jpg',
      Back: '/hairstyles/burst-fade/back.jpg',
    },
    referenceViews: {
      Front: '/hairstyles/burst-fade/faceless-front.jpg',
      Left: '/hairstyles/burst-fade/faceless-left.jpg',
      Right: '/hairstyles/burst-fade/faceless-right.jpg',
      Back: '/hairstyles/burst-fade/faceless-back.jpg',
    },
    gender: 'men',
    category: 'modern',
    length: 'short',
    description: 'Spiky textured crop on top with a curved burst fade circling behind the ear, tapering neatly at the temples and back neckline.',
  },
]
