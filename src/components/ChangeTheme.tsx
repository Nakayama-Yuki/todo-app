import { ChangeThemeProps } from "@/types/type";

const ChangeTheme: React.FC<ChangeThemeProps> = ({ toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="mb-4 p-2 bg-blue-500 text-white rounded-sm">
      テーマを切り替える
    </button>
  );
};

export default ChangeTheme;
