import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Get environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

# Create Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_supabase_client():
    """Returns the Supabase client instance"""
    return supabase

def test_connection():
    """Test the Supabase connection"""
    try:
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("❌ Environment variables not loaded")
            return False
            
        print(f"Project URL: {SUPABASE_URL}")
        print(f"Key loaded: {SUPABASE_KEY[:20]}...")
        
        # Simple client test without network call
        client = get_supabase_client()
        print("✅ Supabase client created successfully!")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return False

def test_network_connection():
    """Test actual network connection to Supabase"""
    try:
        print("🔍 Testing network connection...")
        # Try a simple auth check
        user = supabase.auth.get_user()
        print("✅ Network connection successful!")
        return True
    except Exception as e:
        print(f"❌ Network connection failed: {e}")
        print("This might be due to:")
        print("- Internet connection issues")
        print("- Firewall blocking the connection")
        print("- Incorrect Supabase URL")
        return False

if __name__ == "__main__":
    print("Testing Supabase setup...")
    if test_connection():
        print("\nTesting network connection...")
        test_network_connection()
    else:
        print("\nSkipping network test due to setup issues")