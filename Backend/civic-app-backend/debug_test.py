import sqlite3

# Check the current database schema
conn = sqlite3.connect('civic.db')
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(users)")
columns = cursor.fetchall()
print("Current users table schema:")
for col in columns:
    print(f"  {col[1]} ({col[2]})")

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print(f"\nTables in database: {[t[0] for t in tables]}")

conn.close()