"use client";

import { useState, useEffect } from "react";
import AddTask from "@/components/AddTask";
import TaskList from "@/components/TaskList";
import ChangeTheme from "@/components/ChangeTheme";
import { useTheme } from "@/context/themeContext";
import { Todo, ApiResponse } from "@/types/type";

/**
 * メモアプリのメインコンポーネント
 * PostgreSQLデータベースと連携するバージョン
 * Next.js 15, React 19環境で動作するクライアントサイドコンポーネント
 */
export default function Home() {
  // todosの状態管理
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  /**
   * データベースからTodoリストを取得する関数
   */
  async function fetchTodos(): Promise<void> {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/todos");
      const result: ApiResponse<Todo[]> = await response.json();

      if (result.success && result.data) {
        setTodos(result.data);
      } else {
        setError(result.error || "Failed to fetch todos");
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("ネットワークエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  }

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * 新しいTodoを追加する関数
   */
  async function addTodo(): Promise<void> {
    if (input.trim() === "") return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const result: ApiResponse<Todo> = await response.json();

      if (result.success && result.data) {
        // 新しいTodoをリストの先頭に追加
        setTodos((prevTodos) => [result.data!, ...prevTodos]);
        setInput("");
      } else {
        setError(result.error || "Failed to add todo");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("Todoの追加に失敗しました");
    }
  }

  /**
   * Todoの完了状態を切り替える関数
   */
  async function toggleTodo(id: number): Promise<void> {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      const result: ApiResponse<Todo> = await response.json();

      if (result.success && result.data) {
        // ローカル状態を更新
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === id ? result.data! : t))
        );
      } else {
        setError(result.error || "Failed to toggle todo");
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      setError("Todoの更新に失敗しました");
    }
  }

  /**
   * Todoを削除する関数
   */
  async function deleteTodo(id: number): Promise<void> {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        // ローカル状態からも削除
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
      } else {
        setError(result.error || "Failed to delete todo");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Todoの削除に失敗しました");
    }
  }

  /**
   * Todoのテキストを更新する関数
   */
  async function updateTodo(id: number, newText: string): Promise<void> {
    if (newText.trim() === "") return;

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newText }),
      });

      const result: ApiResponse<Todo> = await response.json();

      if (result.success && result.data) {
        // ローカル状態を更新
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === id ? result.data! : t))
        );
      } else {
        setError(result.error || "Failed to update todo");
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("Todoの更新に失敗しました");
    }
  }

  // ローディング中の表示
  if (isLoading) {
    return (
      <div
        className={`container mx-auto p-4 min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>データベースから読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto p-4 min-h-screen ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}>
      <h1 className="text-2xl font-bold mb-4">メモアプリ (PostgreSQL版)</h1>

      {/* エラー表示 */}
      {error && (
        <div
          className={`mb-4 p-4 rounded border ${
            theme === "dark"
              ? "bg-red-900 border-red-700 text-red-100"
              : "bg-red-100 border-red-400 text-red-800"
          }`}>
          {error}
          <button
            onClick={() => setError(null)}
            className={`ml-2 ${
              theme === "dark"
                ? "text-red-200 hover:text-red-100"
                : "text-red-600 hover:text-red-700"
            }`}>
            ×
          </button>
        </div>
      )}

      <AddTask input={input} setInput={setInput} addTodo={addTodo} />
      <TaskList
        todos={todos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
      />
      <ChangeTheme toggleTheme={toggleTheme} />

      {/* データベース接続状態の表示 */}
      <div className="mt-8 text-sm">
        <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
          💾 PostgreSQLデータベースに接続中 (合計: {todos.length}件)
        </p>
      </div>
    </div>
  );
}
