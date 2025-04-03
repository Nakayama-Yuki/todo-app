# TODO アプリケーション

シンプルで使いやすい TODO メモ管理アプリケーション。

## 技術スタック

- Next.js 15
- React 19
- TypeScript 5
- Tailwind CSS 4

## 機能

- メモの追加
- メモの表示
- メモの削除
- メモの編集
- メモの完了状態管理

## 開発環境のセットアップ

### 前提条件

- Node.js (バージョン 18 以上)
- pnpm

### インストールと実行

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

## ビルドとデプロイ

```bash
# プロダクションビルドの作成
pnpm build

# ビルドの実行
pnpm start
```

## プロジェクト構成

```
/
├── src/          　# ソースコード
│   ├── app/      　# Next.jsのアプリケーションコード
│   ├── components/ # 再利用可能なReactコンポーネント
│   ├── context/  　# テーマを管理するコンテキスト
│   └── types/    　# TypeScript型定義
├── public/       　# 静的ファイル
```

## ライセンス

MIT
