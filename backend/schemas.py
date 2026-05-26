from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime


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

    model_config = {"from_attributes": True}


class BulkDeleteRequest(BaseModel):
    ids: list[int]
