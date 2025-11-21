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
  /* 使用するレポーター。 https://playwright.dev/docs/test-reporters を参照 */
  reporter: "html",
  /* 以下のすべてのプロジェクトで共有される設定。 https://playwright.dev/docs/api/class-testoptions. を参照 */
  use: {
    /* アクション内で使用するベースURL（例：`await page.goto('')`）*/
    baseURL: "http://localhost:3000",

    /* 失敗したテストを再試行する際にトレースを収集。https://playwright.dev/docs/trace-viewer を参照 */
    trace: "on-first-retry",

    /* 失敗時のスクリーンショット自動キャプチャ（デバッグ性向上） */
    screenshot: "only-on-failure",

    /* 失敗時のビデオ記録（CI環境でのデバッグ用） */
    video: "retain-on-failure",
  },

  /* 主要ブラウザのプロジェクトを設定 */
  projects: [
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

    /* モバイルビューポート向けテスト */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* ブランド化されたブラウザ向けテスト */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* テストを開始する前にローカル開発サーバーを起動 */
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
