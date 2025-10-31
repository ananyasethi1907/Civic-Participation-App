from database import get_supabase_client

def create_tables():
    supabase = get_supabase_client()
    
    # Create citizens table
    citizens_sql = """
    CREATE TABLE IF NOT EXISTS citizens (
        citizen_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        ward VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    # Create issues table
    issues_sql = """
    CREATE TABLE IF NOT EXISTS issues (
        issue_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        image_url TEXT,
        location VARCHAR(255),
        status VARCHAR(20) DEFAULT 'Pending',
        created_by UUID REFERENCES citizens(citizen_id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    """
    
    tables = [
        ("citizens", citizens_sql),
        ("issues", issues_sql)
    ]
    
    for table_name, sql in tables:
        try:
            result = supabase.rpc('exec_sql', {'sql': sql}).execute()
            print(f"✅ {table_name} table created")
        except Exception as e:
            print(f"❌ Failed to create {table_name}: {e}")

if __name__ == "__main__":
    create_tables()