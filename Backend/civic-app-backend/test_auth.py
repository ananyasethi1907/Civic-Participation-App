import requests
import json

# Test authentication endpoints
BASE_URL = "http://localhost:8000"

def test_register():
    """Test citizen registration"""
    data = {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123",
        "ward": "Ward 1"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=data)
    print(f"Register: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json()

def test_login():
    """Test citizen login"""
    data = {
        "email": "john@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    print(f"Login: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2))
    return result.get("access_token")

def test_protected_route(token):
    """Test protected route with JWT token"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test profile endpoint
    response = requests.get(f"{BASE_URL}/profile", headers=headers)
    print(f"Profile: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    
    # Test create issue
    issue_data = {
        "title": "Broken Street Light",
        "description": "Street light on Main St is not working",
        "category": "Infrastructure",
        "location": "Main Street"
    }
    
    response = requests.post(f"{BASE_URL}/issues", json=issue_data, headers=headers)
    print(f"Create Issue: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    print("Testing Authentication Flow...")
    
    # Test registration
    print("\n1. Testing Registration:")
    test_register()
    
    # Test login
    print("\n2. Testing Login:")
    token = test_login()
    
    # Test protected routes
    if token:
        print("\n3. Testing Protected Routes:")
        test_protected_route(token)