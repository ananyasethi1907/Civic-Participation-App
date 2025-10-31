from pydantic import BaseModel

class VoteCreate(BaseModel):
    issue_id: int
    vote_type: str

class VoteResponse(BaseModel):
    id: int
    issue_id: int
    user_id: int
    vote_type: str
    
    class Config:
        from_attributes = True