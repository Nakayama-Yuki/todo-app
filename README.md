# Todo App with PostgreSQL

Next.js 15 + React 19 + PostgreSQL を使用した Todo アプリケーションです。

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript 5, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 17 (Docker)
- **Package Manager**: pnpm

## セットアップ方法

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. Docker コンテナの起動

```bash
# PostgreSQLサービスのみを起動
pnpm run db:up

# 全サービス（nginx, Next.js, PostgreSQL）を起動する場合
docker-compose up -d

# サービスのログを確認
docker-compose logs -f
```

### 3. 環境変数の設定

`.env.local`ファイルが作成されていることを確認してください。

### 4. アプリケーションへのアクセス

**開発環境:**

- Next.js 直接: http://localhost:3000
- nginx 経由 (HTTPS): https://localhost:443

**本番環境:**

- nginx 経由のみ (HTTPS 必須): https://localhost:443

⚠️ **注意**: nginx 経由での HTTP 接続（ポート 80）は**完全に拒否**されます。HTTPS でのアクセスが必須です。

## HTTPS について

このアプリケーションは **デフォルトで HTTPS（SSL/TLS）** に対応しています。

### SSL 証明書の自動生成

初回起動時に、以下のスクリプトを実行して自己署名 SSL 証明書を生成してください：

```bash
bash ./generate-ssl-certs.sh
```

このスクリプトで以下のファイルが生成されます：

- `certs/server.crt` - SSL 証明書（365 日間有効）
- `certs/server.key` - SSL 秘密鍵

### 証明書情報

- **種類**: 自己署名証明書（開発環境用）
- **有効期限**: 365 日間
- **対象**: localhost
- **パス**: `./certs/` ディレクトリ

### ブラウザでのアクセス

開発環境では、自己署名証明書を使用するため、ブラウザが警告を表示します。以下の対応が必要です：

**Chrome/Firefox:**

1. 警告画面が表示されたら「詳細設定」または「詳細を表示」をクリック
2. 「localhost にアクセス（安全ではありません）」をクリック

### 本番環境への対応

本番環境では、Let's Encrypt などの正式な SSL 証明書を取得し、以下のように設定してください：

```bash
# 証明書ファイルを certs/ ディレクトリに配置
certs/
├── server.crt     # 正式な証明書
└── server.key     # 正式な秘密鍵
```

### nginx での HTTPS 設定

nginx.conf で以下の設定が行われています：

- **HTTP リクエスト拒否**: すべての HTTP リクエストを拒否（400 Bad Request）
- **TLS バージョン**: TLS 1.2 以上
- **HSTS ヘッダ**: ブラウザに HTTPS のみを強制（有効期限 31 日）

## nginx について

このアプリケーションには **nginx** がウェブサーバーとして統合されています。

### nginx の役割

- **リバースプロキシ**: Next.js アプリケーションへのリクエストをプロキシ
- **HTTPS/SSL**: SSL/TLS による暗号化通信
- **HTTP → HTTPS リダイレクト**: セキュリティの向上
- **静的ファイルキャッシング**: `/_next/static/` と `/public/` をキャッシュして高速化
- **Gzip 圧縮**: 転送データを圧縮して帯域幅を削減
- **セキュリティ**: リバースプロキシによる保護

### nginx 設定ファイル

`nginx.conf` で nginx の設定を管理しています。主な設定：

- **ポート**: 80 (HTTP リクエスト拒否), 443 (HTTPS)
- **アップストリーム**: `app:3000` (Next.js アプリケーション)
- **キャッシング戦略**: 静的ファイルは 60 日、公開ファイルは 7 日
- **SSL 証明書**: `/etc/nginx/certs/server.crt` と `/etc/nginx/certs/server.key`

### 本番環境でのデプロイ

本番環境では、以下の手順で構築・実行します：

#### 1. 環境変数ファイルの準備

```bash
# サンプルファイルをコピー
cp .env.prod.example .env.prod

# エディタで開き、実際の値を設定
nano .env.prod
```

`.env.prod` ファイルで以下の値を設定してください：

```bash
# データベース設定（本番環境用の強固なパスワードを設定）
POSTGRES_DB=todoapp
POSTGRES_USER=todouser
POSTGRES_PASSWORD=your_secure_production_password_here

# Next.js アプリケーション設定
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
NODE_ENV=production
```

⚠️ **重要**: `.env.prod` ファイルは機密情報を含むため、**絶対に Git リポジトリにコミットしないでください**。

#### 2. イメージのビルドとサービスの起動

```bash
# イメージのビルド
docker-compose -f compose.prod.yaml build

# サービスの起動
docker-compose -f compose.prod.yaml --env-file .env.prod up -d

# ステータス確認
docker-compose -f compose.prod.yaml ps
```

## テスト

```bash
# テストを実行（ウォッチモード）
pnpm test

# 1回だけ実行
pnpm test --run

# カバレッジレポートを生成
pnpm test:coverage
```

### テストの構成

