import React, { useState, useEffect } from "react";
import "./App.css";

const TodoList = () => {
  
  const [todoInput, setTodoInput] = useState({
    task: "",
    category: "Category",
    priority: "",
    date: ""
  });

  const [filters, setFilters] = useState({
    category: "All Category",
    priority: "All Priority"
  });

  const [showAddInput, setShowAddInput] = useState(false);
  const [newCatInput, setNewCatInput] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodoInput(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "ADD_NEW") {
      setShowAddInput(true);
      setTodoInput(prev => ({ ...prev, category: "Category" }));
    } else {
      setShowAddInput(false);
      setTodoInput(prev => ({ ...prev, category: value }));
    }
  };

  const handleAddNewCategory = () => {
    if (newCatInput.trim() !== "") {
      const formatted = newCatInput.trim();
      if (!customCategories.includes(formatted)) {
        setCustomCategories([...customCategories, formatted]);
      }
      setTodoInput(prev => ({ ...prev, category: formatted }));
      setShowAddInput(false);
      setNewCatInput("");
    }
  };

  const addTask = () => {
    if (!todoInput.task.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: todoInput.task,
      category: todoInput.category === "Category" ? "General" : todoInput.category,
      priority: todoInput.priority || "Low",
      date: todoInput.date || "No Date"
    };

    setTodos([newTodo, ...todos]);
    
    setTodoInput({ task: "", category: "Category", priority: "", date: "" });
    setShowAddInput(false);
  };

  const filterCategoriesList = ["All Category", ...new Set([...customCategories, ...todos.map(t => t.category)])];

  const filteredTodos = todos.filter(t => {
    const categoryMatch = filters.category === "All Category" || t.category === filters.category;
    const priorityMatch = filters.priority === "All Priority" || 
                         t.priority + " Priority" === filters.priority || 
                         t.priority === filters.priority;
    return categoryMatch && priorityMatch;
  });

  return (
    <div className="todo-container">
      <h1 className="todo-title">Advanced ToDo</h1>
      
      <div className="input-section">
        <input 
          className="main-input" 
          name="task"
          placeholder="Enter Task..." 
          value={todoInput.task} 
          onChange={handleInputChange} 
          onKeyDown={(e) => e.key === "Enter" && addTask()} 
        />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>

      <div className="controls">
        <select value={todoInput.category} onChange={handleCategoryChange} className="category-sel">
          <option value="Category">Category</option>
          {customCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          <option value="ADD_NEW" className="add-new-opt">+ Add New Category</option>
        </select>

        <select 
          name="priority" 
          value={todoInput.priority} 
          onChange={handleInputChange} 
          className="priority-sel"
        >
          <option value="" disabled>Priority</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        <input 
          type="date" 
          name="date" 
          value={todoInput.date} 
          onChange={handleInputChange} 
          className="date-input" 
        />
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
        <select 
          className="small-filter" 
          value={filters.category} 
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          {filterCategoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>

        <select 
          className="small-filter" 
          value={filters.priority} 
          onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
        >
          <option value="All Priority">All Priority</option>
          <option value="Low Priority">Low Priority</option>
          <option value="Medium Priority">Medium Priority</option>
          <option value="High Priority">High Priority</option>
        </select>
      </div>

      {/* List Display */}
      <div className="list-container">
        {filteredTodos.map(t => (
          <div key={t.id} className="todo-item-row">
            <span className="task-text">{t.text}</span>
            <div className="badges">
              <span className="item-date badge-box">{t.date}</span>
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