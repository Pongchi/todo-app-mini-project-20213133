import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import TaskDetail from './components/TaskDetail';
import TodoList from './components/TodoList';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <LoginPage />;
  return <TodoApp />;
}

function TodoApp() {
  const { logout, username } = useAuth();
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [filter, setFilter] = useState('active');
  const [newTitle, setNewTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
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
    setTodos(prev => prev.filter(t => t._id !== id));
    if (selectedTodo?._id === id) setSelectedTodo(null);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const clearCompleted = async () => {
    const completed = todos.filter(t => t.completed);
    await Promise.all(completed.map(t => axios.delete(`${API_URL}/todos/${t._id}`)));
    setTodos(prev => prev.filter(t => !t.completed));
    if (selectedTodo?.completed) setSelectedTodo(null);
  };

  // ── Bulk actions ──────────────────────────────────
  const bulkDelete = async () => {
    await Promise.all([...selectedIds].map(id => axios.delete(`${API_URL}/todos/${id}`)));
    setTodos(prev => prev.filter(t => !selectedIds.has(t._id)));
    if (selectedIds.has(selectedTodo?._id)) setSelectedTodo(null);
    exitSelectMode();
  };

  const bulkComplete = async () => {
    const toComplete = todos.filter(t => selectedIds.has(t._id) && !t.completed);
    const results = await Promise.all(toComplete.map(t => axios.put(`${API_URL}/todos/${t._id}`)));
    const updated = {};
    results.forEach(r => { updated[r.data._id] = r.data; });
    setTodos(prev => prev.map(t => updated[t._id] ?? t));
    if (updated[selectedTodo?._id]) setSelectedTodo(updated[selectedTodo._id]);
    exitSelectMode();
  };

  const toggleSelectId = (id) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const filteredTodos = todos
    .filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
    })
    .filter(t =>
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;
  const filterLabel = filter === 'active' ? 'Today' : filter === 'completed' ? 'Completed' : 'All Tasks';

  return (
    <div className="min-h-screen bg-[#e8ede5] dark:bg-gray-900 flex items-center justify-center p-6">
      <div
        className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex overflow-hidden"
        style={{ height: '620px' }}
      >
        {/* Sidebar */}
        <Sidebar
          filter={filter}
          setFilter={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={todos.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          clearCompleted={clearCompleted}
          username={username}
          onLogout={logout}
        />

        {/* Main */}
        <div className="flex-1 flex flex-col p-7 bg-[#f7f8f6] dark:bg-gray-700 border-x border-gray-100 dark:border-gray-600 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{filterLabel}</h1>
              <span className="text-2xl font-bold text-gray-300 dark:text-gray-500">{filteredTodos.length}</span>
            </div>
            <button
              onClick={() => selectMode ? exitSelectMode() : setSelectMode(true)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                selectMode
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400'
              }`}
            >
              {selectMode ? '취소' : '선택'}
            </button>
          </div>

          {/* Add Task (hidden in select mode) */}
          {!selectMode && (
            <>
              <form onSubmit={addTodo} className="flex items-center gap-3 mb-3">
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
                  className="flex-1 bg-transparent text-sm text-gray-500 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-500 outline-none"
                />
              </form>
              <div className="w-full h-px bg-gray-200 dark:bg-gray-600 mb-3" />
            </>
          )}

          {/* Task List */}
          <div className="flex-1 overflow-y-auto">
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onSelect={setSelectedTodo}
              selectedId={selectedTodo?._id}
              selectMode={selectMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelectId}
            />
          </div>

          {/* Bulk Action Bar */}
          {selectMode && selectedIds.size > 0 && (
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
              <span className="text-xs text-gray-400 flex-1">{selectedIds.size}개 선택됨</span>
              <button
                onClick={bulkComplete}
                className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition"
              >
                완료로 변경
              </button>
              <button
                onClick={bulkDelete}
                className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 text-sm font-medium hover:bg-red-100 transition"
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* Right Panel */}
        {selectMode ? (
          <div className="w-72 flex-shrink-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
              항목을 선택하면<br />일괄 작업이 가능합니다
            </p>
          </div>
        ) : (
          <TaskDetail todo={selectedTodo} onDelete={deleteTodo} onToggle={toggleTodo} />
        )}
      </div>
    </div>
  );
}

export default App;
