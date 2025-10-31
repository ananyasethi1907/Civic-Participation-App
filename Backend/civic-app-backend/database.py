import os
from dotenv import load_dotenv
import requests
import json

# Load environment variables from .env file
load_dotenv()

# Get environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

class SimpleSupabaseClient:
    def __init__(self, url, key):
        self.url = url
        self.key = key
        self.headers = {
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json"
        }
    
    def table(self, table_name):
        return SimpleTable(self.url, self.headers, table_name)

class SimpleTable:
    def __init__(self, url, headers, table_name):
        self.url = url
        self.headers = headers
        self.table_name = table_name
        self.base_url = f"{url}/rest/v1/{table_name}"
    
    def select(self, columns="*"):
        self._select_columns = columns
        return self
    
    def eq(self, column, value):
        self._filters = getattr(self, '_filters', [])
        self._filters.append(f"{column}=eq.{value}")
        return self
    
    def order(self, column, desc=False):
        self._order = f"{column}.{'desc' if desc else 'asc'}"
        return self
    
    def limit(self, count):
        self._limit = count
        return self
    
    def range(self, start, end):
        self._range = f"{start}-{end}"
        return self
    
    def execute(self):
        url = self.base_url
        params = []
        
        if hasattr(self, '_select_columns'):
            params.append(f"select={self._select_columns}")
        
        if hasattr(self, '_filters'):
            params.extend(self._filters)
        
        if hasattr(self, '_order'):
            params.append(f"order={self._order}")
        
        if hasattr(self, '_limit'):
            params.append(f"limit={self._limit}")
        
        if params:
            url += "?" + "&".join(params)
        
        if hasattr(self, '_range'):
            headers = self.headers.copy()
            headers['Range'] = self._range
        else:
            headers = self.headers
        
        response = requests.get(url, headers=headers)
        
        # Reset filters for next query
        for attr in ['_select_columns', '_filters', '_order', '_limit', '_range']:
            if hasattr(self, attr):
                delattr(self, attr)
        
        return SimpleResponse(response.json() if response.status_code == 200 else [])
    
    def insert(self, data):
        headers = self.headers.copy()
        headers['Prefer'] = 'return=representation'
        response = requests.post(self.base_url, headers=headers, json=data)
        if response.status_code == 201:
            return SimpleResponse(response.json())
        else:
            print(f"Insert failed: {response.status_code} - {response.text}")
            return SimpleResponse([])
    
    def update(self, data):
        url = self.base_url
        if hasattr(self, '_filters'):
            url += "?" + "&".join(self._filters)
        response = requests.patch(url, headers=self.headers, json=data)
        # Reset filters
        if hasattr(self, '_filters'):
            delattr(self, '_filters')
        return SimpleResponse(response.json() if response.status_code == 200 else [])
    
    def delete(self):
        url = self.base_url
        if hasattr(self, '_filters'):
            url += "?" + "&".join(self._filters)
        response = requests.delete(url, headers=self.headers)
        # Reset filters
        if hasattr(self, '_filters'):
            delattr(self, '_filters')
        return SimpleResponse([] if response.status_code == 204 else [])

class SimpleResponse:
    def __init__(self, data):
        self.data = data

class SimpleAuth:
    def get_user(self):
        return None

# Create simple client
simple_supabase = SimpleSupabaseClient(SUPABASE_URL, SUPABASE_KEY)
simple_supabase.auth = SimpleAuth()

def get_supabase_client():
    """Returns the simple Supabase client instance"""
    return simple_supabase

def test_connection():
    """Test the Supabase connection"""
    try:
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("[ERROR] Environment variables not loaded")
            return False
            
        print(f"Project URL: {SUPABASE_URL}")
        print(f"Key loaded: {SUPABASE_KEY[:20]}...")
        
        client = get_supabase_client()
        print("[OK] Simple Supabase client created successfully!")
        return True
    except Exception as e:
        print(f"[ERROR] Connection failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing simple Supabase setup...")
    test_connection()