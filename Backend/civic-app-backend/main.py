from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import user_model, issue_model, vote_model
from routers import users, issues, votes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Civic Participation App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(issues.router)
app.include_router(votes.router)

@app.get("/")
def root():
    return {"message": "Civic Participation API Running"}