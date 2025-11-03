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
# Docker Composeで全サービスを起動（nginx, Next.js, PostgreSQL）
pnpm run db:up

# または個別に
docker-compose up -d

# サービスのログを確認
docker-compose logs -f
```

### 3. 環境変数の設定

`.env.local`ファイルが作成されていることを確認してください。

### 4. アプリケーションへのアクセス

**開発環境:**

- Next.js 直接: http://localhost:3000
- nginx 経由: http://localhost:80

**本番環境:**

- nginx 経由のみ: http://localhost:80

## nginx について

このアプリケーションには **nginx** がウェブサーバーとして統合されています。

### nginx の役割

- **リバースプロキシ**: Next.js アプリケーションへのリクエストをプロキシ
- **静的ファイルキャッシング**: `/_next/static/` と `/public/` をキャッシュして高速化
- **Gzip 圧縮**: 転送データを圧縮して帯域幅を削減
- **セキュリティ**: リバースプロキシによる保護

### nginx 設定ファイル

`nginx.conf` で nginx の設定を管理しています。主な設定：

- **ポート**: 80 (HTTP), 443 (HTTPS - オプション)
- **アップストリーム**: `app:3000` (Next.js アプリケーション)
- **キャッシング戦略**: 静的ファイルは 60 日、公開ファイルは 7 日

### 本番環境でのデプロイ

本番環境では、以下のコマンドで構築・実行します：

```bash
# イメージのビルド
docker-compose build

# サービスの起動
docker-compose up -d

# ステータス確認
docker-compose ps
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
