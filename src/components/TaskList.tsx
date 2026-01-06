import { useState } from "react";
import { Todo, TaskListProps } from "@/types/type";
import { useTheme } from "@/context/themeContext"; // 追加

/**
 * タスクリストを表示するコンポーネント
 * タスクの表示、完了状態の切り替え、編集、削除の機能を提供
 */
export default function TaskList({
  todos,
  toggleTodo,
  deleteTodo,
  updateTodo,
}: TaskListProps) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme(); // 追加

  // 編集ボタンがクリックされたときの関数
  function handleEdit(id: number, currentText: string) {
    setEditId(id);
    setEditText(currentText);
    setError(null); // エラーをクリア
  }

  // セーブボタンがクリックされたときの関数
  async function handleSave(id: number) {
    setIsSaving(true);
    setError(null);

    const success = await updateTodo(id, editText);

    setIsSaving(false);

    if (success) {
      // 成功時のみ編集モードを終了
      setEditId(null);
      setEditText("");
    } else {
      // 失敗時はエラー表示して編集モードを継続
      setError("保存に失敗しました。もう一度お試しください。");
    }
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className="mb-2">
          <input
            type="checkbox"
            className="m-2"
            onChange={() => toggleTodo(todo.id)}
            checked={todo.completed}
            disabled={editId === todo.id && isSaving}
          />
          {editId === todo.id ?
            <>
              {/* 編集中でもテキストを DOM 上に保持してロケーターが途切れないようにする */}
              <span className="sr-only" aria-hidden>
                {todo.text}
              </span>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                disabled={isSaving}
                // テーマに応じたスタイルを適用
                className={`border rounded p-1 ${
                  theme === "dark" ?
                    "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
                }`}
              />
              {error && editId === todo.id && (
                <span className="text-red-500 text-sm ml-2">{error}</span>
              )}
            </>
          : <label
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-500"
                : theme === "dark" ? "text-white"
                : "text-black"
              }`}
            >
              {todo.text}
            </label>
          }
          {editId === todo.id ?
            <button
              onClick={() => handleSave(todo.id)}
              disabled={isSaving}
              className={`bg-green-600 text-white p-1 ml-2 rounded-sm ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "保存中..." : "保存する"}
            </button>
          : <button
              onClick={() => handleEdit(todo.id, todo.text)}
              className="bg-yellow-600 text-white p-1 ml-2 rounded-sm"
            >
              編集
            </button>
          }
          <button
            onClick={() => deleteTodo(todo.id)}
            disabled={editId === todo.id && isSaving}
            className={`bg-red-600 text-white p-1 ml-2 rounded-sm ${
              editId === todo.id && isSaving ?
                "opacity-50 cursor-not-allowed"
              : ""
            }`}
          >
            消す
          </button>
        </li>
      ))}
    </ul>
  );
}
