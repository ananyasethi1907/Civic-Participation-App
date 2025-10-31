import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoints():
    """Test if endpoints are working"""
    print("🔍 Testing API endpoints...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint: {response.status_code}")
        if response.status_code == 200:
            print("✅ API is running")
        else:
            print("❌ API not responding properly")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to API: {e}")
        return False
    
    # Test registration endpoint
    print("\n📝 Testing registration...")
    register_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "test123",
        "ward": "Ward 1"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Register status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Registration working")
            return True
        else:
            print("❌ Registration failed")
            return False
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

if __name__ == "__main__":
    test_endpoints()