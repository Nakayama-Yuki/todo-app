import { test, expect } from "@playwright/test";

test.describe("Todo Application - Edge Cases and Validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

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
