from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas.issue_schema import IssueCreate, IssueResponse
from models.issue_model import Issue
from database import get_db

router = APIRouter(prefix="/issues", tags=["issues"])

@router.post("/report", response_model=IssueResponse)
def report_issue(issue: IssueCreate, user_id: int, db: Session = Depends(get_db)):
    db_issue = Issue(**issue.dict(), user_id=user_id)
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

@router.get("/all", response_model=List[IssueResponse])
def get_all_issues(db: Session = Depends(get_db)):
    return db.query(Issue).all()

@router.get("/{user_id}", response_model=List[IssueResponse])
def get_issues_by_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(Issue).filter(Issue.user_id == user_id).all()

@router.patch("/{id}")
def update_issue_status(id: int, status: str, db: Session = Depends(get_db)):
    db_issue = db.query(Issue).filter(Issue.id == id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    db_issue.status = status
    db.commit()
    return {"message": "Issue status updated"}