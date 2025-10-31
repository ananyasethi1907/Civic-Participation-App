import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("Environment Variables Check:")
print("=" * 40)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY")

print(f"SUPABASE_URL: {url}")
print(f"SUPABASE_ANON_KEY: {key[:20] + '...' if key else 'Not found'}")

if url and key:
    print("\n✅ Environment variables loaded successfully!")
else:
    print("\n❌ Environment variables not found!")
    print("Make sure .env file is in the same directory as this script")