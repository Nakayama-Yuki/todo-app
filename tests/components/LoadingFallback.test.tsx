import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingFallback from "@/components/LoadingFallback";

describe("LoadingFallback コンポーネント", () => {
  it("読み込み中のテキストが表示される", () => {
    render(<LoadingFallback />);

    expect(screen.getByText("読み込み中...")).toBeInTheDocument();
  });

  it("中央揃えのコンテナがレンダリングされる", () => {
    const { container } = render(<LoadingFallback />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      "flex",
      "justify-center",
      "items-center",
      "min-h-screen"
    );
  });
});
