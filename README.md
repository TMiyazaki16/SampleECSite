# sample-ec

EC サイト — Vue 3（TypeScript）

## システム構成

本システムは 2 つのリポジトリで構成されます。

| リポジトリ | 役割 |
|---|---|
| TMiyazaki16/SampleECSite（本リポジトリ） | フロントエンド（Vue 3 + TypeScript） |
| TMiyazaki16/SampleECSiteBackend | バックエンド（Spring Boot / Cloud Run） |

ローカルでは同階層に clone されている前提です。

```
work/
├── SampleECSite/          # 本リポジトリ
└── SampleECSiteBackend/
```

---

## 技術スタック

| ツール | バージョン | 役割 |
|---|---|---|
| Vue 3 | ^3.x | UI フレームワーク（Composition API / `<script setup>`） |
| TypeScript | ~6.x | 型安全な開発 |
| Vite | ^8.x | ビルドツール・開発サーバー |
| Vuetify | ^4.x | UI コンポーネントライブラリ（Material Design） |
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
npm run mock
```

ブラウザで `http://localhost:5173` を開きます。

**テスト用ログイン情報（モック・実バックエンド共通）:**

| ロール | メール | パスワード |
|---|---|---|
| buyer | test@example.com | password123 |
| admin | admin@example.com | password123 |

同じユーザーがバックエンドの初期データ（`presentation/src/main/resources/data.sql`）にも
登録されているため、`npm run dev`（実バックエンド接続）でも同じ認証情報でログインできます。

---

## バックエンドの起動（`npm run dev` を使う場合）

`npm run dev` は実際のバックエンド API（`http://localhost:8080/api`）に接続します。
バックエンドは Docker 一本で起動でき、Java のインストールは不要です。

```bash
cd ../SampleECSiteBackend
docker build -t sample-ec-back .
docker run -d --name sample-ec-back -p 8080:8080 \
  -e JWT_SECRET="$(openssl rand -base64 32)" \
  -e ALLOWED_ORIGINS="http://localhost:5173" \
  sample-ec-back
```

| 環境変数 | 説明 |
|---|---|
| `JWT_SECRET` | JWT の署名鍵。ローカルでは都度ランダム生成で問題ありません（再起動すると既存トークンは無効になります） |
| `ALLOWED_ORIGINS` | CORS で許可するオリジン。フロントの開発サーバー `http://localhost:5173` を指定します |

停止・削除は以下のとおりです。

```bash
docker rm -f sample-ec-back
```

モックモード（`npm run mock`）ではバックエンドは不要です。

---

## npm スクリプト

| コマンド | モード | 説明 |
|---|---|---|
| `npm run mock` | development | MSW によるモック API で起動。バックエンド不要で単体動作する |
| `npm run dev` | backend | 実際のバックエンド API に接続して起動（MSW は起動しない） |
| `npm run build` | production | 型チェック（`tsc`）後に静的ファイルを `dist/` へ出力 |
| `npm run preview` | - | ビルド結果をローカルで配信して確認（API には接続不可。下記参照） |

MSW は `npm run mock`（`import.meta.env.DEV && MODE === 'development'`）のときだけ動的 import されるため、
`npm run dev` および本番バンドルには含まれません。

> **`npm run preview` の制約**: 本番ビルドは `VITE_API_BASE_URL=/api`（相対パス）で作られており、
> 本番では Cloud Load Balancing が `/api/*` を Cloud Run へ振り分ける前提です。
> プレビューサーバーにはその振り分けがないため、`/api/*` はプレビューサーバー自身に向かい
> **API には接続できません**（画面表示とルーティングの確認用途に限られます）。
> API を含めて動作確認する場合は `npm run dev`（バックエンド接続）または `npm run mock` を使ってください。

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
MSW（モックモード時のみ）
```

各層の責務を厳密に分離することで、**ある層を変更しても上位層が影響を受けない**設計にしています。

---

## ディレクトリ構成

```
src/
├── api-client/          # Axios を使った API 呼び出し（エンドポイントグループ別）
├── components/
│   └── organisms/            # 画面を構成する UI ブロック
│       ├── authentication/
│       └── product/
├── composables/         # 非同期操作の loading/error 状態を管理する Vue 関数
├── config/              # 環境変数ラッパー・i18n 設定
├── generated/           # 自動生成（auto-import / components の型定義）
├── locales/             # i18n 多言語対応
├── mocks/               # MSW ハンドラ + フィクスチャ
│   ├── handlers/
│   └── fixtures/
├── plugins/             # Vuetify（テーマ・アイコン設定）
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

UI プリミティブは Vuetify のコンポーネントを直接使用しているため、独自の atoms / molecules 層は持ちません。

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

| 変数名 | 説明 |
|---|---|
| `VITE_API_BASE_URL` | API ベース URL（必須。未設定の場合は起動時に例外を投げる） |

