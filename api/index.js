require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Todo = mongoose.model('Todo', todoSchema);

app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ message: '제목을 입력해주세요.' });
  }
  const todo = new Todo({ title: title.trim() });
  await todo.save();
  res.status(201).json(todo);
});

app.put('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: '삭제 완료' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
}
