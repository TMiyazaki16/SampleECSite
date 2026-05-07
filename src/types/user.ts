export interface User {
  id: string
  email: string
  name: string
  companyName: string
  role: 'admin' | 'buyer'
}
