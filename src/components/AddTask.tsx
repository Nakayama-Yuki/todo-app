import React from "react";

interface AddTaskProps {
  input: string;
  setInput: (input: string) => void;
  addTodo: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ input, setInput, addTodo }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        className="border rounded p-2 mr-2 w-80"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded">
        追加する
      </button>
    </div>
  );
};

export default AddTask;
