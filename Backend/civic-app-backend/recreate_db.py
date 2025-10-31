import os
from database import engine, Base
from models import user_model, issue_model, vote_model

# Remove existing database
if os.path.exists("civic.db"):
    os.remove("civic.db")
    print("Removed existing database")

# Create all tables
Base.metadata.create_all(bind=engine)
print("Database recreated with correct schema")