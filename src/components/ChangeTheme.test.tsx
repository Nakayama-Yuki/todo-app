import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangeTheme from "@/components/ChangeTheme";
import ThemeProvider from "@/context/themeContext";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe("ChangeTheme コンポーネント", () => {
  it("テーマ切り替えボタンが表示される", () => {
    const mockToggleTheme = vi.fn();

    renderWithTheme(<ChangeTheme toggleTheme={mockToggleTheme} />);

    expect(
      screen.getByRole("button", { name: "テーマを切り替える" })
    ).toBeInTheDocument();
  });

  it("ボタンをクリックするとtoggleThemeが呼ばれる", async () => {
    const user = userEvent.setup();
    const mockToggleTheme = vi.fn();

    renderWithTheme(<ChangeTheme toggleTheme={mockToggleTheme} />);

    const button = screen.getByRole("button", { name: "テーマを切り替える" });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
