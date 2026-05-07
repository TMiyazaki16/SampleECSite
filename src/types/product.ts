export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: 'JPY' | 'USD'
  stock: number
  category: string
  imageUrl: string
}
