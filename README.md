# 📝 Todo Manager App

A full-stack Todo application built with FastAPI (Python) backend and React frontend.

---

## 🚀 Features

- ✅ JWT Authentication (Register / Login / Logout)
- ✅ Add, edit, delete todos
- ✅ Subtasks support
- ✅ Mark todos as complete/incomplete
- ✅ Filter by status, priority, category
- ✅ Search todos by title
- ✅ Sort by date, priority
- ✅ Bulk delete & delete all completed
- ✅ Upcoming view (Today, Tomorrow, This Week, Overdue)
- ✅ Dark / Light mode
- ✅ Pagination
- ✅ Toast notifications
- ✅ Export to Excel (.xlsx)
- ✅ Keyboard Shortcuts (N = New Todo, D = Dark Mode, Esc = Close)
- ✅ Rate Limiting (brute force protection)
- ✅ Docker support
- ✅ Automated tests (pytest + React Testing Library)

---

## 🛠️ Tech Stack

| Part | Technology |
|------|-----------|
| Backend | FastAPI (Python) |
| Database | SQLite + SQLAlchemy |
| Auth | JWT (python-jose) + bcrypt |
| Frontend | React |
| HTTP Client | Axios |
| Testing | pytest + React Testing Library |
| Deployment | Docker + Vercel + Render |

---

## 📁 Project Structure

```
Todo App/
├── backend/
│   ├── main.py          # API routes
│   ├── crud.py          # Database operations
│   ├── models.py        # Database table structure
│   ├── schemas.py       # Data validation
│   ├── auth.py          # JWT authentication
│   ├── database.py      # DB connection
│   ├── Dockerfile
│   ├── requirements.txt
│   └── tests/
│       ├── conftest.py
│       └── test_todos.py
│
├── frontend/
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── api/         # API calls
│   │   ├── App.js
│   │   └── App.css
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## ⚙️ Installation & Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` file:
```
DATABASE_URL=sqlite:///./todos.db
ALLOWED_ORIGINS=http://localhost:3000
SECRET_KEY=your-secret-key-here
```

Run backend:
```bash
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

---

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

### Docker (Run everything with one command)

```bash
docker-compose up
```

---

## 🧪 Running Tests

```bash
cd backend
pytest tests/ -v
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create new todo |
| PUT | `/todos/{id}` | Update todo |
| PATCH | `/todos/{id}/toggle` | Toggle complete |
| DELETE | `/todos/{id}` | Delete todo |
| DELETE | `/todos` | Delete all completed |
| POST | `/todos/bulk-delete` | Bulk delete |
| GET | `/todos/{id}/subtasks` | Get subtasks |
| POST | `/todos/{id}/subtasks` | Add subtask |
| GET | `/stats` | Get todo stats |

API Docs: `http://localhost:8000/docs`

---

## 👤 Author

Neha Verma
