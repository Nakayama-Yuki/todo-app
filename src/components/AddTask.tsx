import React from "react";
import { useTheme } from "@/context/themeContext";
import { AddTaskProps } from "@/types/type";

const AddTask: React.FC<AddTaskProps> = ({ input, setInput, addTodo }) => {
  const { theme } = useTheme();

  return (
    <div className="mb-4">
      <input
        type="text"
        className={`border rounded p-2 mr-2 w-80 ${
          theme === "dark" ? "text-black" : "text-black"
        }`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded-sm">
        追加する
      </button>
    </div>
  );
};

export default AddTask;
