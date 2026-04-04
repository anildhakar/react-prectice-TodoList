import React, { useState, useEffect } from "react";
import "./App.css";

const TodoList = () => {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Category");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState("");
  
  const [showAddInput, setShowAddInput] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");

  const [filterCategory, setFilterCategory] = useState("All Category");
  const [filterPriority, setFilterPriority] = useState("All Priority");

  const [customCategories, setCustomCategories] = useState(() => 
    JSON.parse(localStorage.getItem("customCats")) || ["Work", "Study", "Personal"]
  );

  const [todos, setTodos] = useState(() => 
    JSON.parse(localStorage.getItem("myTodos")) || []
  );

  useEffect(() => {
    localStorage.setItem("myTodos", JSON.stringify(todos));
    localStorage.setItem("customCats", JSON.stringify(customCategories));
  }, [todos, customCategories]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "ADD_NEW") {
      setShowAddInput(true);
      setCategory("Category");
    } else {
      setShowAddInput(false);
      setCategory(value);
    }
  };

  const handleAddNewCategory = () => {
    if (newCatInput.trim() !== "") {
      const formatted = newCatInput.trim();
      if (!customCategories.includes(formatted)) {
        setCustomCategories([...customCategories, formatted]);
      }
      setCategory(formatted);
      setShowAddInput(false);
      setNewCatInput("");
    }
  };

  const addTask = () => {
    if (!task.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: task,
      category: category === "Category" ? "General" : category,
      priority: priority || "Low",
      date: date || "No Date"
    };
    setTodos([newTodo, ...todos]);
    setTask(""); setPriority(""); setCategory("Category"); setDate("");
    setShowAddInput(false);
  };

  const filterCategories = ["All Category", ...new Set([...customCategories, ...todos.map(t => t.category)])];

  const filteredTodos = todos.filter(t => {
    const categoryMatch = filterCategory === "All Category" || t.category === filterCategory;
    const priorityMatch = filterPriority === "All Priority" || t.priority + " Priority" === filterPriority || t.priority === filterPriority;
    return categoryMatch && priorityMatch;
  });

  return (
    <div className="todo-container">
      <h1 className="todo-title">Advanced ToDo</h1>
      
      <div className="input-section">
        <input className="main-input" placeholder="Enter Task..." value={task} 
          onChange={(e) => setTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      <div className="controls">
        <select value={category} onChange={handleCategoryChange} className="category-sel">
          <option value="Category">Category</option>
          {customCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          <option value="ADD_NEW" className="add-new-opt">+ Add New Category</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-sel">
          <option value="" disabled>Priority</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="date-input" />
      </div>

      {showAddInput && (
        <div className="add-category-box">
          <input 
            type="text" 
            placeholder="Type category..." 
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNewCategory()}
            autoFocus
          />
          <button onClick={handleAddNewCategory}>Add</button>
        </div>
      )}

      <div className="filter-row">
        <select className="small-filter" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          {filterCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select className="small-filter" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="All Priority">All Priority</option>
          <option value="Low Priority">Low Priority</option>
          <option value="Medium Priority">Medium Priority</option>
          <option value="High Priority">High Priority</option>
        </select>
      </div>

      <div className="list-container">
        {filteredTodos.map(t => (
          <div key={t.id} className="todo-item-row">
            <span className="task-text">{t.text}</span>
            <div className="badges">
              <span className="item-date badge-box">{t.date}</span>
              {/* Class name fixed for priority colors */}
              <span className={`item-priority badge-box ${t.priority.toLowerCase().split(" ")[0]}`}>
                {t.priority}
              </span>
              <span className="item-category badge-box">{t.category}</span>
              <button className="del-icon" onClick={() => setTodos(todos.filter(todo => todo.id !== t.id))}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;