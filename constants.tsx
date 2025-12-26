
import { Product, FileType } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Nocturne in G Minor',
    description: 'A melancholic and lyrical solo piano piece exploring dark harmonic colors.',
    price: 15.00,
    type: FileType.BUNDLE,
    coverImage: 'https://picsum.photos/seed/music1/600/800',
    previewAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    rating: 4.8,
    reviewsCount: 124
  },
  {
    id: 'p2',
    title: 'Symphonic Sketches No. 4',
    description: 'Full orchestral score and MIDI map for the fourth movement of the Sketches series.',
    price: 45.00,
    type: FileType.PDF,
    coverImage: 'https://picsum.photos/seed/music2/600/800',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    rating: 4.5,
    reviewsCount: 42
  },
  {
    id: 'p3',
    title: 'Cyberpunk Pulse (MIDI Pack)',
    description: 'Electronic rhythmic patterns and synthesizer leads in MIDI format.',
    price: 20.00,
    type: FileType.MIDI,
    coverImage: 'https://picsum.photos/seed/music3/600/800',
    pdfUrl: '', // Not a PDF
    rating: 4.2,
    reviewsCount: 89
  },
  {
    id: 'p4',
    title: 'Waltz of the Willow',
    description: 'Elegant chamber ensemble piece for strings and woodwinds.',
    price: 25.00,
    type: FileType.BUNDLE,
    coverImage: 'https://picsum.photos/seed/music4/600/800',
    previewAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    rating: 4.9,
    reviewsCount: 56
  }
];
