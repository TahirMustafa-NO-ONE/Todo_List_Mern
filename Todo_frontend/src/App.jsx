import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import tablet from './components/tablet.png';
import './App.css';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showFinished, setShowFinished] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:5555/todos');
    const data = await response.json();
    setTodos(data);
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    const t = todos.find((i) => i.id === id);
    if (t) {
      setTodo(t.todo);
      setEditId(id);
    }
  };

  const handleUpdate = async () => {
    if (todo.trim() && editId) {
      const updatedTodo = { todo };
      const response = await fetch(`http://localhost:5555/todos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo)
      });
      const data = await response.json();
      setTodos(todos.map((item) => item.id === editId ? data : item));
      setTodo("");
      setEditId(null);
    }
  };

  const handleDelete = async (e, id) => {
    setDeletingId(id);
    setTimeout(async () => {
      await fetch(`http://localhost:5555/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(item => item.id !== id));
      setDeletingId(null);
    }, 500);
  };

  const handleAdd = async () => {
    const newTodo = { id: uuidv4(), todo, isCompleted: false };
    const response = await fetch('http://localhost:5555/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });
    const data = await response.json();
    setTodos([...todos, data]);
    setTodo("");
  };

  const handleChange = (e) => setTodo(e.target.value);

  const handleCheckbox = async (e) => {
    const id = e.target.name;
    const index = todos.findIndex(item => item.id === id);
    const newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;

    const updatedTodo = { isCompleted: newTodos[index].isCompleted };
    await fetch(`http://localhost:5555/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo)
    });
    setTodos(newTodos);
  };

  return (
    <>
      <Navbar />
      <div className="app-container">
        <div className="header">
          <img src={tablet} alt="Tablet" className="tablet-img" />
          <h1 className="title">morTodo</h1>
        </div>

        <div className="add-section">
          <h2>{editId ? 'Edit a Todo' : 'Add a Todo'}</h2>
          <div className="input-group">
            <input
              type="text"
              value={todo}
              onChange={handleChange}
              placeholder="Enter your todo"
            />
            <button
              onClick={editId ? handleUpdate : handleAdd}
              disabled={todo.length <= 3}
            >
              {editId ? 'Update' : 'Add'}
            </button>
          </div>
        </div>

        <div className="filter-section">
          <input
            id="show"
            type="checkbox"
            checked={showFinished}
            onChange={toggleFinished}
          />
          <label htmlFor="show">Show Finished</label>
        </div>

        <hr />

        <h2>Your Todos</h2>
        <div className="todo-list">
          {todos.length === 0 && <div className="no-todo">No Todos to display</div>}
          {todos.map(item =>
            (showFinished || !item.isCompleted) && (
              <div
                key={item.id}
                className={`todo-item ${deletingId === item.id ? 'slide-out' : ''}`}
              >
                <div className="todo-text">
                  <input
                    type="checkbox"
                    name={item.id}
                    checked={item.isCompleted}
                    onChange={handleCheckbox}
                  />
                  <span className={item.isCompleted ? "completed" : ""}>
                    {item.todo}
                  </span>
                </div>
                <div className="todo-buttons">
                  <button onClick={(e) => handleEdit(e, item.id)}>
                    <FaEdit />
                  </button>
                  <button onClick={(e) => handleDelete(e, item.id)}>
                    <RiDeleteBin5Line />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default App;
