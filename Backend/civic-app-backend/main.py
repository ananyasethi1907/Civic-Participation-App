from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from auth import AuthService, get_current_user
from database import get_supabase_client
from services import civic_service
from typing import Optional
import uuid

app = FastAPI(title="Civic Participation API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
auth_service = AuthService()
supabase = get_supabase_client()

# Pydantic models
class CitizenRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    ward: str

class CitizenLogin(BaseModel):
    email: EmailStr
    password: str

class IssueCreate(BaseModel):
    title: str
    description: str
    category: str
    location: Optional[str] = None
    image_url: Optional[str] = None

class VoteCreate(BaseModel):
    issue_id: str
    vote_type: str  # "Upvote" or "Downvote"

class FeedbackCreate(BaseModel):
    issue_id: str
    message: str

class IssueStatusUpdate(BaseModel):
    status: str  # "Pending", "In Progress", "Resolved"

# Authentication endpoints
@app.post("/auth/register")
async def register(citizen_data: CitizenRegister):
    """Register a new citizen"""
    return await auth_service.register_citizen(
        email=citizen_data.email,
        password=citizen_data.password,
        name=citizen_data.name,
        ward=citizen_data.ward
    )

@app.post("/auth/login")
async def login(login_data: CitizenLogin):
    """Login citizen and return JWT token"""
    return await auth_service.login_citizen(
        email=login_data.email,
        password=login_data.password
    )

@app.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout current user"""
    return await auth_service.logout_citizen(current_user.get("user_id"))

# Protected endpoints
@app.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return await civic_service.get_citizen_by_id(current_user["user_id"])

@app.post("/issues")
async def create_issue(issue_data: IssueCreate, current_user: dict = Depends(get_current_user)):
    """Create a new issue (protected route)"""
    issue = await civic_service.create_issue(
        title=issue_data.title,
        description=issue_data.description,
        category=issue_data.category,
        created_by=current_user["user_id"],
        location=issue_data.location,
        image_url=issue_data.image_url
    )
    return issue

@app.get("/issues")
async def get_issues(limit: int = 50, offset: int = 0):
    """Get all issues with pagination (public route)"""
    return await civic_service.get_all_issues(limit=limit, offset=offset)

@app.get("/issues/{issue_id}")
async def get_issue(issue_id: str):
    """Get specific issue by ID"""
    return await civic_service.get_issue_by_id(issue_id)

@app.put("/issues/{issue_id}/status")
async def update_issue_status(issue_id: str, status_data: IssueStatusUpdate, current_user: dict = Depends(get_current_user)):
    """Update issue status (protected route)"""
    updated_issue = await civic_service.update_issue_status(issue_id, status_data.status)
    return updated_issue

@app.get("/issues/category/{category}")
async def get_issues_by_category(category: str):
    """Get issues by category"""
    return await civic_service.get_issues_by_category(category)

@app.get("/issues/status/{status}")
async def get_issues_by_status(status: str):
    """Get issues by status"""
    return await civic_service.get_issues_by_status(status)

@app.post("/votes")
async def cast_vote(vote_data: VoteCreate, current_user: dict = Depends(get_current_user)):
    """Cast vote on an issue (protected route)"""
    vote_result = await civic_service.cast_vote(
        issue_id=vote_data.issue_id,
        citizen_id=current_user["user_id"],
        vote_type=vote_data.vote_type
    )
    return vote_result

@app.delete("/votes/{issue_id}")
async def remove_vote(issue_id: str, current_user: dict = Depends(get_current_user)):
    """Remove vote from an issue (protected route)"""
    return await civic_service.remove_vote(issue_id, current_user["user_id"])

@app.get("/issues/{issue_id}/votes")
async def get_issue_votes(issue_id: str):
    """Get vote count for an issue"""
    return await civic_service.get_vote_counts(issue_id)

# Feedback endpoints
@app.post("/feedbacks")
async def add_feedback(feedback_data: FeedbackCreate, current_user: dict = Depends(get_current_user)):
    """Add feedback to an issue (protected route)"""
    return await civic_service.add_feedback(
        citizen_id=current_user["user_id"],
        issue_id=feedback_data.issue_id,
        message=feedback_data.message
    )

@app.get("/issues/{issue_id}/feedbacks")
async def get_issue_feedbacks(issue_id: str):
    """Get all feedbacks for an issue"""
    return await civic_service.get_issue_feedbacks(issue_id)

@app.get("/notifications")
async def get_notifications(current_user: dict = Depends(get_current_user), unread_only: bool = False):
    """Get notifications for current user (protected route)"""
    return await civic_service.get_citizen_notifications(current_user["user_id"], unread_only)

@app.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user: dict = Depends(get_current_user)):
    """Mark notification as read (protected route)"""
    return await civic_service.mark_notification_read(notification_id, current_user["user_id"])

@app.get("/")
async def root():
    """API health check"""
    return {"message": "Civic Participation API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)