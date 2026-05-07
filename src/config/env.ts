// なぜ env ラッパーを設けるか:
// import.meta.env を直接散在させると型安全性が失われ、
// 変数名の変更時に全ファイルを検索する羽目になる。
// ここを唯一の参照点にすることで変更コストを最小化する。
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  isDev: import.meta.env.DEV,
} as const
