# 📝 Todo Manager

A full-stack, production-ready Todo application built with **React** and **FastAPI**. Featuring user authentication, subtasks, progress tracking, and more.

---

## ✨ Features

### Core
- ✅ Add, edit, and delete todos
- ✅ Mark todos complete / incomplete
- ✅ Priority levels — Low, Medium, High
- ✅ Categories — Work, Personal, Shopping, Health, Finance
- ✅ Due dates with overdue detection
- ✅ Search todos by title
- ✅ Filter by status, priority, category
- ✅ Sort by date, priority, due date
- ✅ Pagination

### Advanced
- 🔐 User Authentication (JWT) — Register & Login
- 📋 Subtasks — break todos into smaller steps
- 📊 Progress Dashboard — Total, Active, Completed, Due Today, Overdue
- ⚠️ Due Date Alerts — visual banners for today & overdue todos
- 📥 Export to CSV — download your todo list
- 🗑️ Bulk delete — select & delete multiple todos
- 🌙 Dark / Light mode
- 🔔 Toast notifications on every action
- 📅 Upcoming view — Today, Tomorrow, This Week

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, JavaScript |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite |
| Auth | JWT (python-jose) + bcrypt |
| UI | Custom CSS with animations |

---

## 📁 Project Structure

```
Todo App/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── crud.py          # Database operations
│   ├── models.py        # SQLAlchemy models (User, Todo, Subtask)
│   ├── schemas.py       # Pydantic schemas
│   ├── auth.py          # JWT authentication
│   ├── database.py      # DB connection
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.js
        ├── exportCSV.js      # CSV export utility
        ├── api/              # API calls (todos, auth)
        ├── components/       # UI components
        │   ├── AuthForm.js
        │   ├── Dashboard.js
        │   ├── TodoItem.js
        │   ├── Subtasks.js
        │   ├── Filters.js
        │   ├── BulkActions.js
        │   ├── UpcomingView.js
        │   └── DeleteConfirmModal.js
        └── hooks/            # Custom React hooks
            ├── useAuth.js
            └── useTodos.js
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: `http://localhost:8000`
API Docs (Swagger): `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

### Environment Variables

Create a `.env` file in the `backend/` folder:

```
DATABASE_URL=sqlite:///./todos.db
ALLOWED_ORIGINS=http://localhost:3000
SECRET_KEY=your-super-secret-key-here
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |

### Todos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos (filters & pagination) |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/{id}` | Update a todo |
| PATCH | `/todos/{id}/toggle` | Toggle complete status |
| DELETE | `/todos/{id}` | Delete a todo |
| DELETE | `/todos` | Delete all completed todos |
| POST | `/todos/bulk-delete` | Bulk delete by IDs |
| GET | `/stats` | Get todo statistics |

### Subtasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos/{id}/subtasks` | Get subtasks |
| POST | `/todos/{id}/subtasks` | Add subtask |
| PATCH | `/subtasks/{id}` | Update subtask |
| DELETE | `/subtasks/{id}` | Delete subtask |

---

## 📸 Screenshots

> Login Page → Dashboard → Todo List with Subtasks

---

## 👤 Author

Made with ❤️ by Anil Verma
