import { useState } from "react";

export default function TodoList() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);


  const addTask = () => {
    if (!task.trim()) return;
    setTodos([...todos, task]);
    setTask("");
  };

  return (
    <div className="todo-box">
      <input
        type="text"
        placeholder="Add a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button className="add-btn" onClick={addTask}>Add</button>

      <ul>
        {todos.map((item, index) => (
          <li key={index}>
            {item}
            <button className="delete-btn" onClick={() => setTodos(todos.filter((_, i) => i !== index))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}