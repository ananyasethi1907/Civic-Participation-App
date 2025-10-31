import requests
from database import get_supabase_client
import os
from dotenv import load_dotenv

load_dotenv()

def setup_database():
    """Setup database tables"""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_ANON_KEY")
    
    # Read the SQL migration file
    with open('migrations/001_initial_schema.sql', 'r') as f:
        sql_content = f.read()
    
    # Execute SQL using Supabase REST API
    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json"
    }
    
    # Test connection first
    try:
        response = requests.get(f"{supabase_url}/rest/v1/citizens?limit=1", headers=headers)
        if response.status_code == 200:
            print("[OK] Citizens table exists and accessible")
            return True
        elif response.status_code == 404:
            print("[ERROR] Citizens table does not exist")
            print("Please run the SQL migration in your Supabase dashboard:")
            print("Go to SQL Editor in Supabase and run the contents of migrations/001_initial_schema.sql")
            return False
        else:
            print(f"[ERROR] Database connection issue: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"[ERROR] Error connecting to database: {e}")
        return False

if __name__ == "__main__":
    setup_database()