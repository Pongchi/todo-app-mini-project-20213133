function TodoItem({ todo, onToggle, onDelete, onSelect, isSelected, selectMode, isChecked, onToggleSelect }) {

  /* ── Select mode: square checkbox ── */
  if (selectMode) {
    return (
      <li
        onClick={() => onToggleSelect(todo._id)}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition ${
          isChecked
            ? 'bg-indigo-50 dark:bg-indigo-900/30'
            : 'hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm'
        }`}
      >
        <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition ${
          isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-500'
        }`}>
          {isChecked && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3 h-3">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
          {todo.title}
        </span>
      </li>
    );
  }

  /* ── Normal mode ── */
  return (
    <li
      onClick={() => onSelect(todo)}
      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer group transition ${
        isSelected
          ? 'bg-white dark:bg-gray-600 shadow-sm'
          : 'hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm'
      }`}
    >
      <button
        onClick={e => { e.stopPropagation(); onToggle(todo._id); }}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
          todo.completed ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        {todo.completed && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-3 h-3">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
        {todo.title}
      </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none" viewBox="0 0 24 24"
        strokeWidth={1.5} stroke="currentColor"
        className="w-4 h-4 text-gray-200 group-hover:text-gray-400 transition flex-shrink-0"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
      </svg>
    </li>
  );
}

export default TodoItem;
