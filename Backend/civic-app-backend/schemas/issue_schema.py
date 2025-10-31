from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IssueCreate(BaseModel):
    title: str
    description: str
    category: str
    location: str
    image_url: Optional[str] = None

class IssueResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location: str
    image_url: Optional[str]
    status: str
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True