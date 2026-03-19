import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete, onSelect, selectedId, selectMode, selectedIds, onToggleSelect }) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300 dark:text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <p className="text-sm text-gray-300 dark:text-gray-500">할 일이 없습니다</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {todos.map(todo => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onSelect={onSelect}
          isSelected={selectedId === todo._id}
          selectMode={selectMode}
          isChecked={selectedIds?.has(todo._id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </ul>
  );
}

export default TodoList;
