import React, { useState, useEffect } from "react";
import "./App.css";

const TodoList = () => {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Category");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");

  const [userCategories, setUserCategories] = useState(() =>
    JSON.parse(localStorage.getItem("userCategories")) || ["Work", "Study", "Personal"]
  );

  const [todos, setTodos] = useState(() =>
    JSON.parse(localStorage.getItem("myTodos")) || []
  );

  const [showAddInput, setShowAddInput] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("myTodos", JSON.stringify(todos));
    localStorage.setItem("userCategories", JSON.stringify(userCategories));
  }, [todos, userCategories]);

  const addTask = () => {
    if (!task.trim()) return;

    setTodos([{
      id: Date.now(),
      text: task,
      category: category === "Category" ? "General" : category,
      priority: priority || "Low",
      date: date || "No Date"
    }, ...todos]);

    setTask("");
    setPriority("");
    setDate("");
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "ADD_NEW") {
      setShowAddInput(true);
      setNewCatInput("");
    } else {
      setCategory(value);
      setShowAddInput(false);
    }
  };

  const addNewCategory = () => {
    if (!newCatInput.trim()) return;
    const name = newCatInput.trim();

    if (!userCategories.includes(name)) {
      setUserCategories([...userCategories, name]);
    }
    setCategory(name);
    setShowAddInput(false);
    setNewCatInput("");
  };

  // Date ko dd-mm-yyyy format mein dikhane ke liye
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "No Date") return "No Date";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">Advanced ToDo</h1>

      <div className="input-section">
        <input 
          className="main-input" 
          placeholder="Enter Task..." 
          value={task}
          onChange={(e) => setTask(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && addTask()} 
        />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      {/* Category, Priority, Date - नीचे */}
      <div className="controls">
        <select value={category} onChange={handleCategoryChange} className="category-sel">
          <option value="Category">Category</option>
          {userCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
          <option value="ADD_NEW" style={{ fontWeight: "bold", color: "#2091F9" }}>
            + Add New Category
          </option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-sel">
          <option value="" disabled>Priority</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="date-input" 
        />
      </div>

      {/* Add New Category Input Box */}
      {showAddInput && (
        <div className="add-category-box">
          <input 
            type="text" 
            placeholder="Type category..." 
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNewCategory()}
            autoFocus
          />
          <button onClick={addNewCategory}>Add</button>
          <button onClick={() => setShowAddInput(false)} className="cancel-btn">Cancel</button>
        </div>
      )}

      <div className="list-container">
        {todos.map(t => (
          <div key={t.id} className="todo-item-row">
            <span className="task-text">{t.text}</span>
            <div className="badges">
              <span className="item-date badge-box">{formatDate(t.date)}</span>
              <span className={`item-priority badge-box ${t.priority.toLowerCase()}`}>
                {t.priority}
              </span>
              <span className="item-category badge-box">{t.category}</span>
              <button className="del-icon" onClick={() => removeTodo(t.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;