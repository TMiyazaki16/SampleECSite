// なぜ ApiResponse<T> / PaginatedResponse<T> を定義するか:
// バックエンドのレスポンスエンベロープ形式を型で表現することで、
// API 関数の戻り型が自己文書化され、mock と実装の乖離を
// TypeScript がコンパイル時に検出できる。
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}

export interface ApiError {
  status: number
  message: string
  code?: string
}

export interface LoginCredentials {
  email: string
  password: string
}