- **API テスト**: `/src/app/api/todos/route.test.ts`
  - 全ての CRUD エンドポイントのテスト
  - バリデーションとエラーハンドリングのテスト
- **コンポーネントテスト**:
  - `AddTask.test.tsx` - Todo 追加フォーム
  - `TaskList.test.tsx` - Todo リストの表示・編集・削除
  - `ChangeTheme.test.tsx` - テーマ切り替え機能
- **ユニットテスト**: `db.test.ts` - データベース接続のシングルトンパターン

## データベース管理コマンド

```bash
# データベースコンテナを起動
pnpm run db:up

# データベースコンテナを停止
pnpm run db:down

# データベースのログを表示
pnpm run db:logs
```

## データベース接続設定

- **Host**: localhost
- **Port**: 5432
- **Database**: todoapp
- **Username**: todouser
- **Password**: todopass

## 機能

- ✅ Todo の追加
- ✅ Todo の編集
- ✅ Todo の削除
- ✅ 完了状態の切り替え
- ✅ ダークモード対応
- ✅ PostgreSQL でのデータ永続化
- ✅ リアルタイムでデータベースと同期

## API エンドポイント

- `GET /api/todos` - 全ての Todo を取得
- `POST /api/todos` - 新しい Todo を作成
- `PUT /api/todos/[id]` - Todo を更新
- `DELETE /api/todos/[id]` - Todo を削除

## プロジェクト構成

```
todo-app/
├── src/
│   ├── app/
│   │   ├── api/todos/          # API Routes
│   │   │   ├── route.ts        # GET/POST endpoints
│   │   │   └── [id]/route.ts   # PUT/DELETE endpoints
│   │   ├── layout.tsx
│   │   ├── page.tsx            # メインページ
│   │   └── globals.css
│   ├── components/             # UIコンポーネント
│   │   ├── AddTask.tsx
│   │   ├── ChangeTheme.tsx
│   │   └── TaskList.tsx
│   ├── context/
│   │   └── themeContext.tsx    # テーマコンテキスト
│   ├── lib/
│   │   └── db.ts              # データベース接続
│   └── types/
│       └── type.ts            # TypeScript型定義
├── docker-compose.yml         # PostgreSQL設定
├── init.sql                   # データベース初期化
├── .env.local                 # 環境変数
└── package.json
```

## 開発者向けメモ

- データベースの初期データは `init.sql` で設定
- API Routes は `/src/app/api/` ディレクトリ内に配置
- TypeScript の型定義は `/src/types/type.ts` で管理
- データベース接続は `/src/lib/db.ts` で管理

### Next.js スタンドアローンモードについて

このプロジェクトは `next.config.mjs` で `output: "standalone"` を設定しており、本番環境でのデプロイに最適化されています。

**スタンドアローンモード**とは：

- Next.js アプリケーションを Docker などの軽量なコンテナで実行するための最適化ビルドモード
- 必要な依存関係のみを含むため、デプロイサイズが削減される
- Node.js のみで実行可能

**実行方法：**

```bash
# 開発環境
pnpm dev

# 本番環境ビルド
pnpm build

# スタンドアローンモードで起動
pnpm start

# または直接実行
node .next/standalone/server.js
```

**注意事項：**

- `next start` コマンドは `output: "standalone"` 設定と非互換のため、`package.json` の `start` スクリプトは `node .next/standalone/server.js` に設定してあります
- Docker での本番環境デプロイに対応しています

### Docker での環境変数の取り扱い

スタンドアローンモードでは、環境変数の扱いが重要です：

**ビルド時と実行時の環境変数：**

1. **ビルド時の環境変数**：

   - Dockerfile で `ARG` として定義
   - `docker-compose.yml` の `build.args` で渡す
   - ビルド中にのみ使用され、最終イメージには含まれない

2. **実行時の環境変数**：
   - `docker-compose.yml` の `environment` で設定
   - コンテナ起動時に読み込まれる
   - アプリケーションの実行時に必要

**開発環境と本番環境の切り替え：**

```bash
# 開発環境（ホットリロード対応）
docker-compose up

# 本番環境（スタンドアローンモード）
docker-compose -f docker-compose.prod.yaml up -d
```

**環境変数の設定箇所：**

- `Dockerfile`：ビルド時の ARG 定義
- `docker-compose.yml`：開発環境用の設定
- `docker-compose.prod.yaml`：本番環境用の設定
- `.env.local`：ローカル開発時の設定（Docker 未使用時）

詳細は[Next.js 公式ドキュメント](https://nextjs.org/docs/pages/api-reference/next-config-js/output)および[Docker Compose サンプル](https://github.com/vercel/next.js/tree/canary/examples/with-docker-compose)を参照してください。

## トラブルシューティング

### データベースに接続できない場合

1. Docker が起動していることを確認
2. ポート 5432 が使用されていないことを確認
3. 環境変数が正しく設定されていることを確認

### データをリセットしたい場合

```bash
# コンテナとボリュームを削除
docker-compose down -v

# 再度起動
pnpm run db:up
```
