# Todo App の Copilot 指示書

## アーキテクチャ概要

これは **Next.js 15 + React 19** で構築された、PostgreSQL をデータベースとするフルスタック Todo アプリケーションです。サーバーサイド API ルートとクライアントサイド React コンポーネントを組み合わせたモダンなスタックを採用しています。

### 主要コンポーネント

- **フロントエンド**: Next.js App Router, React 19, TailwindCSS v4, TypeScript 5
- **バックエンド**: Next.js API Routes (`/src/app/api/todos/`)
- **データベース**: PostgreSQL 16 (Docker コンテナ)
- **パッケージマネージャー**: pnpm (必須)

## 重要なパターンと規約

### データベース接続

- `/src/lib/db.ts` の `getDbPool()` シングルトンパターンを使用 - 直接 Pool インスタンスを作成しない
- すべての API ルートでパフォーマンス向上のため接続プールを使用
- データベース認証情報: `todouser:todopass@localhost:5432/todoapp`

### API レスポンスパターン

```typescript
// すべての API エンドポイントは標準化された ApiResponse<T> 形式を返す
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### コンポーネントアーキテクチャ

- **クライアントコンポーネント**: メインページ (`page.tsx`) とすべてのインタラクティブコンポーネントで `"use client"` を使用
- **テーマシステム**: グローバルテーマコンテキスト (`ThemeContext`) が `useTheme()` フック経由でダーク/ライトモードを提供
- **Props パターン**: すべてのコンポーネントで `/src/types/type.ts` の型付き props インターフェースを使用

### データベーススキーマ

```sql
-- UPDATE 時にトリガーで自動更新される
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 開発ワークフロー

### 必須コマンド

```bash
# データベース起動（最初に必要）
pnpm run db:up

# Turbopack で開発サーバー起動
pnpm dev

# データベース管理
pnpm run db:down    # データベース停止
pnpm run db:logs    # PostgreSQL ログ表示

# データベースリセット（全データ削除）
docker-compose down -v && pnpm run db:up
```

### ファイル構成

- **API ルート**: `/src/app/api/todos/route.ts` (GET/POST), `/src/app/api/todos/[id]/route.ts` (PUT/DELETE)
- **コンポーネント**: すべて `/src/components/` に PascalCase 命名で配置
- **型定義**: `/src/types/type.ts` に集約
- **データベース**: 接続ロジックは `/src/lib/db.ts`

## TailwindCSS v4 設定

- 設定ファイル不要 - 新しい CSS ファーストアプローチを使用
- `globals.css` で `@import "tailwindcss"` によりインポート
- PostCSS プラグイン: `@tailwindcss/postcss`

## エラーハンドリングパターン

- API ルートは `ApiResponse` 形式で適切な HTTP ステータスコードを返す
- クライアントサイドではユーザーフレンドリーなエラーメッセージで try/catch を使用
- データベースエラーはコンソールにログ出力、ユーザーには汎用メッセージを表示

## 状態管理

- フォーム入力とローディング状態には `useState` によるローカルコンポーネント状態
- React Context (`ThemeContext`) によるグローバルテーマ状態
- 外部状態管理ライブラリは使用しない

## 機能追加時の手順

1. まず `/src/types/type.ts` に TypeScript 型を追加
2. 必要に応じて `init.sql` にデータベースマイグレーションを作成
3. 確立された API レスポンスパターンに従う
4. データベース接続には `getDbPool()` を使用
5. `pnpm run db:logs` でデータベース操作を検証
