import { ChangeThemeProps } from "@/types/type";

export default function ChangeTheme({ toggleTheme }: ChangeThemeProps) {
  return (
    <button
      onClick={toggleTheme}
      className="mb-4 p-2 bg-blue-500 text-white rounded-sm">
      テーマを切り替える
    </button>
  );
}
