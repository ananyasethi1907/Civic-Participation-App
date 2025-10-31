from database import get_supabase_client

def create_schema():
    supabase = get_supabase_client()
    
    # Read schema file
    with open('schema.sql', 'r') as file:
        schema_sql = file.read()
    
    try:
        # Execute schema creation
        result = supabase.rpc('exec_sql', {'sql': schema_sql}).execute()
        print("✅ Schema created successfully!")
        return True
    except Exception as e:
        print(f"❌ Schema creation failed: {e}")
        print("Please run the schema manually in Supabase SQL Editor")
        return False

if __name__ == "__main__":
    create_schema()