from pydantic import BaseModel, field_validator, EmailStr
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: Optional[datetime]

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: str = "medium"
    category: str = "personal"

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Title cannot be empty")
        if len(v.strip()) < 2:
            raise ValueError("Title must be at least 2 characters")
        return v.strip()

    @field_validator("priority")
    @classmethod
    def priority_must_be_valid(cls, v):
        if v not in ["low", "medium", "high"]:
            raise ValueError("Priority must be low, medium, or high")
        return v

    @field_validator("category")
    @classmethod
    def category_must_be_valid(cls, v):
        valid = ["work", "personal", "shopping", "health", "finance", "other"]
        if v not in valid:
            raise ValueError(f"Category must be one of {valid}")
        return v


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    completed: Optional[bool] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v):
        if v is not None:
            if not v.strip():
                raise ValueError("Title cannot be empty")
            return v.strip()
        return v

    @field_validator("priority")
    @classmethod
    def priority_must_be_valid(cls, v):
        if v is not None and v not in ["low", "medium", "high"]:
            raise ValueError("Priority must be low, medium, or high")
        return v


class SubtaskCreate(BaseModel):
    title: str

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()


class SubtaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None


class SubtaskResponse(BaseModel):
    id: int
    todo_id: int
    title: str
    completed: bool

    model_config = {"from_attributes": True}


class TodoResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    due_date: Optional[str]
    priority: str
    category: str
    completed: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    subtasks: list[SubtaskResponse] = []

    model_config = {"from_attributes": True}


class BulkDeleteRequest(BaseModel):
    ids: list[int]
