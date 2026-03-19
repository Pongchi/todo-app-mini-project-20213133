import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(`${API_URL}/todos`);
    setTodos(res.data);
  };

  const addTodo = async (title) => {
    const res = await axios.post(`${API_URL}/todos`, { title });
    setTodos([res.data, ...todos]);
  };

  const toggleTodo = async (id) => {
    const res = await axios.put(`${API_URL}/todos/${id}`);
    setTodos(todos.map(t => t._id === id ? res.data : t));
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          📝 Todo List
        </h1>
        <TodoForm onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </div>
    </div>
  );
}

export default App;
