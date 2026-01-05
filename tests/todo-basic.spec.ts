import { test, expect } from "@playwright/test";
import {
  setupPage,
  createTodo,
  deleteTodo,
  getTodoCount,
  generateTodoText,
} from "./helpers";

test.describe("Todo Basic Operations", () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test("adds and deletes a todo", async ({ page }) => {
    const todoText = generateTodoText("Playwright TODO");
    const item = await createTodo(page, todoText);
    await deleteTodo(item);
  });

  test("validates empty input - empty string", async ({ page }) => {
    const initialCount = await getTodoCount(page);

    // 空文字を入力して追加ボタンをクリック
    const input = page.getByRole("textbox").first();
    await input.fill("");
    await page.getByRole("button", { name: "追加する" }).click();

    // Todo が追加されないことを確認
    const currentCount = await getTodoCount(page);
    expect(currentCount).toBe(initialCount);
  });

  test("validates empty input - whitespace only", async ({ page }) => {
    const initialCount = await getTodoCount(page);

    // 空白文字のみを入力して追加ボタンをクリック
    const input = page.getByRole("textbox").first();
    await input.fill("   ");
    await page.getByRole("button", { name: "追加する" }).click();

    // Todo が追加されないことを確認
    const currentCount = await getTodoCount(page);
    expect(currentCount).toBe(initialCount);
  });

  test("handles long text (100 characters)", async ({ page }) => {
    // 100文字のテキストを生成（"a"を100回繰り返す）
    const longText = "a".repeat(100);
    expect(longText.length).toBe(100);

    const item = await createTodo(page, longText);

    // 作成されたTodoに長文が正しく表示されることを確認
    await expect(item).toContainText(longText);

    await deleteTodo(item);
  });

  test("handles special characters and emojis", async ({ page }) => {
    const specialText = "🎉✨ Test !@#$%&*() Todo 🚀";

    const item = await createTodo(page, specialText);

    // 特殊文字と絵文字が正しく表示されることを確認
    await expect(item).toContainText(specialText);
    await expect(item).toContainText("🎉");
    await expect(item).toContainText("!@#$%&*()");

    await deleteTodo(item);
  });

  test("displays and closes error message", async ({ page }) => {
    // APIリクエストを強制的に失敗させる
    await page.route("/api/todos", (route) => route.abort());

    const todoText = generateTodoText("Error Test");
    const input = page.getByRole("textbox").first();
    await input.fill(todoText);
    await page.getByRole("button", { name: "追加する" }).click();

    // エラーメッセージが表示されることを確認
    const errorMessage = page.getByText("Todoの追加に失敗しました");
    await expect(errorMessage).toBeVisible();

    // エラーメッセージ内の × ボタンをクリック
    const closeButton = page.getByRole("button", { name: "×" });
    await closeButton.click();

    // エラーメッセージが非表示になることを確認
    await expect(errorMessage).not.toBeVisible();

    // ルートモックを解除してクリーンアップ
    await page.unroute("/api/todos");
  });
});
