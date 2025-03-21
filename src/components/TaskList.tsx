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
  const { theme } = useTheme(); // 追加

  // 編集ボタンがクリックされたときの関数
  function handleEdit(id: number, currentText: string) {
    setEditId(id);
    setEditText(currentText);
  }

  // セーブボタンがクリックされたときの関数
  function handleSave(id: number) {
    updateTodo(id, editText);
    setEditId(null);
    setEditText("");
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
          />
          {editId === todo.id ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              // テーマに応じたスタイルを適用
              className={`border rounded p-1 ${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
              }`}
            />
          ) : (
            <label
              className={`cursor-pointer ${
                todo.completed
                  ? "line-through text-gray-400"
                  : theme === "dark"
                  ? "text-white"
                  : "text-black"
              }`}>
              {todo.text}
            </label>
          )}
          {editId === todo.id ? (
            <button
              onClick={() => handleSave(todo.id)}
              className="bg-green-500 text-white p-1 ml-2 rounded-sm">
              保存する
            </button>
          ) : (
            <button
              onClick={() => handleEdit(todo.id, todo.text)}
              className="bg-yellow-500 text-white p-1 ml-2 rounded-sm">
              編集
            </button>
          )}
          <button
            onClick={() => deleteTodo(todo.id)}
            className="bg-red-500 text-white p-1 ml-2 rounded-sm">
            消す
          </button>
        </li>
      ))}
    </ul>
  );
}
