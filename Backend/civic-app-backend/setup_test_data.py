import requests
import json

BASE_URL = "http://localhost:8000"

def setup_test_user():
    """Register a test user for testing"""
    print("🔧 Setting up test user...")
    
    # Register test user
    register_data = {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123",
        "ward": "Ward 1"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Register Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Test user registered successfully")
            return True
        else:
            print(f"Registration response: {response.text}")
            # User might already exist, try login
            return test_login()
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure to run: python main.py")
        return False
    except Exception as e:
        print(f"❌ Registration failed: {e}")
        return False

def test_login():
    """Test login with existing user"""
    login_data = {
        "email": "john@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Login Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login successful")
            return True
        else:
            print(f"Login failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return False

def check_api_health():
    """Check if API is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ API is running")
            return True
        else:
            print("❌ API health check failed")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ API is not running. Start it with: python main.py")
        return False

if __name__ == "__main__":
    print("🚀 Setting up test environment...")
    
    if check_api_health():
        if setup_test_user():
            print("\n✅ Test environment ready!")
            print("Now you can run: python test_crud.py")
        else:
            print("\n❌ Failed to setup test user")
    else:
        print("\n❌ API is not running")
        print("Please run: python main.py")