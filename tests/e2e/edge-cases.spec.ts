import { test, expect } from "@playwright/test";

// このスイートでは Todo の入力バリデーションと UI が想定外の入力でも安定するかを検証する。
test.describe("Todo Application - Edge Cases and Validation", () => {
  // 毎回トップページを開き、各ケースをクリーンな状態から実行する。
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  // 空文字の送信が拒否されることで、ダミーの Todo が表示されないことを確認する。
  test("Prevent adding empty todo", async ({ page }) => {
    await test.step("Try to add empty todo", async () => {
      const input = page.getByRole("textbox");
      await input.fill("");
      const addButton = page.getByRole("button", { name: /追加する/ });
      await addButton.click();
    });

    await test.step("Verify no empty todo is added", async () => {
      const listItems = page.locator("li");
      const count = await listItems.count();
      expect(count).toBe(0);
    });
  });

  // 空白のみの入力も登録されず、ゆるいチェックをすり抜けないことを確かめる。
  test("Prevent adding whitespace-only todo", async ({ page }) => {
    await test.step("Try to add whitespace-only todo", async () => {
      const input = page.getByRole("textbox");
      await input.fill("   ");
      const addButton = page.getByRole("button", { name: /追加する/ });
      await addButton.click();
    });

    await test.step("Verify no whitespace-only todo is added", async () => {
      const listItems = page.locator("li");
      const count = await listItems.count();
      expect(count).toBe(0);
    });
  });

  // 記号や特殊文字が意図せず除去されず、そのまま表示できることを保証する。
  test("Handle special characters in todo text", async ({ page }) => {
    const specialCharsTodo = `Special: !@#$%^&*() - ${Date.now()}`;

    await test.step("Add todo with special characters", async () => {
      const input = page.getByRole("textbox");
      await input.fill(specialCharsTodo);
      await page.getByRole("button", { name: /追加する/ }).click();
    });

    await test.step("Verify special characters are preserved", async () => {
      await expect(page.getByText(specialCharsTodo)).toBeVisible();
    });
  });

  // 非常に長いテキストでもレイアウト崩れが起きず、全文が確認できることを検証する。
  test("Handle very long todo text", async ({ page }) => {
    const longText = `Long Todo Text - ${"a".repeat(200)} - ${Date.now()}`;

    await test.step("Add todo with long text", async () => {
      const input = page.getByRole("textbox");
      await input.fill(longText);
      await page.getByRole("button", { name: /追加する/ }).click();
    });

    await test.step("Verify long text is displayed correctly", async () => {
      const todoItem = page.getByText(longText, { exact: false });
      await expect(todoItem).toBeVisible();
    });
  });

  // 連続で Todo を追加しても UI が固まらず、全件が描画されることを確認する。
  test("UI remains responsive with many todos", async ({ page }) => {
    await test.step("Add multiple todos rapidly", async () => {
      for (let i = 0; i < 5; i++) {
        const input = page.getByRole("textbox");
        await input.fill(`Rapid Add ${i} - ${Date.now()}`);
        await page.getByRole("button", { name: /追加する/ }).click();
      }
    });

    await test.step("Verify all todos are visible", async () => {
      const listItems = page.locator("li");
      expect(await listItems.count()).toBe(5);
    });

    await test.step("Verify input field is responsive", async () => {
      const input = page.getByRole("textbox");
      await input.fill("Final Todo");
      await expect(input).toHaveValue("Final Todo");
    });
  });

  // Unicode や絵文字を使ったタイトルでも欠損せず表示できることを保証する。
  test("Handle Unicode and emoji characters", async ({ page }) => {
    const emojiTodo = `Todo with emoji 🎉✨ - ${Date.now()}`;

    await test.step("Add todo with emoji", async () => {
      const input = page.getByRole("textbox");
      await input.fill(emojiTodo);
      await page.getByRole("button", { name: /追加する/ }).click();
    });

    await test.step("Verify emoji is displayed correctly", async () => {
      await expect(page.getByText(emojiTodo)).toBeVisible();
    });
  });
});
