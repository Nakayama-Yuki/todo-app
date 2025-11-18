import { test, expect } from "@playwright/test";

test.describe("Todo Application - CRUD Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
  });

  test("Display page title and initial UI elements", async ({ page }) => {
    await test.step("Verify page loads with proper structure", async () => {
      await expect(page).toHaveTitle(/Next/);
      await expect(page.getByRole("heading", { name: /TODO/i })).toBeVisible();
    });
  });

  test("Add a new todo task", async ({ page }) => {
    const newTodoText = `Test Todo - ${Date.now()}`;

    await test.step("Fill input field and add todo", async () => {
      const input = page.getByRole("textbox");
      await input.fill(newTodoText);

      const addButton = page.getByRole("button", { name: /追加する/ });
      await addButton.click();
    });

    await test.step("Verify new todo appears in list", async () => {
      const todoItem = page.getByText(newTodoText);
      await expect(todoItem).toBeVisible();
    });

    await test.step("Verify input field is cleared", async () => {
      const input = page.getByRole("textbox");
      await expect(input).toHaveValue("");
    });
  });

  test("Toggle todo completion status", async ({ page }) => {
    const newTodoText = `Toggle Test - ${Date.now()}`;

    await test.step("Add a todo first", async () => {
      const input = page.getByRole("textbox");
      await input.fill(newTodoText);
      await page.getByRole("button", { name: /追加する/ }).click();
      await page.getByText(newTodoText).waitFor({ state: "visible" });
    });

    await test.step("Toggle todo completion", async () => {
      const todoItem = page.getByText(newTodoText).locator("..").first();
      const checkbox = todoItem.getByRole("checkbox");
      await checkbox.click();
      await expect(checkbox).toBeChecked();
    });

    await test.step("Toggle todo back to incomplete", async () => {
      const todoItem = page.getByText(newTodoText).locator("..").first();
      const checkbox = todoItem.getByRole("checkbox");
      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
    });
  });

  test("Edit existing todo text", async ({ page }) => {
    const originalText = `Edit Original - ${Date.now()}`;
    const updatedText = `Edit Updated - ${Date.now()}`;

    await test.step("Add initial todo", async () => {
      const input = page.getByRole("textbox");
      await input.fill(originalText);
      await page.getByRole("button", { name: /追加する/ }).click();
      await page.getByText(originalText).waitFor({ state: "visible" });
    });

    await test.step("Click edit button", async () => {
      const todoItem = page.getByText(originalText).locator("..").first();
      const editButton = todoItem.getByRole("button", { name: /編集/ });
      await editButton.click();
    });

    await test.step("Update todo text in input field", async () => {
      const todoItem = page.getByText(originalText).locator("..").first();
      const editInput = todoItem.getByRole("textbox");
      await editInput.fill(updatedText);

      const saveButton = todoItem.getByRole("button", { name: /保存/ });
      await saveButton.click();
    });

    await test.step("Verify todo text is updated", async () => {
      await expect(page.getByText(updatedText)).toBeVisible();
      await expect(page.getByText(originalText)).not.toBeVisible();
    });
  });

  test("Delete a todo task", async ({ page }) => {
    const todoToDelete = `Delete Me - ${Date.now()}`;

    await test.step("Add a todo to delete", async () => {
      const input = page.getByRole("textbox");
      await input.fill(todoToDelete);
      await page.getByRole("button", { name: /追加する/ }).click();
      await page.getByText(todoToDelete).waitFor({ state: "visible" });
    });

    await test.step("Click delete button", async () => {
      const todoItem = page.getByText(todoToDelete).locator("..").first();
      const deleteButton = todoItem.getByRole("button", { name: /削除/ });
      await deleteButton.click();
    });

    await test.step("Verify todo is removed from list", async () => {
      await expect(page.getByText(todoToDelete)).not.toBeVisible();
    });
  });

  test("Multiple todos are displayed correctly", async ({ page }) => {
    const todos = [
      `Multiple Test 1 - ${Date.now()}`,
      `Multiple Test 2 - ${Date.now()}`,
      `Multiple Test 3 - ${Date.now()}`,
    ];

    await test.step("Add multiple todos", async () => {
      for (const todo of todos) {
        const input = page.getByRole("textbox");
        await input.fill(todo);
        await page.getByRole("button", { name: /追加する/ }).click();
        await page.getByText(todo).waitFor({ state: "visible" });
      }
    });

    await test.step("Verify all todos are visible", async () => {
      for (const todo of todos) {
        await expect(page.getByText(todo)).toBeVisible();
      }
    });

    await test.step("Verify todos are displayed in reverse order", async () => {
      const listItems = page.locator("li");
      const firstItemText = await listItems.first().textContent();
      await expect(firstItemText).toContain(todos[2]);
    });
  });
});
