import { useState } from 'react';

function Sidebar({
  filter, setFilter,
  activeCount, completedCount, totalCount,
  searchQuery, setSearchQuery,
  collapsed, setCollapsed,
  clearCompleted,
}) {
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    {
      id: 'active', label: 'Today', count: activeCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      ),
    },
    {
      id: 'all', label: 'Upcoming', count: totalCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
        </svg>
      ),
    },
    {
      id: 'completed', label: 'Completed', count: completedCount,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      ),
    },
  ];

  const handleSignOut = () => {
    if (window.confirm('앱을 초기화하시겠습니까?')) {
      window.location.reload();
    }
  };

  const handleClearCompleted = () => {
    if (completedCount === 0) return;
    if (window.confirm(`완료된 항목 ${completedCount}개를 모두 삭제하시겠습니까?`)) {
      clearCompleted();
      setShowSettings(false);
    }
  };

  /* ── Collapsed (icon-only) view ── */
  if (collapsed) {
    return (
      <div className="w-14 flex flex-col items-center py-5 gap-4 bg-white flex-shrink-0 transition-all">
        <button
          onClick={() => setCollapsed(false)}
          className="text-gray-400 hover:text-gray-700 transition"
          title="메뉴 펼치기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="flex-1 flex flex-col items-center gap-2 mt-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              title={item.label}
              className={`p-2 rounded-xl transition ${filter === item.id ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              {item.icon}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => { setCollapsed(false); setShowSettings(true); }}
            title="Settings"
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  /* ── Expanded view ── */
  return (
    <div className="w-60 flex flex-col p-5 bg-white flex-shrink-0 relative">

      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 bg-white rounded-l-3xl z-10 flex flex-col p-5">
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold text-gray-800">Settings</span>
            <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-gray-50">
              <p className="text-xs text-gray-400 mb-1">완료된 항목</p>
              <p className="text-sm font-semibold text-gray-700">{completedCount}개</p>
            </div>
            <button
              onClick={handleClearCompleted}
              disabled={completedCount === 0}
              className={`w-full py-2.5 rounded-xl text-sm font-medium transition ${
                completedCount > 0
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              완료 항목 모두 삭제
            </button>
          </div>

          <div className="mt-auto text-xs text-gray-300 text-center">
            Todo App · 2026
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-bold text-gray-800 text-base">Menu</span>
        <button
          onClick={() => setCollapsed(true)}
          className="text-gray-400 hover:text-gray-600 transition"
          title="메뉴 접기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-gray-300 hover:text-gray-500 transition flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Tasks */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Tasks</p>
        <div className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                filter === item.id
                  ? 'bg-gray-100 font-semibold text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={filter === item.id ? 'text-gray-700' : 'text-gray-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className={`text-xs ${filter === item.id ? 'text-gray-600' : 'text-gray-300'}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto space-y-1">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          Settings
        </button>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
