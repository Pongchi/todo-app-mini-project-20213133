import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import TaskDetail from './components/TaskDetail';
import TodoList from './components/TodoList';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [filter, setFilter] = useState('active');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    const res = await axios.get(`${API_URL}/todos`);
    setTodos(res.data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await axios.post(`${API_URL}/todos`, { title: newTitle.trim() });
    setTodos([res.data, ...todos]);
    setNewTitle('');
  };

  const toggleTodo = async (id) => {
    const res = await axios.put(`${API_URL}/todos/${id}`);
    setTodos(todos.map(t => t._id === id ? res.data : t));
    if (selectedTodo?._id === id) setSelectedTodo(res.data);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    setTodos(todos.filter(t => t._id !== id));
    if (selectedTodo?._id === id) setSelectedTodo(null);
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#e8ede5] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl flex overflow-hidden" style={{ height: '620px' }}>

        {/* Sidebar */}
        <Sidebar
          filter={filter}
          setFilter={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={todos.length}
        />

        {/* Main */}
        <div className="flex-1 flex flex-col p-7 bg-[#f7f8f6] border-x border-gray-100 overflow-hidden">
          <div className="flex items-baseline gap-3 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {filter === 'active' ? 'Today' : filter === 'completed' ? 'Completed' : 'All Tasks'}
            </h1>
            <span className="text-2xl font-bold text-gray-300">{filteredTodos.length}</span>
          </div>

          {/* Add Task */}
          <form onSubmit={addTodo} className="flex items-center gap-3 mb-3 group">
            <button
              type="submit"
              className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-indigo-500 transition flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
              </svg>
            </button>
            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Add New Task"
              className="flex-1 bg-transparent text-sm text-gray-500 placeholder-gray-300 outline-none"
            />
          </form>
          <div className="w-full h-px bg-gray-200 mb-3" />

          {/* Task List */}
          <div className="flex-1 overflow-y-auto">
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onSelect={setSelectedTodo}
              selectedId={selectedTodo?._id}
            />
          </div>
        </div>

        {/* Right Detail */}
        <TaskDetail
          todo={selectedTodo}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
        />

      </div>
    </div>
  );
}

export default App;
