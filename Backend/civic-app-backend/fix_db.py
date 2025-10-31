from database import engine
import sqlite3

# Connect directly to SQLite and add the missing column
conn = sqlite3.connect('civic.db')
cursor = conn.cursor()

try:
    # Check if name column exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'name' not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN name TEXT")
        print("Added name column to users table")
    else:
        print("Name column already exists")
        
    conn.commit()
except Exception as e:
    print(f"Error: {e}")
finally:
    conn.close()