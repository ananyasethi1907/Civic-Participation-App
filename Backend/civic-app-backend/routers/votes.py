from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from schemas.vote_schema import VoteCreate, VoteResponse
from models.vote_model import Vote
from database import get_db

router = APIRouter(prefix="/votes", tags=["votes"])

@router.post("/", response_model=VoteResponse)
def add_or_update_vote(vote: VoteCreate, user_id: int, db: Session = Depends(get_db)):
    existing_vote = db.query(Vote).filter(
        Vote.issue_id == vote.issue_id,
        Vote.user_id == user_id
    ).first()
    
    if existing_vote:
        existing_vote.vote_type = vote.vote_type
        db.commit()
        db.refresh(existing_vote)
        return existing_vote
    else:
        new_vote = Vote(issue_id=vote.issue_id, user_id=user_id, vote_type=vote.vote_type)
        db.add(new_vote)
        db.commit()
        db.refresh(new_vote)
        return new_vote

@router.get("/{issue_id}")
def get_vote_count(issue_id: int, db: Session = Depends(get_db)):
    up_votes = db.query(Vote).filter(
        Vote.issue_id == issue_id,
        Vote.vote_type == "up"
    ).count()
    
    down_votes = db.query(Vote).filter(
        Vote.issue_id == issue_id,
        Vote.vote_type == "down"
    ).count()
    
    return {
        "issue_id": issue_id,
        "up_votes": up_votes,
        "down_votes": down_votes,
        "total_votes": up_votes + down_votes
    }