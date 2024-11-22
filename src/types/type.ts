export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface TaskListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  updateTodo: (id: number, newText: string) => void;
}

export interface AddTaskProps {
  input: string;
  setInput: (input: string) => void;
  addTodo: () => void;
}

export interface ChangeThemeProps {
  toggleTheme: () => void;
}
