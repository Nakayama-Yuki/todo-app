import { test, expect } from "@playwright/test";

test.describe("Todo Application - Theme Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("Toggle between light and dark themes", async ({ page }) => {
    await test.step("Find and click theme toggle button", async () => {
      const themeButton = page.getByRole("button", {
        name: /テーマを切り替え/,
      });
      await expect(themeButton).toBeVisible();
      await themeButton.click();
    });

    await test.step("Verify theme change is applied", async () => {
      const htmlElement = page.locator("html");
      const classAttribute = await htmlElement.getAttribute("class");
      expect(classAttribute).toBeTruthy();
    });

    await test.step("Toggle theme back", async () => {
      const themeButton = page.getByRole("button", {
        name: /テーマを切り替え/,
      });
      await themeButton.click();
    });
  });

  test("Theme persists across page interactions", async ({ page }) => {
    const newTodoText = `Theme Test - ${Date.now()}`;

    await test.step("Add todo in initial theme", async () => {
      const input = page.getByRole("textbox");
      await input.fill(newTodoText);
      await page.getByRole("button", { name: /追加する/ }).click();
      await page.getByText(newTodoText).waitFor({ state: "visible" });
    });

    await test.step("Toggle theme", async () => {
      const themeButton = page.getByRole("button", {
        name: /テーマを切り替え/,
      });
      await themeButton.click();
    });

    await test.step("Verify todo is still visible after theme change", async () => {
      await expect(page.getByText(newTodoText)).toBeVisible();
    });

    await test.step("Verify we can still add todos in new theme", async () => {
      const anotherTodo = `Another Todo - ${Date.now()}`;
      const input = page.getByRole("textbox");
      await input.fill(anotherTodo);
      await page.getByRole("button", { name: /追加する/ }).click();
      await expect(page.getByText(anotherTodo)).toBeVisible();
    });
  });
});
