# Todo App with PostgreSQL

Next.js 15 + React 19 + PostgreSQL を使用した Todo アプリケーションです。

## 技術スタック

- **Frontend**: Next.js 15, React 19, TypeScript 5, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 15 (Docker)
- **Package Manager**: pnpm

## セットアップ方法

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. PostgreSQL データベースの起動

```bash
# Docker Composeでデータベースを起動
pnpm run db:up

# データベースのログを確認
pnpm run db:logs
```

### 3. 環境変数の設定

`.env.local`ファイルが作成されていることを確認してください。

### 4. アプリケーションの起動

```bash
pnpm dev
```

アプリケーションは http://localhost:3000 で起動します。

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