import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskList from "@/components/TaskList";
import ThemeProvider from "@/context/themeContext";
import type { Todo } from "@/types/type";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("TaskList コンポーネント", () => {
  const mockTodos: Todo[] = [
    { id: 1, text: "Task 1", completed: false },
    { id: 2, text: "Task 2", completed: true },
  ];

  it("全てのTodoが表示される", () => {
    const mockToggleTodo = vi.fn();
    const mockDeleteTodo = vi.fn();
    const mockUpdateTodo = vi.fn();

    renderWithTheme(
      <TaskList
        todos={mockTodos}
        toggleTodo={mockToggleTodo}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />
    );

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("完了済みのTodoにチェックが入っている", () => {
    const mockToggleTodo = vi.fn();
    const mockDeleteTodo = vi.fn();
    const mockUpdateTodo = vi.fn();

    renderWithTheme(
      <TaskList
        todos={mockTodos}
        toggleTodo={mockToggleTodo}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked(); // Task 1
    expect(checkboxes[1]).toBeChecked(); // Task 2
  });

  it("チェックボックスをクリックするとtoggleTodoが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockToggleTodo = vi.fn();
    const mockDeleteTodo = vi.fn();
    const mockUpdateTodo = vi.fn();

    renderWithTheme(
      <TaskList
        todos={mockTodos}
        toggleTodo={mockToggleTodo}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(mockToggleTodo).toHaveBeenCalledWith(1);
  });

  it("削除ボタンをクリックするとdeleteTodoが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockToggleTodo = vi.fn();
    const mockDeleteTodo = vi.fn();
    const mockUpdateTodo = vi.fn();

    renderWithTheme(
      <TaskList
        todos={mockTodos}
        toggleTodo={mockToggleTodo}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: "消す" });
    await user.click(deleteButtons[0]);

    expect(mockDeleteTodo).toHaveBeenCalledWith(1);
  });

  it("編集ボタンをクリックすると編集モードになる", async () => {
    const user = userEvent.setup();
    const mockToggleTodo = vi.fn();
    const mockDeleteTodo = vi.fn();
    const mockUpdateTodo = vi.fn();

    renderWithTheme(
      <TaskList
        todos={mockTodos}
        toggleTodo={mockToggleTodo}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />
    );

    const editButtons = screen.getAllByRole("button", { name: "編集" });
    await user.click(editButtons[0]);

    // 編集モードでは入力フィールドと保存ボタンが表示される
    expect(screen.getByDisplayValue("Task 1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "保存する" })
    ).toBeInTheDocument();
  });

  it("編集して保存するとupdateTodoが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockToggleTodo = vi.fn();
    const mockDeleteTodo = vi.fn();
    const mockUpdateTodo = vi.fn();

    renderWithTheme(
      <TaskList
        todos={mockTodos}
        toggleTodo={mockToggleTodo}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />
    );

    // 編集モードに入る
    const editButtons = screen.getAllByRole("button", { name: "編集" });
    await user.click(editButtons[0]);

    // テキストを変更
    const input = screen.getByDisplayValue("Task 1");
    await user.clear(input);
    await user.type(input, "Updated Task 1");

    // 保存
    const saveButton = screen.getByRole("button", { name: "保存する" });
    await user.click(saveButton);

    expect(mockUpdateTodo).toHaveBeenCalledWith(1, "Updated Task 1");
  });

  it("Todoがない場合は何も表示されない", () => {
    const mockToggleTodo = vi.fn();
    const mockDeleteTodo = vi.fn();
    const mockUpdateTodo = vi.fn();

    renderWithTheme(
      <TaskList
        todos={[]}
        toggleTodo={mockToggleTodo}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />
    );

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
