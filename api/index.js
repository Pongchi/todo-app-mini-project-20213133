require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

const JWT_SECRET = process.env.JWT_SECRET || 'todo-secret-key-2026';

// ── Models ────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', userSchema);

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});
const Todo = mongoose.model('Todo', todoSchema);

// ── Auth Middleware ───────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '인증이 필요합니다.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

// ── Auth Routes ───────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username?.trim() || !password)
      return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    if (password.length < 4)
      return res.status(400).json({ message: '비밀번호는 4자 이상이어야 합니다.' });
    const exists = await User.findOne({ username: username.trim() });
    if (exists) return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username: username.trim(), password: hashed });
    await user.save();
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username?.trim() });
    if (!user) return res.status(400).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: '아이디 또는 비밀번호가 틀렸습니다.' });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ── Todo Routes (protected) ───────────────────────────
app.get('/api/todos', auth, async (req, res) => {
  const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
  res.json(todos);
});

app.post('/api/todos', auth, async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim())
    return res.status(400).json({ message: '제목을 입력해주세요.' });
  const todo = new Todo({ title: title.trim(), userId: req.userId });
  await todo.save();
  res.status(201).json(todo);
});

app.put('/api/todos/:id', auth, async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
  if (!todo) return res.status(404).json({ message: 'Todo를 찾을 수 없습니다.' });
  todo.completed = !todo.completed;
  await todo.save();
  res.json(todo);
});

app.delete('/api/todos/:id', auth, async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: '삭제 완료' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
}
