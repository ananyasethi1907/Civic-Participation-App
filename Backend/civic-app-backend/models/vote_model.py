from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Vote(Base):
    __tablename__ = "votes"
    
    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("issues.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    vote_type = Column(String)  # "up" or "down"