import React from "react";
import { Todo } from "@/app/page";

interface TaskListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

function TaskList({
  todos,
  toggleTodo,
  deleteTodo,
}: TaskListProps): JSX.Element {
  return (
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
  );
}

export default TaskList;
