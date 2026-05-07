# sample-ec

EC サイト — Vue 3（TypeScript）

---

## 技術スタック

| ツール | バージョン | 役割 |
|---|---|---|
| Vue 3 | ^3.x | UI フレームワーク（Composition API / `<script setup>`） |
| TypeScript | ~6.x | 型安全な開発 |
| Vite | ^8.x | ビルドツール・開発サーバー |
| Vue Router | ^4.x | クライアントサイドルーティング |
| Pinia | ^3.x | グローバル状態管理 |
| Axios | ^1.x | HTTP クライアント |
| MSW | ^2.x | API モック（Mock Service Worker） |
| vee-validate | ^4.x | フォームバリデーション |
| yup | ^1.x | バリデーションスキーマ定義 |
| Vue I18n | ^9.x | 多言語対応（ja / en） |
| VueUse | ^14.x | ユーティリティコンポーザブル集 |

---

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

**テスト用ログイン情報:**

| ロール | メール | パスワード |
|---|---|---|
| buyer | test@example.com | password123 |
| admin | admin@example.com | password123 |

---

## アーキテクチャ概要

```
View（ページ）
  ↓ emit / call
Composable（非同期操作のローカル状態 = loading / error）
  ↓ call
Service（ビジネスロジック・ユースケース）
  ↓ call              ↓ write
ApiClient            Store（グローバル状態）
  ↓ intercept
MSW（開発時モック）
```

各層の責務を厳密に分離することで、**ある層を変更しても上位層が影響を受けない**設計にしています。

---

## ディレクトリ構成

```
src/
├── api-client/          # Axios を使った API 呼び出し（エンドポイントグループ別）
├── assets/              # 静的アセット
├── components/
│   ├── atoms-and-molecules/  # 小さく再利用可能な UI プリミティブ
│   ├── organisms/            # 画面を構成する UI ブロック
│   │   ├── authentication/
│   │   └── product/
│   └── icon/                 # SVG アイコンコンポーネント
├── composables/         # 非同期操作の loading/error 状態を管理する Vue 関数
├── config/              # 環境変数ラッパー・i18n 設定
├── generated/           # 自動生成
├── locales/             # i18n 多言語対応
├── mocks/               # MSW ハンドラ + フィクスチャ
│   ├── handlers/
│   └── fixtures/
├── router/              # ルート定義 + 認証ガード
├── services/            # ビジネスロジック・ユースケース
├── stores/              # Pinia グローバルストア
├── types/               # ドメインモデルの型定義
├── validation/          # vee-validate + yup スキーマ
└── views/               # ルーティング単位のコンポーネント
    ├── authentication/
    ├── catalog/
    └── order/
```

---

## モック API エンドポイント一覧

| メソッド | パス | 説明 |
|---|---|---|
| POST | /api/auth/login | ログイン（無効な認証情報で 401） |
| POST | /api/auth/logout | ログアウト |
| GET | /api/auth/me | セッション復元（トークン検証） |
| GET | /api/products | 商品一覧（ページネーション・カテゴリフィルター対応） |
| GET | /api/products/:id | 商品詳細 |
| GET | /api/orders | 注文履歴 |
| POST | /api/orders | 注文作成 |

---

## 環境変数

| 変数名 | デフォルト値 | 説明 |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5173/api` | API ベース URL |

---

## 機能一覧

- [x] ログイン / ログアウト（JWT モック）
- [x] セッション維持（ページリフレッシュ後も認証状態を復元）
- [x] 認証ガード（未認証でのアクセスをログインページへリダイレクト）
- [x] 商品一覧（カテゴリフィルター・ページネーション）
- [x] 商品詳細（数量選択 → カートに追加）
- [x] カート（数量変更・商品削除・合計金額表示）
- [x] 注文確認 → 注文完了
- [x] 注文履歴
- [x] 日本語 / 英語 切替（ヘッダーボタン）
- [x] フォームバリデーション（メール形式・パスワード最小文字数）
- [x] API エラー・在庫切れのフィードバック表示
- [x] レスポンシブレイアウト
