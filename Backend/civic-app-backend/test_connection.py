from database import get_supabase_client
import os

def simple_test():
    try:
        supabase = get_supabase_client()
        
        # Test 1: Check if client is created
        print("✅ Supabase client created")
        
        # Test 2: Check environment variables
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_ANON_KEY")
        
        if url and key:
            print(f"✅ Environment variables loaded")
            print(f"   URL: {url}")
            print(f"   Key: {key[:20]}...")
        else:
            print("❌ Environment variables not found")
            
        # Test 3: Try auth check (works without tables)
        user = supabase.auth.get_user()
        print("✅ Connection to Supabase successful!")
        
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    simple_test()