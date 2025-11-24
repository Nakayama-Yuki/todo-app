import { defineConfig, devices } from "@playwright/test";

/**
 * ファイルから環境変数を読み込みます。
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * https://playwright.dev/docs/test-configuration を参照してください。
 */
export default defineConfig({
  testDir: "./tests",
  /* ファイル内のテストを並列実行します */
  fullyParallel: true,
  /* ソースコードに test.only を残した場合、CI でビルドを失敗させます */
  forbidOnly: !!process.env.CI,
  /* CI でのみリトライします */
  retries: process.env.CI ? 2 : 0,
  /* CI での並列テストをオプトアウトします */
  workers: process.env.CI ? 1 : undefined,
  /* 使用するレポーター。https://playwright.dev/docs/test-reporters を参照してください */
  reporter: "html",
  /* 以下のすべてのプロジェクト共有設定。https://playwright.dev/docs/api/class-testoptions を参照してください */
  use: {
    /* `await page.goto('')` などのアクションで使用するベース URL */
    // baseURL: 'http://localhost:3000',

    /* 失敗したテストを再試行時にトレースを収集します。https://playwright.dev/docs/trace-viewer を参照してください */
    trace: "on-first-retry",
  },

  /* 主要ブラウザ用にプロジェクトを設定します */
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

    /* モバイルビューポートに対してテストします */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* ブランド化されたブラウザに対してテストします */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* テスト開始前にローカル開発サーバーを実行します */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
