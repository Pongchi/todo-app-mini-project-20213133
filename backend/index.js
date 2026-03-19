require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// GET - 전체 목록 조회 (최신순)
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// POST - 새 Todo 추가
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ message: '제목을 입력해주세요.' });
  }
  const todo = new Todo({ title: title.trim() });
  await todo.save();
  res.status(201).json(todo);
});

// PUT - 완료 토글
app.put('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

// DELETE - Todo 삭제
app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: '삭제 완료' });
});

// Vercel serverless 지원
module.exports = app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
