import TodoItem from './TodoItem';

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">할 일이 없습니다. 추가해보세요!</p>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem key={todo._id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default TodoList;
