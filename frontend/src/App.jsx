import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6)  return { text: 'Good Night',      emoji: '🌙' };
  if (h < 12) return { text: 'Good Morning',    emoji: '☀️' };
  if (h < 18) return { text: 'Good Afternoon',  emoji: '⛅' };
  return       { text: 'Good Evening',    emoji: '🌆' };
}

const TODAY = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

/* ── 마우스 따라다니는 보라색 조명 ── */
function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20"
      style={{
        background: `radial-gradient(520px circle at ${pos.x}px ${pos.y}px,
          rgba(139,92,246,0.13), transparent 65%)`,
        transition: 'background 0.05s',
      }}
    />
  );
}

/* ── 떠다니는 파티클 ── */
function Particles() {
  const pts = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: (i * 6.1 + 5) % 100,
      y: (i * 13.7 + 10) % 100,
      size: 1.5 + (i % 3),
      delay: (i * 0.6) % 7,
      dur: 14 + (i % 10),
    })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pts.map(p => (
        <div key={p.id} className="absolute rounded-full bg-purple-400/20"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            animation: `float ${p.dur}s ${p.delay}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

/* ── 자석 버튼 (커서에 끌림) ── */
function MagneticButton({ onClick, children, className }) {
  const ref = useRef(null);
  const [off, setOff] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      const dist = Math.hypot(dx, dy);
      setOff(dist < 90 ? { x: dx * 0.28, y: dy * 0.28 } : { x: 0, y: 0 });
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  const isResting = off.x === 0 && off.y === 0;
  return (
    <button ref={ref} onClick={onClick} className={className}
      style={{
        transform: `translate(${off.x}px, ${off.y}px)`,
        transition: isResting
          ? 'transform 0.55s cubic-bezier(0.23,1,0.32,1)'
          : 'transform 0.08s ease',
      }}
    >
      {children}
    </button>
  );
}

/* ── 메인 앱 ── */
export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('today');
  const [newTitle, setNewTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [newId, setNewId] = useState(null);
  const greeting = getGreeting();

  useEffect(() => {
    axios.get(`${API_URL}/todos`).then(r => setTodos(r.data));
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await axios.post(`${API_URL}/todos`, { title: newTitle.trim() });
    setTodos(p => [res.data, ...p]);
    setNewId(res.data._id);
    setTimeout(() => setNewId(null), 600);
    setNewTitle(''); setShowInput(false);
  };

  const toggleTodo = async (id) => {
    const res = await axios.put(`${API_URL}/todos/${id}`);
    setTodos(p => p.map(t => t._id === id ? res.data : t));
  };

  const deleteTodo = async (id) => {
    setDeletingId(id);
    await new Promise(r => setTimeout(r, 290));
    await axios.delete(`${API_URL}/todos/${id}`);
    setTodos(p => p.filter(t => t._id !== id));
    setDeletingId(null);
  };

  const activeCount    = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t =>  t.completed).length;
  const displayed = filter === 'completed'
    ? todos.filter(t =>  t.completed)
    : todos.filter(t => !t.completed);

  return (
    <div className="flex h-screen bg-[#06060f] text-white overflow-hidden">
      <CursorSpotlight />
      <Particles />

      {/* 배경 블롭 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-52 -left-52 w-[480px] h-[480px] rounded-full bg-purple-900/25 blur-3xl animate-blob" />
        <div className="absolute top-1/2 -right-48 w-[380px] h-[380px] rounded-full bg-indigo-900/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-48 left-1/3 w-[440px] h-[440px] rounded-full bg-violet-900/20 blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* ── 사이드바 ── */}
      <aside className="relative z-10 w-56 flex flex-col py-6 px-3 flex-shrink-0 border-r border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">

        {/* 로고 */}
        <div className="px-3 mb-8 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold shadow-lg shadow-purple-500/30">
            T
          </div>
          <span className="text-sm font-semibold text-white/70 tracking-wide">Taskflow</span>
        </div>

        {/* Private */}
        <div className="mb-2">
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-widest px-3 mb-2">Private</p>
          <nav className="space-y-0.5">
            {[
              { id: 'today',     label: 'Home',      count: activeCount,    symbol: '⬡' },
              { id: 'completed', label: 'Completed', count: completedCount, symbol: '✦' },
            ].map(item => (
              <button key={item.id} onClick={() => setFilter(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  filter === item.id
                    ? 'bg-purple-500/[0.15] text-white border border-purple-500/25'
                    : 'text-white/35 hover:bg-white/[0.05] hover:text-white/65'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] opacity-50">{item.symbol}</span>
                  <span>{item.label}</span>
                </div>
                <span className={`text-xs tabular-nums ${filter === item.id ? 'text-purple-400' : 'text-white/20'}`}>
                  {item.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />
          <p className="text-[10px] text-white/15 text-center">Todo App · 2026</p>
        </div>
      </aside>

      {/* ── 메인 ── */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">

        {/* 헤더 */}
        <header className="px-10 pt-8 pb-5 flex items-start justify-between border-b border-white/[0.06]">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {greeting.text} <span>{greeting.emoji}</span>
            </h1>
            <p className="text-sm text-white/30 mt-0.5">{TODAY}</p>
          </div>

          {/* 탭 */}
          <div className="flex gap-0.5 bg-white/[0.05] border border-white/[0.08] rounded-xl p-1 mt-1">
            {[{ id: 'today', label: 'Today' }, { id: 'completed', label: 'Completed' }].map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === tab.id ? 'bg-white/10 text-white' : 'text-white/35 hover:text-white/55'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {/* 할 일 목록 */}
        <div className="flex-1 overflow-y-auto px-10 py-5">
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-44 gap-3">
              <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/15 text-xl">✦</div>
              <p className="text-sm text-white/20">할 일이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayed.map((todo, i) => (
                <div key={todo._id}
                  className={`group flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all duration-300
                    ${deletingId === todo._id
                      ? 'opacity-0 -translate-x-5 scale-95 border-white/5 bg-white/[0.02]'
                      : newId === todo._id
                      ? 'animate-slideIn border-purple-500/30 bg-purple-500/[0.08]'
                      : 'animate-fadeUp border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/10'
                    }`}
                  style={{
                    backdropFilter: 'blur(12px)',
                    animationDelay: newId === todo._id ? '0ms' : `${i * 35}ms`,
                  }}
                >
                  {/* 체크박스 */}
                  <button onClick={() => toggleTodo(todo._id)}
                    tabIndex={-1}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 outline-none focus:outline-none ${
                      todo.completed
                        ? 'bg-purple-500 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                        : 'border-white/20 hover:border-purple-400 hover:shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                    }`}
                  >
                    {todo.completed && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  {/* 제목 */}
                  <span className={`flex-1 text-sm transition-all duration-300 ${
                    todo.completed ? 'line-through text-white/20' : 'text-white/75'
                  }`}>
                    {todo.title}
                  </span>

                  {/* 날짜 */}
                  <span className="text-xs text-white/15 tabular-nums flex-shrink-0">
                    {new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>

                  {/* 삭제 */}
                  <button onClick={() => deleteTodo(todo._id)}
                    className="opacity-0 group-hover:opacity-100 text-white/15 hover:text-red-400 transition-all flex-shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.36 15h5.28a1.5 1.5 0 0 0 1.495-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 플로팅 추가 버튼 */}
        <div className="px-10 py-5">
          {showInput ? (
            <form onSubmit={addTodo}
              className="flex items-center gap-3 rounded-2xl px-5 py-3.5 border border-purple-500/30 bg-purple-500/[0.08] backdrop-blur-md"
            >
              <div className="w-5 h-5 rounded-full border-2 border-white/15 flex-shrink-0" />
              <input
                type="text" value={newTitle} autoFocus
                onChange={e => setNewTitle(e.target.value)}
                placeholder="새 할 일을 입력하세요..."
                className="flex-1 text-sm bg-transparent outline-none text-white/80 placeholder-white/20"
              />
              <button type="submit" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition">추가</button>
              <button type="button" onClick={() => { setShowInput(false); setNewTitle(''); }}
                className="text-xs text-white/20 hover:text-white/50 transition">✕</button>
            </form>
          ) : (
            <MagneticButton onClick={() => setShowInput(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg shadow-purple-500/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
              </svg>
              Create new task
            </MagneticButton>
          )}
        </div>
      </main>
    </div>
  );
}
