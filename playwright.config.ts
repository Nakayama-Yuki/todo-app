// Playwrightの設定ファイル
import { defineConfig, devices } from "@playwright/test";

/**
 * ファイルから環境変数を読み込む
 * https://github.com/motdotla/dotenv
 */

// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * テスト設定について
 * https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  /* テストディレクトリの指定 */
  testDir: "./tests/e2e",
  /* ファイル内のテストを並行実行 */
  fullyParallel: true,
  /* ソースコードにtest.onlyを残したままビルドを失敗させる */
  forbidOnly: !!process.env.CI,
  /* CIのみで再試行 */
  retries: process.env.CI ? 2 : 0,
  /* CIで並行テストをオプトアウト */
  workers: process.env.CI ? 1 : undefined,
  /* 各テストのタイムアウト（ミリ秒） */
  timeout: 60000,
  /* 使用するレポーター。 https://playwright.dev/docs/test-reporters を参照 */
  reporter: "html",
  /* 以下のすべてのプロジェクトで共有される設定。 https://playwright.dev/docs/api/class-testoptions. を参照 */
  use: {
    /* アクション内で使用するベースURL（例：`await page.goto('')`）*/
    baseURL: "http://localhost:3000",

    /* 失敗したテストを再試行する際にトレースを収集。https://playwright.dev/docs/trace-viewer を参照 */
    trace: "on-first-retry",

    /* 各アクションのタイムアウト（ミリ秒） */
    actionTimeout: 10000,
  },

  /* 主要ブラウザのプロジェクトを設定（CI環境ではchromiumのみで高速化） */
  projects: process.env.CI
    ? [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
      ]
    : [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },

        {
          name: "firefox",
          use: { ...devices["Desktop Firefox"] },
        },

        {
          name: "webkit",
          use: { ...devices["Desktop Safari"] },
        },
      ],

  /* テストを開始する前にローカル開発サーバーを起動 */
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    /* サーバー起動のタイムアウト（ミリ秒） */
    timeout: 120000,
    /* サーバーログを出力（デバッグ用） */
    stdout: "pipe",
    stderr: "pipe",
  },
});
