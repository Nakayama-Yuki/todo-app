import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTask from "@/components/AddTask";
import ThemeProvider from "@/context/themeContext";

// ThemeProvider でラップするヘルパー関数
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("AddTask コンポーネント", () => {
  it("入力フィールドとボタンが表示される", () => {
    const mockSetInput = vi.fn();
    const mockAddTodo = vi.fn();

    renderWithTheme(
      <AddTask input="" setInput={mockSetInput} addTodo={mockAddTodo} />
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "追加する" })
    ).toBeInTheDocument();
  });

  it("入力値が変更されるとsetInputが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockSetInput = vi.fn();
    const mockAddTodo = vi.fn();

    renderWithTheme(
      <AddTask input="" setInput={mockSetInput} addTodo={mockAddTodo} />
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "New Task");

    expect(mockSetInput).toHaveBeenCalled();
  });

  it("追加ボタンをクリックするとaddTodoが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockSetInput = vi.fn();
    const mockAddTodo = vi.fn();

    renderWithTheme(
      <AddTask
        input="Test Task"
        setInput={mockSetInput}
        addTodo={mockAddTodo}
      />
    );

    const button = screen.getByRole("button", { name: "追加する" });
    await user.click(button);

    expect(mockAddTodo).toHaveBeenCalledTimes(1);
  });

  it("input propsの値が表示される", () => {
    const mockSetInput = vi.fn();
    const mockAddTodo = vi.fn();

    renderWithTheme(
      <AddTask
        input="Initial Value"
        setInput={mockSetInput}
        addTodo={mockAddTodo}
      />
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("Initial Value");
  });
});
