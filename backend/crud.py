from sqlalchemy.orm import Session
from models import Todo
from schemas import TodoCreate, TodoUpdate
from typing import Optional


def get_todos(
    db: Session,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Todo)

    if status == "active":
        query = query.filter(Todo.completed == False)
    elif status == "completed":
        query = query.filter(Todo.completed == True)

    if priority:
        query = query.filter(Todo.priority == priority)

    if category:
        query = query.filter(Todo.category == category)

    if search:
        query = query.filter(Todo.title.ilike(f"%{search}%"))

    sort_col = getattr(Todo, sort_by, Todo.created_at)
    if sort_order == "asc":
        query = query.order_by(sort_col.asc())
    else:
        query = query.order_by(sort_col.desc())

    total = query.count()
    todos = query.offset(skip).limit(limit).all()
    return todos, total


def get_todo(db: Session, todo_id: int):
    return db.query(Todo).filter(Todo.id == todo_id).first()


def create_todo(db: Session, todo: TodoCreate):
    db_todo = Todo(**todo.model_dump())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def update_todo(db: Session, todo_id: int, todo: TodoUpdate):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        return None
    update_data = todo.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo


def delete_todo(db: Session, todo_id: int):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        return False
    db.delete(db_todo)
    db.commit()
    return True


def delete_completed_todos(db: Session):
    deleted = db.query(Todo).filter(Todo.completed == True).delete()
    db.commit()
    return deleted


def delete_todos_by_ids(db: Session, ids: list[int]):
    deleted = db.query(Todo).filter(Todo.id.in_(ids)).delete(synchronize_session=False)
    db.commit()
    return deleted


def get_stats(db: Session):
    total = db.query(Todo).count()
    completed = db.query(Todo).filter(Todo.completed == True).count()
    return {"total": total, "completed": completed, "active": total - completed}
