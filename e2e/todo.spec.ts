import { test, expect } from "@playwright/test";

test.describe("Todo App E2E Tests", () => {
  test("should load the homepage", async ({ page }) => {
    await page.goto("/");

    // Check if the page title or main heading is present
    await expect(page).toHaveTitle(/Todo App/i);
  });

  test("should add a new todo", async ({ page }) => {
    await page.goto("/");

    // Find the input field and add button (adjust selectors based on your actual implementation)
    const input = page
      .getByRole("textbox", { name: /add.*todo/i })
      .or(page.getByPlaceholder(/add.*todo/i));
    const addButton = page.getByRole("button", { name: /add/i });

    // Add a new todo
    await input.fill("Test Todo Item");
    await addButton.click();

    // Verify the todo was added
    await expect(page.getByText("Test Todo Item")).toBeVisible();
  });

  test("should mark todo as completed", async ({ page }) => {
    await page.goto("/");

    // Add a todo first
    const input = page
      .getByRole("textbox", { name: /add.*todo/i })
      .or(page.getByPlaceholder(/add.*todo/i));
    const addButton = page.getByRole("button", { name: /add/i });
    await input.fill("Complete Me");
    await addButton.click();

    // Find and click the checkbox or complete button
    const checkbox = page.getByRole("checkbox").first();
    await checkbox.check();

    // Verify the todo is marked as completed (adjust based on your UI)
    // This might be checking for a strikethrough, different color, etc.
    await expect(page.getByText("Complete Me")).toBeVisible();
  });

  test("should delete a todo", async ({ page }) => {
    await page.goto("/");

    // Add a todo first
    const input = page
      .getByRole("textbox", { name: /add.*todo/i })
      .or(page.getByPlaceholder(/add.*todo/i));
    const addButton = page.getByRole("button", { name: /add/i });
    await input.fill("Delete Me");
    await addButton.click();

    // Verify it was added
    await expect(page.getByText("Delete Me")).toBeVisible();

    // Find and click the delete button
    const deleteButton = page.getByRole("button", { name: /delete/i }).first();
    await deleteButton.click();

    // Verify the todo was deleted
    await expect(page.getByText("Delete Me")).not.toBeVisible();
  });
});
