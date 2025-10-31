import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_backend():
    print("Testing Backend API...")
    
    # Test 1: Health check
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"✓ Health check: {response.json()}")
    except Exception as e:
        print(f"✗ Health check failed: {e}")
        return
    
    # Test 2: Register user
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "ward": "Ward 1"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
        if response.status_code == 200:
            result = response.json()
            token = result.get("access_token")
            print(f"✓ User registered successfully")
            print(f"  Token: {token[:20]}...")
        else:
            print(f"✗ Registration failed: {response.text}")
            return
    except Exception as e:
        print(f"✗ Registration error: {e}")
        return
    
    # Test 3: Login user
    login_data = {
        "email": "test@example.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            result = response.json()
            token = result.get("access_token")
            print(f"✓ Login successful")
        else:
            print(f"✗ Login failed: {response.text}")
            return
    except Exception as e:
        print(f"✗ Login error: {e}")
        return
    
    # Test 4: Create issue (with auth)
    headers = {"Authorization": f"Bearer {token}"}
    issue_data = {
        "title": "Test Issue",
        "description": "This is a test issue",
        "category": "Infrastructure",
        "location": "Test Location"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/issues", json=issue_data, headers=headers)
        if response.status_code == 200:
            issue = response.json()
            print(f"✓ Issue created: {issue.get('title')}")
        else:
            print(f"✗ Issue creation failed: {response.text}")
    except Exception as e:
        print(f"✗ Issue creation error: {e}")
    
    # Test 5: Get all issues
    try:
        response = requests.get(f"{BASE_URL}/issues")
        if response.status_code == 200:
            issues = response.json()
            print(f"✓ Retrieved {len(issues)} issues")
        else:
            print(f"✗ Get issues failed: {response.text}")
    except Exception as e:
        print(f"✗ Get issues error: {e}")

if __name__ == "__main__":
    test_backend()