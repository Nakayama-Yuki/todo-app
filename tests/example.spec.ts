// 最小限のPlaywrightテストサンプル
import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // タイトルに特定の文字列が含まれていることを期待する
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // 「Get started」リンクをクリックする
  await page.getByRole("link", { name: "Get started" }).click();

  // 「Installation」という名前の見出しが表示されていることを期待する
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
