// Vitest 設定ファイル
// 詳細: https://vitest.dev/config/
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Vite プラグインの設定。React 用プラグインを追加
  plugins: [react()],
  test: {
    // テスト環境を jsdom に設定（ブラウザ API をエミュレート）
    environment: "jsdom",
    // グローバル変数 (describe, it など) を有効化
    globals: true,
    // テスト前に実行するセットアップファイル
    setupFiles: "./tests/unit/setup.ts",
    // テスト対象ファイルのパターン
    include: ["./tests/unit/**/*.test.{ts,tsx}", "./src/**/*.test.{ts,tsx}"],
    // フォークプール設定：タイムアウトを延長、スレッドを制限
    pool: "forks",
    // テストタイムアウトを延長（デフォルト 10000ms）
    testTimeout: 20000,
    // hooks タイムアウト
    hookTimeout: 20000,
  },
  resolve: {
    alias: {
      // @ を src ディレクトリにエイリアス
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
