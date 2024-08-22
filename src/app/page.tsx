"use client";

// todo 完了をチェックボタンで切り替えられるようにする（チェックボタンを押すと、四角いボタンにチェックがつき、リストの文字が取り消し線になる）
import { useState } from "react";
import AddTask from "@/components/AddTask";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  // メモのリスト（todos）と入力フィールドの値（input）を管理している
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

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
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">メモアプリ</h1>
      <AddTask input={input} setInput={setInput} addTodo={addTodo} />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2">
            <input
              type="checkbox"
              name=""
              id=""
              className="m-2"
              onChange={() => toggleTodo(todo.id)}
            />
            <label
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}>
              {todo.text}
            </label>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white p-1 ml-2 rounded">
              消す
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
