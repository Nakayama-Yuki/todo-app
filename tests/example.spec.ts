import { test, expect } from "@playwright/test";

test.describe("Todo App", () => {
  test("loads home and adds/deletes a todo", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "メモアプリ (PostgreSQL版)" }),
    ).toBeVisible();

    const newTodo = `Playwright TODO ${Date.now()}`;
    const input = page.getByRole("textbox").first();
    await input.fill(newTodo);
    await page.getByRole("button", { name: "追加する" }).click();

    const newItem = page.locator("li", { hasText: newTodo });
    await expect(newItem).toBeVisible();

    await newItem.getByRole("button", { name: "消す" }).click();
    await expect(newItem).toHaveCount(0);
  });
});
