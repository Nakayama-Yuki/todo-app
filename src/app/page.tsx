"use client";

import { useState, useEffect } from "react";
import AddTask from "@/components/AddTask";
import TaskList from "@/components/TaskList";
import { useTheme } from "@/context/themeContext";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  // メモのリスト（todos）と入力フィールドの値（input）を管理している
  const [todos, setTodos] = useState([
    { id: 1, text: "買い物をする", completed: false },
    { id: 2, text: "風呂掃除をする", completed: false },
    { id: 3, text: "犬と散歩", completed: false },
  ]);
  const [input, setInput] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // コンポーネントのマウント時にローカルストレージからメモを読み込む
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    // todosが変更されるたびにローカルストレージにメモを保存する
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // メモを追加する関数
  //入力フィールドが空でない場合、新しいメモオブジェクトを作成し、現在のメモリストに追加します。その後、入力フィールドをクリアします。
  function addTodo() {
    if (input.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput("");
  }

  // メモの完了状態を切り替えるための関数です。
  // 指定されたIDを持つメモを見つけ、そのcompletedプロパティを反転させます。
  function toggleTodo(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
  // 指定されたIDを持つメモをリストから削除するための関数です。
  // フィルタリングを使用して、指定されたID以外のメモだけを残します。
  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div
      className={`container mx-auto p-4 min-h-screen ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}>
      <h1 className="text-2xl font-bold mb-4">メモアプリ</h1>
      <AddTask input={input} setInput={setInput} addTodo={addTodo} />
      <TaskList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      <button
        onClick={toggleTheme}
        className="mb-4 p-2 bg-blue-500 text-white rounded">
        テーマを切り替える
      </button>
    </div>
  );
}
