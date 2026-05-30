# Todo Manager

A full-stack Todo application built with React (frontend) and FastAPI (backend).

## Features

- Add, edit, and delete todos
- Mark todos as complete / incomplete (toggle)
- Filter by status, priority, and category
- Search todos
- Bulk delete selected or completed todos
- Upcoming todos view
- Pagination
- Dark / Light mode
- Keyboard shortcuts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, JavaScript |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | SQLite |

## Project Structure

```
Todo App/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── crud.py          # Database operations
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── database.py      # DB connection
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.js
        ├── api/         # API calls
        ├── components/  # UI components
        └── hooks/       # Custom React hooks
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos (with filters & pagination) |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/{id}` | Update a todo |
| PATCH | `/todos/{id}/toggle` | Toggle complete status |
| DELETE | `/todos/{id}` | Delete a todo |
| DELETE | `/todos` | Delete all completed todos |
| POST | `/todos/bulk-delete` | Bulk delete by IDs |
| GET | `/stats` | Get todo statistics |
