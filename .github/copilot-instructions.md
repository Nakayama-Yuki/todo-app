<!-- apply toを指定しなくても、.github直下にあるcopilot-instructions.mdはすべてのチャットに自動的に適用される -->
<!-- 全体の指針になるinstructionsファイル -->

# GitHub Copilot 用の Todo App ガイド

このドキュメントは、Next.js 16 + PostgreSQL Todo アプリケーションの アーキテクチャと規約を AI コーディング エージェントに案内します。

## 🏗️ アーキテクチャ概要

### 技術スタック

- **フロントエンド**: Next.js 16 (App Router)、React 19、TypeScript 5、Tailwind CSS v4
- **バックエンド**: Next.js API Routes (`/app/api/todos/`)
- **データベース**: PostgreSQL 17 (Docker)
- **テスト**: Vitest + React Testing Library
- **パッケージマネージャー**: pnpm

### データフロー

1. **サーバーコンポーネント** (`src/app/page.tsx`): PostgreSQL からシングルトン プールを使用して初期 Todo を取得
2. **クライアントコンポーネント** (`src/components/HomeClient.tsx`): UI 状態とユーザー操作を管理
3. **API ルート** (`src/app/api/todos/route.ts`): REST エンドポイント経由で CRUD 操作を処理
4. **データベース**: `src/lib/db.ts` で管理される PostgreSQL プール (シングルトン パターン)

### キーデザイン パターン

- **サーバー・クライアント分割**: 初期データはサーバー側で取得、更新操作はクライアント側の API 呼び出しで処理
- **シングルトン データベース プール**: `src/lib/db.ts` の `getDbPool()` で接続リークを防止
- **React Context**: `ThemeProvider` がアプリ全体を包含してグローバル テーマ状態を管理

## 📁 ディレクトリ構成

```
src/
  app/              # Next.js App Router (デフォルトではサーバー側でレンダリング)
    page.tsx        # サーバーコンポーネント - 初期 Todo を取得
    layout.tsx      # ThemeProvider を含むルート レイアウト
    api/
      todos/
        route.ts    # CRUD エンドポイント (GET/POST/PATCH/DELETE)
        [id]/
          route.ts  # 単一 Todo 操作用の動的ルート
  components/       # クライアントコンポーネント ("use client" ディレクティブ)
    HomeClient.tsx  # メイン クライアントコンポーネント (状態、インタラクティブ)
    TaskList.tsx    # Todo リストの表示・編集
    AddTask.tsx     # 新規 Todo 追加フォーム
    ChangeTheme.tsx # テーマ切り替えボタン
  context/
    themeContext.tsx # グローバル テーマ状態 + useTheme フック
  lib/
    db.ts          # PostgreSQL 接続プール (シングルトン)
  types/
    type.ts        # 集約 TypeScript インターフェース
  test/
    setup.ts       # Vitest 設定
```

## 🔧 開発ワークフロー

### ローカル開発

```bash
# 依存関係のインストール
pnpm install

# PostgreSQL を起動 (Docker)
pnpm run docker:dev

# Next.js 開発サーバーを起動 (ホットリロード)
pnpm dev

# テストを実行 (ウォッチモード)
pnpm test

# テストを 1 回実行
pnpm test --run

# コード品質チェック
pnpm lint
```

### 環境設定

- **`.env`**: コミット対象の共有設定 (秘密情報なし)
- **`.env.local`**: ローカル上書き設定 (Git 除外、開発時はオプション)
- **必須変数**: `DATABASE_URL`、`POSTGRES_DB`、`POSTGRES_USER`、`POSTGRES_PASSWORD`

### Docker 管理

- **開発環境**: `pnpm run docker:dev` (PostgreSQL のみ Docker で起動、Next.js はローカルで実行)
- **本番環境**: `pnpm run docker:prod` (PostgreSQL と Next.js の両方をコンテナで実行)
- **クリーンアップ**: `pnpm run dev:down` または `pnpm run prod:down`

## 📝 コード規約とパターン

### コンポーネント構成

- **サーバーコンポーネント** (App Router のデフォルト): データ取得、重い処理
- **クライアントコンポーネント** (`"use client"` ディレクティブ付き): インタラクティブ機能、状態管理、フック
- ルート固有のコンポーネントはそのルート フォルダ内に配置、共有コンポーネントは `src/components/` に配置

### API 設計

- **レスポンス形式**: すべてのエンドポイントが `ApiResponse<T>` ({success, data?, error?}) を返す
- **バリデーション**: POST/PATCH ハンドラーでの入力検証 (`route.ts` を参照)
- **エラーハンドリング**: 適切な HTTP ステータス コード (入力エラーは 400、サーバー エラーは 500) を返す

### TypeScript と命名規則

- すべてのコードで `strict: true` の TypeScript を使用
- **コンポーネント**: PascalCase (`UserCard.tsx`)
- **フック**: camelCase (`useTheme.ts`)
- **型**: `src/types/type.ts` の PascalCase インターフェース
- **ディレクトリ**: kebab-case (`api/todos/`、`route-groups/`)

