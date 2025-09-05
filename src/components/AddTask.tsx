import { useTheme } from "@/context/themeContext";
import { AddTaskProps } from "@/types/type";

export default function AddTask({ input, setInput, addTodo }: AddTaskProps) {
  // テーマコンテキストからテーマ情報を取得
  const { theme } = useTheme();

  return (
    <div className="mb-4">
      {/* タスク入力フィールド */}
      <input
        type="text"
        className={`border rounded p-2 mr-2 w-80 ${
          theme === "dark"
            ? "bg-gray-700 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {/* タスク追加ボタン */}
      <button
        onClick={addTodo}
        className="bg-blue-600 text-white p-2 rounded-sm">
        追加する
      </button>
    </div>
  );
}
