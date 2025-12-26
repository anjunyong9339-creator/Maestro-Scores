
export enum FileType {
  PDF = 'PDF',
  MIDI = 'MIDI',
  BUNDLE = 'BUNDLE'
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  type: FileType;
  coverImage: string;
  previewAudioUrl?: string;
  pdfUrl: string; // Internal mock URL
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface PurchaseRecord {
  orderId: string;
  email: string;
  items: Product[];
  timestamp: number;
}
