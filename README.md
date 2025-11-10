# Todo App with PostgreSQL

Next.js 16 + React 19 + PostgreSQL を使用した Todo アプリケーションです。

## 技術スタック

- **Frontend**: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4
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
# PostgreSQL と Next.js アプリケーションを起動
docker-compose up -d

# サービスのログを確認
docker-compose logs -f
```

### 3. 環境変数の設定

`.env.local`ファイルが作成されていることを確認してください。

### 4. アプリケーションへのアクセス

- **開発環境**: http://localhost:3000
- **本番環境**: http://localhost:3000

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
│   ├── test/
│   │   └── setup.ts           # テスト設定
│   └── types/
│       └── type.ts            # TypeScript型定義
├── compose.dev.yml            # 開発環境Docker Compose
├── compose.prod.yaml          # 本番環境Docker Compose
├── Dockerfile                 # Docker ビルド設定
├── init.sql                   # データベース初期化
├── .env.local                 # 環境変数
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
   - `compose.prod.yaml` の `build.args` で渡す
   - ビルド中にのみ使用され、最終イメージには含まれない

2. **実行時の環境変数**：
   - `compose.prod.yaml` の `environment` で設定
   - コンテナ起動時に読み込まれる
   - アプリケーションの実行時に必要

**開発環境と本番環境の切り替え：**

```bash
# 開発環境（ホットリロード対応）
docker-compose up

# 本番環境（スタンドアローンモード）
docker-compose -f compose.prod.yaml up -d
```

**環境変数の設定箇所：**

- `Dockerfile`：ビルド時の ARG 定義
- `compose.dev.yml`：開発環境用の設定
- `compose.prod.yaml`：本番環境用の設定
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
docker-compose down -v

# 再度起動
pnpm run db:up
```
