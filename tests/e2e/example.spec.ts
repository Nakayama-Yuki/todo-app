// Playwright のセットアップが正常に動作し、公式サイトへアクセスできるかを簡易確認する。
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // ランディングページのタイトルが期待どおりかを確認し、環境の健全性をチェックする。
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // ナビゲーションが機能していることを CTA リンク経由で確認する。
  await page.getByRole("link", { name: "Get started" }).click();

  // 遷移先の Installation 見出しが表示されれば、目的ページが正しく読み込まれたと判断できる。
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
