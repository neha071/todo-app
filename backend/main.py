from fastapi import FastAPI, Depends, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session
from typing import Optional
from dotenv import load_dotenv
import os

from database import engine, get_db, Base
import models
import crud
from schemas import TodoCreate, TodoUpdate, TodoResponse, BulkDeleteRequest
from schemas import UserCreate, LoginRequest, TokenResponse, UserResponse
from auth import hash_password, verify_password, create_access_token, get_current_user

load_dotenv()

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Todo API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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


# ─── AUTH ROUTES ────────────────────────────────────────────────────────────

@app.post("/auth/register", response_model=TokenResponse, status_code=201)
@limiter.limit("5/minute")
def register(request: Request, user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="This email is already registered")

    hashed = hash_password(user_data.password)
    new_user = models.User(name=user_data.name, email=user_data.email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(new_user))


@app.post("/auth/login", response_model=TokenResponse)
@limiter.limit("10/minute")
def login(request: Request, credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))


@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# ─── TODO ROUTES ─────────────────────────────────────────────────────────────

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
def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.create_todo(db, todo, user_id=current_user.id)


@app.get("/todos/{todo_id}")
def get_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    todo = crud.get_todo(db, todo_id, user_id=current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/todos/{todo_id}")
def update_todo(
    todo_id: int,
    todo: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    updated = crud.update_todo(db, todo_id, todo, user_id=current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated


@app.patch("/todos/{todo_id}/toggle")
def toggle_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    todo = crud.get_todo(db, todo_id, user_id=current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    toggle_update = TodoUpdate(completed=not todo.completed)
    return crud.update_todo(db, todo_id, toggle_update, user_id=current_user.id)


@app.delete("/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    success = crud.delete_todo(db, todo_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}


@app.delete("/todos")
def delete_completed(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    count = crud.delete_completed_todos(db, user_id=current_user.id)
    return {"message": f"{count} completed todos deleted"}


@app.post("/todos/bulk-delete")
def bulk_delete(
    request: BulkDeleteRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not request.ids:
        raise HTTPException(status_code=422, detail="No IDs provided")
    count = crud.delete_todos_by_ids(db, request.ids, user_id=current_user.id)
    return {"message": f"{count} todos deleted"}


@app.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return crud.get_stats(db, user_id=current_user.id)


# ─── SUBTASK ROUTES ──────────────────────────────────────────────────────────

@app.get("/todos/{todo_id}/subtasks")
def get_subtasks(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    todo = crud.get_todo(db, todo_id, user_id=current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return crud.get_subtasks(db, todo_id, user_id=current_user.id)


@app.post("/todos/{todo_id}/subtasks", status_code=201)
def create_subtask(
    todo_id: int,
    body: dict,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    todo = crud.get_todo(db, todo_id, user_id=current_user.id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    title = body.get("title", "").strip()
    if not title:
        raise HTTPException(status_code=422, detail="Title is required")
    return crud.create_subtask(db, todo_id, title, user_id=current_user.id)


@app.delete("/todos/{todo_id}/subtasks/{subtask_id}")
def delete_subtask(
    todo_id: int,
    subtask_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    success = crud.delete_todo(db, subtask_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Subtask not found")
    return {"message": "Subtask deleted"}
