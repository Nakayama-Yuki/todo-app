"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const addTodo = () => {
    if (input.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div
      className={`container mx-auto p-4 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } min-h-screen`}>
      <button
        onClick={toggleTheme}
        className="mb-4 bg-gray-800 text-white dark:bg-gray-200 dark:text-black p-2 rounded">
        Toggle Dark Mode
      </button>
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Todo App</h1>
      <div className="mb-4">
        <input
          type="text"
          className="border rounded p-2 mr-2 w-80 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 rounded dark:bg-blue-700">
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2 dark:text-white">
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`cursor-pointer ${
                todo.completed ? "line-through" : ""
              }`}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white p-1 ml-2 rounded dark:bg-red-700">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
