# 📝 Todo Manager App

A full-stack Todo application built with FastAPI (Python) backend and React frontend.

---

## 🚀 Features

- ✅ Add, edit, delete todos
- ✅ Mark todos as complete/incomplete
- ✅ Filter by status, priority, category
- ✅ Search todos by title
- ✅ Sort by date, priority, due date
- ✅ Bulk delete & delete all completed
- ✅ Upcoming view (Today, Tomorrow, This Week, Overdue)
- ✅ Dark / Light mode
- ✅ Pagination
- ✅ Toast notifications
- ✅ Mobile responsive

---

## 🛠️ Tech Stack

| Part | Technology |
|------|-----------|
| Backend | FastAPI (Python) |
| Database | SQLite + SQLAlchemy |
| Frontend | React |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
Todo App/
├── backend/
│   ├── main.py          # API routes
│   ├── crud.py          # Database operations
│   ├── models.py        # Database table structure
│   ├── schemas.py       # Data validation
│   ├── database.py      # DB connection
│   ├── .env             # Environment variables
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/  # UI components
    │   ├── hooks/       # Custom React hooks
    │   ├── api/         # API calls
    │   ├── App.js
    │   └── App.css
    └── .env
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
```

Run backend:
```bash
uvicorn main:app --reload --port 8000
```

Backend will start at: `http://localhost:8000`

---

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` file:
```
REACT_APP_API_URL=http://127.0.0.1:8000
```

Run frontend:
```bash
npm start
```

Frontend will start at: `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create new todo |
| GET | `/todos/{id}` | Get single todo |
| PUT | `/todos/{id}` | Update todo |
| PATCH | `/todos/{id}/toggle` | Toggle complete |
| DELETE | `/todos/{id}` | Delete todo |
| DELETE | `/todos` | Delete all completed |
| POST | `/todos/bulk-delete` | Bulk delete |
| GET | `/stats` | Get todo stats |

API Docs: `http://localhost:8000/docs`

---

## 👤 Author

Anil Verma
