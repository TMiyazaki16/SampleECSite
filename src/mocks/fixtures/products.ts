import type { Product } from '@/types/product'

// なぜ fixtures を handlers と分離するか:
// fixtures は純粋なデータ（MSW 依存なし）なので、
// ストアや service のユニットテストでも import して使える。
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'オフィスチェア プレミアム',
    description: '長時間座っても疲れにくい高機能チェア。腰部サポート付き。',
    price: 45000,
    currency: 'JPY',
    stock: 50,
    category: 'furniture',
    imageUrl: 'https://placehold.co/400x300?text=Chair',
  },
  {
    id: 'prod-2',
    name: 'ノートPC スタンド アルミ製',
    description: '放熱性に優れたアルミ製スタンド。角度調節可能。',
    price: 8500,
    currency: 'JPY',
    stock: 120,
    category: 'accessories',
    imageUrl: 'https://placehold.co/400x300?text=Stand',
  },
  {
    id: 'prod-3',
    name: 'ワイヤレスキーボード',
    description: 'Bluetooth 5.0対応。最大3台のデバイスを切替可能。',
    price: 12000,
    currency: 'JPY',
    stock: 80,
    category: 'accessories',
    imageUrl: 'https://placehold.co/400x300?text=Keyboard',
  },
  {
    id: 'prod-4',
    name: '4K モニター 27インチ',
    description: 'IPS パネル採用。USB-C 給電対応。',
    price: 68000,
    currency: 'JPY',
    stock: 30,
    category: 'electronics',
    imageUrl: 'https://placehold.co/400x300?text=Monitor',
  },
  {
    id: 'prod-5',
    name: 'ウェブカメラ HD',
    description: 'Full HD 1080p。内蔵マイク付き。テレワーク向け。',
    price: 6800,
    currency: 'JPY',
    stock: 0,
    category: 'electronics',
    imageUrl: 'https://placehold.co/400x300?text=Webcam',
  },
  {
    id: 'prod-6',
    name: 'デスクライト LED',
    description: '調光・調色機能付き。USB 給電タイプ。',
    price: 4500,
    currency: 'JPY',
    stock: 200,
    category: 'lighting',
    imageUrl: 'https://placehold.co/400x300?text=Light',
  },
]
