"use client";

import { useState, useEffect } from "react";
import AddTask from "@/components/AddTask";
import TaskList from "@/components/TaskList";
import ChangeTheme from "@/components/ChangeTheme";
import { useTheme } from "@/context/themeContext";
import { Todo } from "@/types/type";

/**
 * メモアプリのメインコンポーネント
 * Next.js 15, React 19環境で動作するクライアントサイドコンポーネント
 */
export default function Home() {
  // デフォルトのtodos（初期値として使用）
  const defaultTodos: Todo[] = [
    { id: 1, text: "買い物をする", completed: false },
    { id: 2, text: "風呂掃除をする", completed: false },
    { id: 3, text: "犬と散歩", completed: false },
  ];

  // メモのリストと入力フィールドの値を管理
  // 初期状態は空の配列を使用し、useEffectでデータを読み込む

  //todosの右側の解説
  // <Todo[]> - TypeScript のジェネリック型アノテーションで、この状態が Todo 型のオブジェクトの配列であることを指定している。
  // 初期値は空の配列[]を設定
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // ローカルストレージにtodosを保存するヘルパー関数
  function saveTodosToLocalStorage(updatedTodos: Todo[]): void {
    // クライアントサイドでのみ実行されるようにチェック
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }
  }

  // コンポーネントがマウントされた後にローカルストレージから読み込む
  useEffect(() => {
    // ローカルストレージからtodosを取得
    const savedTodos = localStorage.getItem("todos");

    if (savedTodos) {
      // 保存されたデータがある場合は、それを使用
      setTodos(JSON.parse(savedTodos));
    } else {
      // 保存されたデータがない場合は、デフォルト値を設定
      setTodos(defaultTodos);
      // デフォルト値をローカルストレージに保存
      localStorage.setItem("todos", JSON.stringify(defaultTodos));
    }

    // データ読み込み完了のフラグを設定
    setIsLoaded(true);
  }, []);

  // メモを追加する関数
  // 入力フィールドが空でない場合、新しいメモを作成し、ローカルストレージに保存
  function addTodo(): void {
    if (input.trim() === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
    setInput("");
  }

  // メモの完了状態を切り替える関数
  // 指定されたIDのメモのcompletedプロパティを反転し、ローカルストレージを更新
  function toggleTodo(id: number): void {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  }

  // 指定されたIDのメモを削除する関数
  // フィルタリングで指定IDのメモを除外し、ローカルストレージを更新
  function deleteTodo(id: number): void {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  }

  // メモの内容を更新する関数
  // 指定されたIDのメモのテキストを更新し、ローカルストレージを更新
  function updateTodo(id: number, newText: string): void {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );

    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  }

  // データ読み込み前は何も表示しない（ハイドレーションエラー防止）
  if (!isLoaded) {
    return (
      <div className="container mx-auto p-4 min-h-screen">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto p-4 min-h-screen ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}>
      <h1 className="text-2xl font-bold mb-4">メモアプリ</h1>
      <AddTask input={input} setInput={setInput} addTodo={addTodo} />
      <TaskList
        todos={todos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
      />
      <ChangeTheme toggleTheme={toggleTheme} />
    </div>
  );
}