### データベース アクセス

- 常に `src/lib/db.ts` の `getDbPool()` を使用 (シングルトン)
- プール設定: `max: 10`、`idleTimeoutMillis: 30000`、`connectionTimeoutMillis: 2000`
- SQL インジェクション防止のため、パラメータ化クエリを使用: `pool.query(sql, [param1, param2])`

## 🧪 テスト基準

### ファイル配置と実行

- **単体テスト**: `*.test.ts` または `*.test.tsx` をソースファイルと同じ場所に配置
- **例**: `AddTask.test.tsx`、`route.test.ts`、`db.test.ts`
- **テストランナー**: Vitest（jsdom 環境、React Testing Library 使用）
- **設定**: `vitest.config.ts` に基づく（tsconfig パス エイリアス `@` 対応）

### テストカバレッジと戦略

- **API ルート** (`route.ts`): CRUD 操作、バリデーション、エラーケース、HTTP ステータス
- **コンポーネント** (`HomeClient.tsx`, `TaskList.tsx`, `AddTask.tsx`): ユーザー操作、プロップ検証、状態更新
- **データベース** (`db.ts`): シングルトン プール動作、エラーハンドリング

### テスト実行コマンド

```bash
pnpm test              # ウォッチモード（開発中）
pnpm test --run        # シングルラン + カバレッジ（CI/CD）
```

### テスト環境の特性

- **jsdom**: ブラウザ環境をエミュレート（DOM API テスト用）
- **API テスト**: モックではなく実際の API 実装をテスト（`NextResponse` 型チェック）
- **セットアップ**: `src/test/setup.ts` で `@testing-library/jest-dom` を初期化

## 🚀 重要な実装ノート

### サーバーコンポーネントで Next.js の動的インポート (SSR 無効) を使用しない

❌ **間違い**: `next/dynamic({ ssr: false })` でクライアントコンポーネントをインポート  
✅ **正解**: クライアントコンポーネントを直接インポート

**例** (`src/app/page.tsx`):

```tsx
import HomeClient from "@/components/HomeClient"; // 直接インポート
export default async function Home() {
  const todos = await fetchTodos(); // サーバー側での取得
  return <HomeClient initialTodos={todos} />; // プロップとして渡す
}
```

### クライアント・サーバー間 API 通信

更新操作は API ルートへのフェッチを使用 (直接的なデータベース呼び出しは不可):

```tsx
const response = await fetch("/api/todos", {
  method: "POST",
  body: JSON.stringify({ text: input }),
});
```

### テーマ Context パターン

React Context でグローバル状態を管理 (`src/context/themeContext.tsx` を参照):

```tsx
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

## 🐳 Docker とデプロイメント

### マルチステージ ビルド

Dockerfile は複数段階ビルドを使用: `base` → `deps` → `builder` → `runner`

- イメージ サイズとレイヤー キャッシュ用に最適化
- pnpm、npm、yarn に対応

### CI/CD の環境変数

GitHub Actions には 3 つのシークレットが必要:

- `POSTGRES_DB`、`POSTGRES_USER`、`POSTGRES_PASSWORD`
- `DATABASE_URL` はこれらの値から自動生成

## ❓ 変更の際の確認

**機能追加前**:

1. 類似パターンが既に存在するか確認 (例: `route.ts` の API エンドポイント)
2. コンポーネント構成を確認 (サーバー/クライアント分割)
3. テスト実行: `pnpm test --run`

**データベース変更**:

- スキーマについて `init.sql` を更新
- TypeScript 型に変更を反映 (`src/types/type.ts`)

**新規 API エンドポイント**:

- 既存の `ApiResponse<T>` 形式に従う
- ハンドラーでバリデーションを追加
- 対応する `.test.ts` ファイルでテストカバレッジを追加

**新規コンポーネント**:

- 必要な場合のみクライアントコンポーネント (`"use client"`) にマーク
- サーバーコンポーネントをデフォルトのままに
- テストをコンポーネント ファイルと同じ場所に配置

## 🔐 GitHub Secrets と CI/CD パイプライン

### 環境変数の管理

- **ローカル開発** (`.env`): コミット対象、秘密情報なし、全環境で共通
- **GitHub Secrets**: CI/CD 実行時に `POSTGRES_DB`、`POSTGRES_USER`、`POSTGRES_PASSWORD` が必須
- **自動生成**: `DATABASE_URL` は GitHub Actions で `postgresql://$USER:$PASSWORD@localhost:5432/$DB` の形式で動的生成

### CI/CD ワークフロー (`.github/workflows/node.js.yml`)

- **トリガー**: main ブランチへの push / PR / merge_group
- **Service Containers**: PostgreSQL 17-alpine を起動（テスト実行中）
- **テスト**: `pnpm test --run` でカバレッジ検証
- **リント**: `pnpm lint` でコード品質チェック
- **ビルド**: `pnpm build` で Next.js ビルド検証
- **Secrets**: Settings → Secrets and variables → Actions で `POSTGRES_DB`、`POSTGRES_USER`、`POSTGRES_PASSWORD` を設定
