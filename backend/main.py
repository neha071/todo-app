from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from dotenv import load_dotenv
import os

from database import engine, get_db, Base
import models
import crud
from schemas import TodoCreate, TodoUpdate, TodoResponse, BulkDeleteRequest, SubtaskCreate, SubtaskUpdate, UserRegister, UserLogin, TokenResponse, UserResponse
from auth import get_current_user, create_access_token

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API", version="1.0.0")

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Todo API is running"}


# Auth Routes
@app.post("/auth/register", response_model=TokenResponse, status_code=201)
def register(user: UserRegister, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = crud.create_user(db, user)
    token = create_access_token(db_user.id)
    return {"access_token": token, "token_type": "bearer", "user": db_user}


@app.post("/auth/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(db_user.id)
    return {"access_token": token, "token_type": "bearer", "user": db_user}


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# Todo Routes (all protected)
@app.get("/todos")
def get_todos(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    skip = (page - 1) * limit
    todos, total = crud.get_todos(
        db,
        user_id=current_user.id,
        status=status if status != "all" else None,
        priority=priority,
        category=category,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
        skip=skip,
        limit=limit,
    )
    return {
        "todos": [TodoResponse.model_validate(t) for t in todos],
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


@app.post("/todos", status_code=201)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_todo(db, todo, current_user.id)


@app.get("/todos/{todo_id}")
def get_todo(todo_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    todo = crud.get_todo(db, todo_id)
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    existing = crud.get_todo(db, todo_id)
    if not existing or existing.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    updated = crud.update_todo(db, todo_id, todo)
    return updated


@app.patch("/todos/{todo_id}/toggle")
def toggle_todo(todo_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    todo = crud.get_todo(db, todo_id)
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    toggle_update = TodoUpdate(completed=not todo.completed)
    return crud.update_todo(db, todo_id, toggle_update)


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    todo = crud.get_todo(db, todo_id)
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    crud.delete_todo(db, todo_id)
    return {"message": "Todo deleted successfully"}


@app.delete("/todos")
def delete_completed(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    count = crud.delete_completed_todos(db, current_user.id)
    return {"message": f"{count} completed todos deleted"}


@app.post("/todos/bulk-delete")
def bulk_delete(request: BulkDeleteRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not request.ids:
        raise HTTPException(status_code=422, detail="No IDs provided")
    count = crud.delete_todos_by_ids(db, request.ids)
    return {"message": f"{count} todos deleted"}


@app.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_stats(db, current_user.id)


@app.get("/todos/{todo_id}/subtasks")
def get_subtasks(todo_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    todo = crud.get_todo(db, todo_id)
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return crud.get_subtasks(db, todo_id)


@app.post("/todos/{todo_id}/subtasks", status_code=201)
def create_subtask(todo_id: int, subtask: SubtaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    todo = crud.get_todo(db, todo_id)
    if not todo or todo.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Todo not found")
    return crud.create_subtask(db, todo_id, subtask)


@app.patch("/subtasks/{subtask_id}")
def update_subtask(subtask_id: int, subtask: SubtaskUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    updated = crud.update_subtask(db, subtask_id, subtask)
    if not updated:
        raise HTTPException(status_code=404, detail="Subtask not found")
    return updated


@app.delete("/subtasks/{subtask_id}")
def delete_subtask(subtask_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    success = crud.delete_subtask(db, subtask_id)
    if not success:
        raise HTTPException(status_code=404, detail="Subtask not found")
    return {"message": "Subtask deleted successfully"}
