import { test, expect } from "@playwright/test";
import {
  setupPage,
  createTodo,
  deleteTodo,
  toggleTodo,
  generateTodoText,
} from "./helpers";

test.describe("Todo Toggle Completion", () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page);
  });

  test("toggles todo completion", async ({ page }) => {
    const todoText = generateTodoText("Playwright Toggle");
    const item = await createTodo(page, todoText);

    const checkbox = item.getByRole("checkbox");

    // 初期状態: 未完了
    await expect(checkbox).not.toBeChecked();

    // 完了状態に切り替え
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // 未完了状態に戻す
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();

    await deleteTodo(item);
  });

  test("verifies completed todo style", async ({ page }) => {
    const todoText = generateTodoText("Style Check");
    const item = await createTodo(page, todoText);

    const checkbox = item.getByRole("checkbox");

    // 完了状態に切り替え
    await toggleTodo(item);
    await expect(checkbox).toBeChecked();

    // 完了済みTodoの視覚的な確認（line-through スタイルなど）
    const todoLabel = item.locator("label");
    await expect(todoLabel).toBeVisible();

    // line-through クラスまたはスタイルが適用されていることを確認
    const hasLineThrough = await todoLabel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.textDecoration.includes("line-through");
    });
    expect(hasLineThrough).toBe(true);

    // 未完了に戻す
    await toggleTodo(item);
    await expect(checkbox).not.toBeChecked();

    // line-through が解除されることを確認
    const noLineThrough = await todoLabel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return !style.textDecoration.includes("line-through");
    });
    expect(noLineThrough).toBe(true);

    await deleteTodo(item);
  });
});
