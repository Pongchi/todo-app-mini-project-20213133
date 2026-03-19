function TaskDetail({ todo, onDelete, onToggle }) {
  if (!todo) {
    return (
      <div className="w-72 flex-shrink-0 p-6 flex flex-col items-center justify-center bg-white dark:bg-gray-800">
        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 text-gray-300 dark:text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        </div>
        <p className="text-gray-300 dark:text-gray-500 text-sm text-center leading-relaxed">
          태스크를 선택하면<br />상세 정보가 표시됩니다
        </p>
      </div>
    );
  }

  const createdDate = todo.createdAt
    ? new Date(todo.createdAt).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', year: '2-digit' })
    : '-';

  return (
    <div className="w-72 flex-shrink-0 flex flex-col p-6 bg-white dark:bg-gray-800">
      <p className="text-xs font-semibold text-gray-400 mb-2">Task:</p>

      <h2 className={`text-base font-semibold mb-1 leading-snug ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-white'}`}>
        {todo.title}
      </h2>

      <p className="text-xs text-gray-300 dark:text-gray-500 mb-6">No description</p>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Status</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            todo.completed ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {todo.completed ? 'Completed' : 'In Progress'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Created</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">{createdDate}</span>
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <button
          onClick={() => onDelete(todo._id)}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
        >
          Delete Task
        </button>
        <button
          onClick={() => onToggle(todo._id)}
          className="flex-1 py-2.5 rounded-xl bg-[#f5c842] hover:bg-yellow-400 text-sm text-gray-800 transition font-medium"
        >
          {todo.completed ? 'Undo' : 'Complete'}
        </button>
      </div>
    </div>
  );
}

export default TaskDetail;
