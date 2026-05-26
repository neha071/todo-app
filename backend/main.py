from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
from dotenv import load_dotenv
import os

from database import engine, get_db, Base
import models
import crud
from schemas import TodoCreate, TodoUpdate, TodoResponse, BulkDeleteRequest

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
):
    skip = (page - 1) * limit
    todos, total = crud.get_todos(
        db,
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
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    return crud.create_todo(db, todo)


@app.get("/todos/{todo_id}")
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    updated = crud.update_todo(db, todo_id, todo)
    if not updated:
        raise HTTPException(status_code=404, detail="Todo not found")
    return updated


@app.patch("/todos/{todo_id}/toggle")
def toggle_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = crud.get_todo(db, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    toggle_update = TodoUpdate(completed=not todo.completed)
    return crud.update_todo(db, todo_id, toggle_update)


@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    success = crud.delete_todo(db, todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="Todo not found")
    return {"message": "Todo deleted successfully"}


@app.delete("/todos")
def delete_completed(db: Session = Depends(get_db)):
    count = crud.delete_completed_todos(db)
    return {"message": f"{count} completed todos deleted"}


@app.post("/todos/bulk-delete")
def bulk_delete(request: BulkDeleteRequest, db: Session = Depends(get_db)):
    if not request.ids:
        raise HTTPException(status_code=422, detail="No IDs provided")
    count = crud.delete_todos_by_ids(db, request.ids)
    return {"message": f"{count} todos deleted"}


@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    return crud.get_stats(db)
