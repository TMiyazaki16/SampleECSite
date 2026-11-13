/// <reference types="vite/client" />

// なぜ ImportMetaEnv を明示的に宣言するか:
// 既定の型は index signature（string）のため、VITE_API_BASE_URL の
// typo がコンパイル時に検出されない。ここで宣言することで
// config/env.ts 側の `as string` キャストも不要になり、
// 環境変数の追加漏れをビルド時に気づける。
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