モードごとに以下のファイルが読み込まれます。

| ファイル | 使用コマンド | 値 |
|---|---|---|
| `.env.development` | `npm run mock` | `http://localhost:5173/api` |
| `.env.backend` | `npm run dev` | `http://localhost:8080/api` |
| `.env.production` | `npm run build` | `/api`（LB が同一オリジンで Cloud Run に振り分ける。後述「ビルドとデプロイ」参照） |

参照は `src/config/env.ts` の `config` オブジェクトに一元化しています。
`import.meta.env` を各所に直接書かないでください。

Vite は環境変数を**ビルド時に JS へ埋め込みます**。接続先を変更するにはリビルドが必要です。
CI では `VITE_API_BASE_URL=... npm run build` のように実環境変数で `.env.production` を上書きできます。

---

## ビルドとデプロイ（Google Cloud Storage）

```bash
npm run build          # dist/ に静的ファイルを出力
npm run preview        # ビルド結果をローカルで確認
```

### 本番構成

**Cloud Load Balancing + 独自ドメイン（`https://www.tmiyazaki-works.com`）を採用します。**
ルーティングは**パスベース**とし、フロントエンドと API を同一オリジンで配信します。

```
              https://www.tmiyazaki-works.com
                            │
               ┌────────────▼────────────┐
               │  Cloud Load Balancing   │
               └──────┬───────────┬──────┘
                 /*   │           │  /api/*
                      ▼           ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  Cloud Storage   │  │    Cloud Run     │
        │ （本リポジトリ）    │  │  （バックエンド）   │
        └──────────────────┘  └──────────────────┘
```

| パス | 転送先 |
|---|---|
| `/api/*` | Cloud Run（バックエンド） |
| `/*`（上記以外） | Cloud Storage バケット（フロントエンド） |

> URL マップではパスの評価順に注意し、`/api/*` を先に一致させてください。

Cloud Storage から直接配信（`https://storage.googleapis.com/BUCKET_NAME/...`）しない理由:

- 独自ドメインと HTTPS を使うため（Cloud Storage 単体では対応できない）
- SPA のためリロード・URL 直接アクセス時に `index.html` を **200 で返す**必要があるため
  （後述「ルーティング方式に関する注意」参照）

### API ベース URL

同一オリジンで配信されるため、`VITE_API_BASE_URL` には**絶対 URL ではなく相対パス**を設定します。

```
# .env.production
VITE_API_BASE_URL=/api
```

バックエンドの Cloud Run URL をビルドに埋め込む必要がないため、
**Cloud Run の URL が変わってもフロントエンドのリビルドは不要**です。

> ホストベース構成（例: `api.tmiyazaki-works.com`）へ変更する場合は、API の絶対 URL を
> ビルドに埋め込む必要があります。Vite は環境変数をビルド時に埋め込むため、
> その場合は「バックエンドの URL 確定 → フロントのビルド」という順序依存が発生します。

### デプロイの順序

パスベース構成ではフロントとバックエンドが互いの URL を知る必要がないため、
①②の順序は問わず、個別にデプロイ・更新できます。

```
① バックエンドを Cloud Run にデプロイ
② フロントエンドを Cloud Storage にデプロイ（VITE_API_BASE_URL=/api）
     ↓ 両方揃った状態で
③ Cloud Load Balancing の URL マップを設定
   /api/*  → Cloud Run
   /*      → Cloud Storage バケット
```

③が完了するまで独自ドメイン経由の疎通はできません。

### CORS

本番は同一オリジンのため、ブラウザの CORS 制約は発生しません。
ただしローカル開発（`http://localhost:5173` → `http://localhost:8080`）では発生するため、
バックエンドの `ALLOWED_ORIGINS` の設定は必要です。詳細はバックエンドの README を参照してください。

### ルーティング方式に関する注意

ルーターは `createWebHistory()`（History API モード）を使用しています。
そのため `/cart` などのパスを直接開く・リロードすると、Cloud Storage は該当オブジェクトを探して
**404 を返します**。

LB 構成では、カスタムエラーレスポンスポリシーで 404 時に `/index.html` を **200** で返すよう
設定してください。

> **適用範囲に注意**: このポリシーは**バケット側のパスマッチャ（`/*`）にのみ**適用してください。
> `/api/*` にも適用すると、バックエンドが返す 404 が `index.html`（200）に置き換わり、
> API のエラーハンドリングが壊れます。

（参考）バケットを直接配信する構成を採る場合は、404 ページに `index.html` を割り当てることで
画面は描画されますが、HTTP ステータスは 404 のまま返ります。

```bash
gcloud storage buckets update gs://BUCKET_NAME \
  --web-main-page-suffix=index.html --web-error-page=index.html
```

### その他の確認事項

- **`dist/mockServiceWorker.js`**: `public/` から静的コピーされますが、本番では登録されないため無害です。

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
