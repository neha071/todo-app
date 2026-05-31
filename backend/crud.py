from sqlalchemy.orm import Session
from models import Todo, Subtask, User
from schemas import TodoCreate, TodoUpdate, SubtaskCreate, SubtaskUpdate, UserRegister
from auth import hash_password, verify_password
from typing import Optional


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserRegister):
    db_user = User(name=user.name, email=user.email, password_hash=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


def get_todos(
    db: Session,
    user_id: int,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(Todo).filter(Todo.user_id == user_id)

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


def create_todo(db: Session, todo: TodoCreate, user_id: int):
    db_todo = Todo(**todo.model_dump(), user_id=user_id)
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


def delete_completed_todos(db: Session, user_id: int):
    deleted = db.query(Todo).filter(Todo.completed == True, Todo.user_id == user_id).delete()
    db.commit()
    return deleted


def delete_todos_by_ids(db: Session, ids: list[int]):
    deleted = db.query(Todo).filter(Todo.id.in_(ids)).delete(synchronize_session=False)
    db.commit()
    return deleted


def get_stats(db: Session, user_id: int):
    total = db.query(Todo).filter(Todo.user_id == user_id).count()
    completed = db.query(Todo).filter(Todo.user_id == user_id, Todo.completed == True).count()
    return {"total": total, "completed": completed, "active": total - completed}


def get_subtasks(db: Session, todo_id: int):
    return db.query(Subtask).filter(Subtask.todo_id == todo_id).all()


def create_subtask(db: Session, todo_id: int, subtask: SubtaskCreate):
    db_subtask = Subtask(todo_id=todo_id, title=subtask.title)
    db.add(db_subtask)
    db.commit()
    db.refresh(db_subtask)
    return db_subtask


def update_subtask(db: Session, subtask_id: int, subtask: SubtaskUpdate):
    db_subtask = db.query(Subtask).filter(Subtask.id == subtask_id).first()
    if not db_subtask:
        return None
    update_data = subtask.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_subtask, field, value)
    db.commit()
    db.refresh(db_subtask)
    return db_subtask


def delete_subtask(db: Session, subtask_id: int):
    db_subtask = db.query(Subtask).filter(Subtask.id == subtask_id).first()
    if not db_subtask:
        return False
    db.delete(db_subtask)
    db.commit()
    return True
