function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo._id)}
        className="w-4 h-4 accent-indigo-500 cursor-pointer"
      />
      <span className={`flex-1 text-gray-800 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo._id)}
        className="text-red-400 hover:text-red-600 font-bold text-lg transition"
      >
        ✕
      </button>
    </li>
  );
}

export default TodoItem;
