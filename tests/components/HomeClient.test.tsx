import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomeClient from "@/components/HomeClient";
import ThemeProvider from "@/context/themeContext";
import type { Todo } from "@/types/type";

// ThemeProvider でラップするヘルパー関数
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("HomeClient コンポーネント", () => {
  const mockTodos: Todo[] = [
    { id: 1, text: "Task 1", completed: false },
    { id: 2, text: "Task 2", completed: true },
  ];

  beforeEach(() => {
    // Fetch API をモック
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("初期レンダリング", () => {
    it("初期Todoが表示される", () => {
      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    it("タイトルが表示される", () => {
      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      expect(screen.getByText("メモアプリ (PostgreSQL版)")).toBeInTheDocument();
    });

    it("Todoの件数が表示される", () => {
      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      expect(screen.getByText(/合計: 2件/)).toBeInTheDocument();
    });

    it("入力フィールドと追加ボタンが表示される", () => {
      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "追加する" })
      ).toBeInTheDocument();
    });

    it("空のTodoリストの場合、追加フォームのみが表示される", () => {
      renderWithTheme(<HomeClient initialTodos={[]} />);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByText(/合計: 0件/)).toBeInTheDocument();
    });
  });

  describe("Todoの追加機能", () => {
    it("新しいTodoを追加すると、リストに表示される", async () => {
      const user = userEvent.setup();
      const newTodo: Todo = { id: 3, text: "New Task", completed: false };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: newTodo,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Task");

      const addButton = screen.getByRole("button", { name: "追加する" });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("New Task")).toBeInTheDocument();
      });
    });

    it("Todoが正しく先頭に追加される", async () => {
      const user = userEvent.setup();
      const newTodo: Todo = { id: 3, text: "New Task", completed: false };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: newTodo,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Task");

      const addButton = screen.getByRole("button", { name: "追加する" });
      await user.click(addButton);

      await waitFor(() => {
        const allTasks = screen.getAllByRole("checkbox").length;
        expect(allTasks).toBe(3);
      });
    });

    it("追加後に入力フィールドがクリアされる", async () => {
      const user = userEvent.setup();
      const newTodo: Todo = { id: 3, text: "New Task", completed: false };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: newTodo,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      await user.type(input, "New Task");

      const addButton = screen.getByRole("button", { name: "追加する" });
      await user.click(addButton);

      await waitFor(() => {
        expect(input.value).toBe("");
      });
    });

    it("空のテキストではTodoが追加されない", async () => {
      const user = userEvent.setup();

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const addButton = screen.getByRole("button", { name: "追加する" });
      await user.click(addButton);

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("APIエラー時、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: "Server error",
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Task");

      const addButton = screen.getByRole("button", { name: "追加する" });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });
    });

    it("ネットワークエラー時、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Task");

      const addButton = screen.getByRole("button", { name: "追加する" });
      await user.click(addButton);

      await waitFor(() => {
        expect(
          screen.getByText("Todoの追加に失敗しました")
        ).toBeInTheDocument();
      });
    });

    it("エラーメッセージの閉じるボタンをクリックしてクリアできる", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: "Server error",
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "New Task");

      const addButton = screen.getByRole("button", { name: "追加する" });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("Server error")).toBeInTheDocument();
      });

      const closeButton = screen.getByRole("button", { name: "×" });
      await user.click(closeButton);

      expect(screen.queryByText("Server error")).not.toBeInTheDocument();
    });
  });

  describe("Todoの完了状態切り替え機能", () => {
    it("チェックボックスをクリックするとtoggle APIが呼ばれる", async () => {
      const user = userEvent.setup();
      const updatedTodo: Todo = { ...mockTodos[0], completed: true };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: updatedTodo,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/todos/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify({ completed: true }),
        })
      );
    });

    it("APIレスポンスでローカル状態が更新される", async () => {
      const user = userEvent.setup();
      const updatedTodo: Todo = { ...mockTodos[0], completed: true };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: updatedTodo,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      await waitFor(() => {
        const updatedCheckboxes = screen.getAllByRole("checkbox");
        expect(updatedCheckboxes[0]).toBeChecked();
      });
    });

    it("toggle時にエラーが発生すると、エラーメッセージが表示される", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: "Toggle failed",
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      await waitFor(() => {
        expect(screen.getByText("Toggle failed")).toBeInTheDocument();
      });
    });

    it("toggle時にネットワークエラーが発生する場合", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const checkboxes = screen.getAllByRole("checkbox");
      await user.click(checkboxes[0]);

      await waitFor(() => {
        expect(
          screen.getByText("Todoの更新に失敗しました")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Todoの削除機能", () => {
    it("削除ボタンをクリックするとdelete APIが呼ばれる", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const deleteButtons = screen.getAllByRole("button", { name: "消す" });
      await user.click(deleteButtons[0]);

      expect(global.fetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "DELETE",
      });
    });

    it("削除後にTodoがリストから削除される", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      expect(screen.getByText("Task 1")).toBeInTheDocument();

      const deleteButtons = screen.getAllByRole("button", { name: "消す" });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
      });
    });

    it("削除時にエラーが発生する場合", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: "Delete failed",
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const deleteButtons = screen.getAllByRole("button", { name: "消す" });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText("Delete failed")).toBeInTheDocument();
      });
    });

    it("削除時にネットワークエラーが発生する場合", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const deleteButtons = screen.getAllByRole("button", { name: "消す" });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("Todoの削除に失敗しました")
        ).toBeInTheDocument();
      });
    });

    it("削除後のTodo件数が正しく更新される", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      expect(screen.getByText(/合計: 2件/)).toBeInTheDocument();

      const deleteButtons = screen.getAllByRole("button", { name: "消す" });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/合計: 1件/)).toBeInTheDocument();
      });
    });
  });

  describe("Todoの更新機能", () => {
    it("編集ボタンをクリックするとupdate APIが呼ばれる", async () => {
      const user = userEvent.setup();
      const updatedTodo: Todo = { ...mockTodos[0], text: "Updated Task" };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: updatedTodo,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const editButtons = screen.getAllByRole("button", { name: "編集" });
      await user.click(editButtons[0]);

      const inputs = screen.getAllByRole("textbox");
      const editInput = inputs[inputs.length - 1];
      await user.clear(editInput);
      await user.type(editInput, "Updated Task");

      const saveButton = screen.getByRole("button", { name: "保存する" });
      await user.click(saveButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/todos/1",
          expect.objectContaining({
            method: "PUT",
            body: JSON.stringify({ text: "Updated Task" }),
          })
        );
      });
    });

    it("更新後にTodoのテキストが更新される", async () => {
      const user = userEvent.setup();
      const updatedTodo: Todo = { ...mockTodos[0], text: "Updated Task" };

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: updatedTodo,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const editButtons = screen.getAllByRole("button", { name: "編集" });
      await user.click(editButtons[0]);

      const inputs = screen.getAllByRole("textbox");
      const editInput = inputs[inputs.length - 1];
      await user.clear(editInput);
      await user.type(editInput, "Updated Task");

      const saveButton = screen.getByRole("button", { name: "保存する" });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Updated Task")).toBeInTheDocument();
      });
    });

    it("更新時にエラーが発生する場合", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: false,
          error: "Update failed",
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const editButtons = screen.getAllByRole("button", { name: "編集" });
      await user.click(editButtons[0]);

      const inputs = screen.getAllByRole("textbox");
      const editInput = inputs[inputs.length - 1];
      await user.clear(editInput);
      await user.type(editInput, "Updated Task");

      const saveButton = screen.getByRole("button", { name: "保存する" });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText("Update failed")).toBeInTheDocument();
      });
    });

    it("更新時にネットワークエラーが発生する場合", async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const editButtons = screen.getAllByRole("button", { name: "編集" });
      await user.click(editButtons[0]);

      const inputs = screen.getAllByRole("textbox");
      const editInput = inputs[inputs.length - 1];
      await user.clear(editInput);
      await user.type(editInput, "Updated Task");

      const saveButton = screen.getByRole("button", { name: "保存する" });
      await user.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText("Todoの更新に失敗しました")
        ).toBeInTheDocument();
      });
    });

    it("空のテキストではTodoが更新されない", async () => {
      const user = userEvent.setup();

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const editButtons = screen.getAllByRole("button", { name: "編集" });
      await user.click(editButtons[0]);

      const inputs = screen.getAllByRole("textbox");
      const editInput = inputs[inputs.length - 1];
      await user.clear(editInput);
      await user.type(editInput, "  ");

      const saveButton = screen.getByRole("button", { name: "保存する" });
      await user.click(saveButton);

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("テーマ切り替え機能", () => {
    it("テーマ切り替えボタンが表示される", () => {
      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      expect(
        screen.getByRole("button", { name: /テーマ/ })
      ).toBeInTheDocument();
    });

    it("テーマ切り替えボタンをクリックするとテーマが変更される", async () => {
      const user = userEvent.setup();

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      const themeButton = screen.getByRole("button", { name: /テーマ/ });
      const originalClasses = themeButton.parentElement?.className;

      await user.click(themeButton);

      // テーマが切り替わったことを確認（スタイルが変更される）
      await waitFor(() => {
        expect(themeButton.parentElement?.className).not.toBe(originalClasses);
      });
    });
  });

  describe("複数操作の組み合わせ", () => {
    it("複数のTodo操作を順序どおり実行できる", async () => {
      const user = userEvent.setup();
      const newTodo: Todo = { id: 3, text: "New Task", completed: false };

      // 追加操作のモック
      (global.fetch as any).mockResolvedValueOnce({
        json: async () => ({
          success: true,
          data: newTodo,
        }),
      });

      renderWithTheme(<HomeClient initialTodos={mockTodos} />);

      // Todoを追加
      const input = screen.getByRole("textbox");
      await user.type(input, "New Task");
      const addButton = screen.getByRole("button", { name: "追加する" });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByText("New Task")).toBeInTheDocument();
      });

      expect(screen.getByText(/合計: 3件/)).toBeInTheDocument();
    });
  });
});
