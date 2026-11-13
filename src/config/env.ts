// なぜ env ラッパーを設けるか:
// import.meta.env を直接散在させると型安全性が失われ、
// 変数名の変更時に全ファイルを検索する羽目になる。
// ここを唯一の参照点にすることで変更コストを最小化する。

// なぜ起動時に検証するか:
// Vite は環境変数をビルド時に文字列として埋め込むため、
// .env.production の設定漏れは undefined となり、
// axios の baseURL が未設定のまま相対パスで配信元（Cloud Storage）に
// リクエストされて 404 になる。原因が分かりにくいので、
// 初期化時点で明示的に落として気づけるようにする。
function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(
      `環境変数 ${key} が設定されていません。該当モードの .env ファイル、` +
        `またはビルド時の環境変数を確認してください。`
    )
  }
  return value
}

export const config = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
  isDev: import.meta.env.DEV,
} as const
