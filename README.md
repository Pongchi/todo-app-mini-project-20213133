# 📝 Todo List App

풀스택 Todo 리스트 앱 — React + Vite / Express / MongoDB Atlas / Vercel 배포

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas |
| 배포 | Vercel |

## 기능

- ✅ Todo 추가
- 📋 Todo 목록 조회
- ☑️ 완료 체크 (토글)
- 🗑️ Todo 삭제

## 프로젝트 구조

```
todo-app/
├── frontend/          # React + Vite
│   └── src/
│       ├── App.jsx
│       └── components/
│           ├── TodoForm.jsx
│           ├── TodoList.jsx
│           └── TodoItem.jsx
├── backend/           # Express API
│   ├── index.js
│   └── models/Todo.js
├── vercel.json
└── README.md
```

## 로컬 실행 방법

### 1. Backend

```bash
cd backend
cp .env.example .env   # .env에 실제 MONGODB_URI 입력
npm install
npm run dev            # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## API 엔드포인트

| Method | URL | 기능 |
|--------|-----|------|
| GET | `/api/todos` | 전체 목록 조회 |
| POST | `/api/todos` | Todo 추가 `{ title }` |
| PUT | `/api/todos/:id` | 완료 토글 |
| DELETE | `/api/todos/:id` | Todo 삭제 |

## 배포

Vercel에서 배포: [배포 URL 추가 예정]

### Vercel 환경변수 설정

| 변수명 | 설명 |
|--------|------|
| `MONGODB_URI` | MongoDB Atlas 연결 문자열 |
