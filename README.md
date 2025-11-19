<!-- ユーザー向けセットアップ・実行手順 -->

# Todo App with PostgreSQL

Next.js 16 + React 19 + PostgreSQL を使用した Todo アプリケーションです。

## 技術スタック

- **Frontend**: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 17 (Docker)
- **Package Manager**: pnpm

## 環境変数の設定について

このプロジェクトでは単一の`.env`ファイルで環境管理を統一しています。

### ファイル構成

- `.env` - 統合環境変数ファイル（Git 管理対象・秘密情報なし）
- `.env.local.example` - ローカル開発用設定テンプレート（Git 管理対象）
- `.env.local` - ローカル上書き設定（Git 除外・オプション）

### GitHub Actions での設定

GitHub Actions（CI/CD）では以下の 3 つの Secrets が必要です：

| Secret 名           | 説明           | 例                     |
| ------------------- | -------------- | ---------------------- |
| `POSTGRES_DB`       | データベース名 | `todoapp`              |
| `POSTGRES_USER`     | ユーザー名     | `todouser`             |
| `POSTGRES_PASSWORD` | パスワード     | `your_secure_password` |

`DATABASE_URL`は上記 3 つの Secrets から自動生成されます。

**Secrets の設定方法:**

1. GitHub リポジトリの **Settings** → **Secrets and variables** → **Actions** を開く
2. **New repository secret** をクリックして各 Secret を追加
3. `.env`に定義された値と一致するように設定

## セットアップ方法

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定（ローカル開発の場合）

Docker なしでローカル開発する場合は`.env.local`を作成：

```bash
cp .env.local.example .env.local
```

デフォルトの`.env`はすべての環境で共通です。

### 3. Docker コンテナの起動

```bash
# 開発環境: PostgreSQL（DB）のみDockerで起動
pnpm run docker:dev

# アプリケーションはローカルで起動（ホットリロード）
pnpm dev

# 本番環境: Next.js と PostgreSQL をDockerで起動
# （.env の NODE_ENV など値を変更して実行）
pnpm run docker:prod

# サービスのログを確認
pnpm run docker:logs       # 開発（DBのみ）
pnpm run prod:logs         # 本番（アプリ+DB）
```

### 4. アプリケーションへのアクセス

- **開発環境**: http://localhost:3000
- **本番環境**: http://localhost:3000

## テスト

### 単体テスト (Vitest)

```bash
# テストを実行（ウォッチモード）
pnpm test

# 1回だけ実行
pnpm test --run
```

#### テストの構成

- **API テスト**: `tests/unit/app/api/todos/route.test.ts`
  - 全ての CRUD エンドポイントのテスト
  - バリデーションとエラーハンドリングのテスト
- **コンポーネントテスト**:
  - `tests/unit/components/AddTask.test.tsx` - Todo 追加フォーム
  - `tests/unit/components/TaskList.test.tsx` - Todo リストの表示・編集・削除
  - `tests/unit/components/ChangeTheme.test.tsx` - テーマ切り替え機能
- **ユニットテスト**: `tests/unit/lib/db.test.ts` - データベース接続のシングルトンパターン

### E2E テスト (Playwright)

E2E（End-to-End）テストは、ブラウザから実際のユーザー操作をシミュレートして、アプリケーション全体が正しく動作することを検証します。

#### 実行方法

```bash
# E2E テストを実行（通常実行）
pnpm test:e2e

# UI モードで実行（テストの進行を可視化）
pnpm test:e2e:ui

# デバッグモードで実行
pnpm test:e2e:debug

# すべてのテストを実行（単体テスト + E2E）
pnpm test:all
```

#### テストファイルの構成

- **`tests/e2e/`**: Playwright E2E テストの配置ディレクトリ
  - `*.spec.ts` - E2E テストファイル
  - 例: `todo-crud.spec.ts`, `theme.spec.ts`

#### テスト戦略

| テスト種類     | ツール     | 対象                                       | 配置                            |
| -------------- | ---------- | ------------------------------------------ | ------------------------------- |
| **単体テスト** | Vitest     | コンポーネント、API ルート、ユーティリティ | `tests/unit/**/*.test.{ts,tsx}` |
| **E2E テスト** | Playwright | ユーザーフロー、UI インタラクション        | `tests/e2e/**/*.spec.ts`        |

#### Playwright レポート

テスト実行後、以下で HTML レポートを確認できます：

```bash
pnpm exec playwright show-report
```

## データベース管理コマンド

```bash
# PostgreSQLコンテナのみを起動
pnpm run postgres:up

# 開発環境を停止
pnpm run dev:down

# 本番環境を停止
pnpm run prod:down

# PostgreSQLのログを表示
pnpm run postgres:logs

# 開発環境の状態を確認
pnpm run docker:ps

# 本番環境の状態を確認
pnpm run prod:ps
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
├── tests/
│   ├── unit/
│   │   └── setup.ts           # Vitest設定
│   └── e2e/
│       └── *.spec.ts          # Playwright E2Eテスト
├── docker-compose.dev.yml     # 開発: PostgreSQLのみDockerで起動
├── docker-compose.prod.yml    # 本番: Next.js + PostgreSQL をDockerで起動
├── Dockerfile                 # Docker ビルド設定
├── init.sql                   # データベース初期化
├── .env                       # 統合環境変数（Git管理対象）
├── .env.local.example         # 環境変数テンプレート
├── next.config.mjs            # Next.js 設定
├── tsconfig.json              # TypeScript 設定
├── vitest.config.ts           # Vitest 設定
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
```

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
pnpm run docker:dev

# 本番環境（スタンドアローンモード）
pnpm run docker:prod
```

**環境変数の設定箇所：**

- `Dockerfile`：ビルド時の ARG 定義
- `docker-compose.dev.yml`：開発環境用 Docker Compose 設定
- `docker-compose.prod.yml`：本番環境用 Docker Compose 設定
- `.env`：環境変数（Git 管理対象・秘密情報なし）
- `.env.local.example`：環境変数のテンプレート
- `.env.local`：ローカル開発時の設定（Docker 未使用時）

詳細は[Next.js 公式ドキュメント](https://nextjs.org/docs/app/api-reference/next-config-js/output)を参照してください。

## トラブルシューティング

### データベースに接続できない場合

1. Docker が起動していることを確認
2. ポート 5432 が使用されていないことを確認
3. 環境変数が正しく設定されていることを確認

### データをリセットしたい場合

```bash
# コンテナとボリュームを削除
pnpm run docker:down
docker-compose down -v

# 再度起動
pnpm run docker:dev
```
