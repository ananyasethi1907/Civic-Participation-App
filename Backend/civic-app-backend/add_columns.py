import sqlite3

conn = sqlite3.connect('civic.db')
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE users ADD COLUMN password_hash TEXT")
    cursor.execute("ALTER TABLE users ADD COLUMN created_at DATETIME")
    conn.commit()
    print("Added missing columns")
except Exception as e:
    print(f"Columns may already exist: {e}")

conn.close()