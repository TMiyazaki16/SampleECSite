# リポジトリガイドライン

## プロジェクト概要

BtoB EC サイトのフロントエンド（Vue 3 + TypeScript + Vuetify / Cloud Storage 配信の SPA）。

- バックエンド API: [TMiyazaki16/SampleECSiteBackend](https://github.com/TMiyazaki16/SampleECSiteBackend)（Spring Boot / Cloud Run）
- インフラ（IaC）: `sample-ec-infra` リポジトリ（Terraform）。配信バケット・ロードバランサ・URL マップ・エラーレスポンスポリシーはそちらの管轄で、本リポジトリが担うのは `dist/` の中身とそのアップロードに限る
- 本番は外部ロードバランサのパスベース振り分け。`/api/*` がバックエンド、それ以外が本リポジトリ

設計方針・手順・制約は `README.md` を正とする。ここに書いていないことは README の該当節を読む。

## ディレクトリ構成

`src/` 配下はレイヤごとに分ける。依存は上から下への一方向のみ。

```
views / components  → 画面。表示とユーザー操作のみ
composables         → 非同期操作の loading / error などローカル状態
services            → ビジネスロジック・ユースケース
api-client          → axios による API 呼び出し
stores              → Pinia のグローバル状態（services から書き込む）
```

- `views/` はルーティング単位、`components/organisms/` は画面を構成する UI ブロック
- UI プリミティブは Vuetify を直接使う。独自の atoms / molecules 層を作らない
- `types/` にドメインモデルの型、`validation/` に vee-validate + yup のスキーマ、`locales/` に i18n のメッセージを置く
- `mocks/` は MSW のハンドラとフィクスチャ。`npm run mock` のときだけ動的 import される

この依存方向を逆転させない。コンポーネントから `api-client` を直接呼ばず、必ず `services` を経由する。

## 開発コマンド

```sh
npm install

npm run mock      # MSW のモック API で起動。バックエンド不要
npm run dev       # 実バックエンド（http://localhost:8080/api）に接続して起動
npm run build     # tsc の型チェック後に dist/ へ出力
npm run preview   # ビルド結果をローカル配信（API には接続できない）
```

- `npm run dev` を使う場合はバックエンドを先に起動する（`SampleECSiteBackend` を Docker で起動し、`ALLOWED_ORIGINS=http://localhost:5173` を指定する）
- `npm run preview` は `/api/*` の振り分けが無いため API に接続できない。画面表示とルーティングの確認にのみ使う
- 変更の検証は `npm run build` を通すこと。`tsc` は `strict` / `noUnusedLocals` / `noUnusedParameters` が有効で、未使用の変数や引数が残っているとビルドが落ちる

## 実装の前提

- **環境変数**: 参照は `src/config/env.ts` の `config` オブジェクトに一元化する。`import.meta.env` を各所に直接書かない。値はビルド時に埋め込まれるため、接続先を変えるにはリビルドが要る
- **API ベース URL**: 本番は同一オリジン前提で `VITE_API_BASE_URL=/api`（相対パス）。絶対 URL に戻すと Cloud Run の URL 変更のたびにリビルドが必要になるため、変更する場合は先に相談する
- **ルーター**: `createWebHistory()` を使用。直接アクセス・リロード時に `index.html` を 200 で返す設定がロードバランサ側にある前提なので、この前提を崩す変更（ハッシュモードへの切り替え等）は単独で判断しない
- **MSW**: `import.meta.env.DEV && MODE === 'development'` の条件で動的 import している。本番バンドルに含めないための条件なので、静的 import に変えない
- **自動生成ファイル**: `src/generated/` は auto-import と components の型定義の出力先。手で編集しない。コンポーネントを増減したらビルドで再生成する
- **メッセージ**: 画面に出す文言を直書きせず `locales/` に定義して i18n 経由で参照する
- **モックと実装の整合**: API の形を変えたら `mocks/handlers/` と `fixtures/` も合わせる。モックだけが通る状態にしない

## AI開発ルール

### 人間確認が必要なとき

次に該当したら、実装に入らず前提・選択肢・影響を提示して確認を待つ。

- 本番環境へのデプロイ（`dist/` の Cloud Storage へのアップロード）
- レイヤ間の依存関係を変える変更、新しいレイヤやディレクトリの追加
- 依存ライブラリの追加・更新、Vue / Vite / Vuetify のメジャーバージョン変更
- ルーティング定義・認証ガードの変更
- バックエンドの API 仕様（パス・リクエスト / レスポンス形式）に依存する変更。バックエンド側の修正が連動して必要になる
- `VITE_API_BASE_URL` の方式変更（相対パス → 絶対 URL）、`.env.*` の追加・変更
- 依頼スコープを超える変更（無関係なコンポーネントのリファクタ、バックエンド・インフラリポジトリの変更）
- 3 ファイル以上または複数レイヤにまたがる変更 → 先に計画（変更対象 / README の更新要否 / 検証方針 / リスク）を提示する

### そのまま進めてよいとき

既存パターンに沿ったコンポーネント・composable・service・API クライアントの追加、型定義やバリデーションスキーマの追加、i18n メッセージの追加、コメント・ドキュメントの追加。置いた仮定は作業報告に明記する。コンポーネント名・パス・環境変数名は実在を確認してから参照する。

### 明示依頼なしでは実行しない

- **`git commit`（コミット）** / `git push` / force push / `git reset --hard` / `git rebase -i`
- `gcloud` / `gsutil` による Cloud Storage バケット・ロードバランサの設定変更。インフラの管轄なので、必要なら `sample-ec-infra` 側の変更として提案する
- `node_modules/` や `src/generated/` の手動編集、`package-lock.json` の手動書き換え

### 変更時チェックリスト

1. `npm run build` が成功する（型エラー・未使用変数が無い）
2. 変更したレイヤの依存方向が崩れていない
3. API を伴う変更は `npm run mock` と `npm run dev` の両方で動作を確認する
4. 画面・API・環境変数・制約を変えたら `README.md`（「ディレクトリ構成」「モック API エンドポイント一覧」「環境変数」）を更新する
5. バックエンドに影響する変更は、`SampleECSiteBackend` 側で必要になる対応を報告に書く

### 報告

実行したコマンドと結果、置いた仮定、確認が必要な事項を明記する。ビルドや動作確認を実行できなかった場合はその理由も書く。未実施の手順を実施済みと書かない。
