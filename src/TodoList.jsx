import React, { useState, useEffect } from "react";
import "./App.css";

const TodoList = () => {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Category");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const categoryList = ["Category", "Work", "Study"];

  const [todos, setTodos] = useState(() => 
    JSON.parse(localStorage.getItem("myTodos")) || []
  );

  useEffect(() => {
    localStorage.setItem("myTodos", JSON.stringify(todos));
  }, [todos]);

  const addTask = () => {
    if (!task.trim()) return;
    setTodos([{
      id: Date.now(),
      text: task,
      category,
      priority: priority || "No Priority",
      date: date || "No Date"
    }, ...todos]);

    setTask(""); 
    setPriority(""); 
    setDate(""); 
    setCategory("Category"); 
  };

  const addNewCategory = () => {
    if (newCategoryName.trim()) {
      setCategory(newCategoryName.trim());
    }
    setNewCategoryName("");
    setShowAddInput(false);
  };

  return (
    <div className="todo-container">
      <div className="input-section">
        <input className="main-input" placeholder="Enter ToDo List?" value={task}
          onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      <div className="controls">
        <select value={category} className="category-sel" onChange={(e) => {
            const val = e.target.value;
            if (val === "add-new") {
              setShowAddInput(true);
            } else {
              setCategory(val);
               setShowAddInput(false); 
            } }}>
    
          {!categoryList.includes(category) && <option value={category}>{category}</option>}
          
          {categoryList.map(item => <option key={item} value={item}>{item}</option>)}
          
          <option value="add-new" style={{ fontWeight: "bold", color: "#2091F9" }}>
            + Add New Category
          </option>
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="date-input" />

        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-sel">
          <option value="" disabled>Priority</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
      </div>

      {showAddInput && (
        <div className="add-category-box">
          <input autoFocus placeholder="Type category..." value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNewCategory()} />
          <button onClick={addNewCategory}>OK</button>
        </div>
      )}

      <div className="list-container">
        {todos.map(t => (
          <div key={t.id} className="todo-item-row" style={{background: '#fff'}}>
            <span className="task-text">{t.text}</span>
            <div className="badges">
              <span className="item-date">{t.date}</span>
              <span className={`item-priority ${t.priority.toLowerCase().replace(" ", "-")}-priority`}>{t.priority}</span>
              <span className="item-category">{t.category}</span>
              <button className="del-icon" onClick={() => setTodos(todos.filter(todo => todo.id !== t.id))}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;