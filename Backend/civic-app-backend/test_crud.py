import requests
import json

BASE_URL = "http://localhost:8000"

def get_auth_token():
    """Get authentication token"""
    login_data = {
        "email": "john@example.com",
        "password": "password123"
    }
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            return response.json().get("access_token")
        else:
            print(f"Login failed: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure to run: python main.py")
        return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_crud_operations():
    """Test all CRUD operations"""
    token = get_auth_token()
    if not token:
        print("❌ Failed to get auth token")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("🔍 Testing CRUD Operations...")
    
    # 1. Create Issue
    print("\n1. Creating Issue:")
    issue_data = {
        "title": "Broken Street Light",
        "description": "Street light on Main St is not working",
        "category": "Infrastructure",
        "location": "Main Street"
    }
    response = requests.post(f"{BASE_URL}/issues", json=issue_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        issue = response.json()
        issue_id = issue["issue_id"]
        print(f"✅ Issue created: {issue_id}")
    else:
        print(f"❌ Failed: {response.text}")
        return
    
    # 2. Get All Issues
    print("\n2. Getting All Issues:")
    response = requests.get(f"{BASE_URL}/issues")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        issues = response.json()
        print(f"✅ Found {len(issues)} issues")
    
    # 3. Get Specific Issue
    print(f"\n3. Getting Issue {issue_id}:")
    response = requests.get(f"{BASE_URL}/issues/{issue_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Issue retrieved successfully")
    
    # 4. Cast Vote
    print(f"\n4. Casting Vote on Issue {issue_id}:")
    vote_data = {
        "issue_id": issue_id,
        "vote_type": "Upvote"
    }
    response = requests.post(f"{BASE_URL}/votes", json=vote_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Vote cast successfully")
        print(json.dumps(response.json(), indent=2))
    
    # 5. Try Duplicate Vote (should update)
    print(f"\n5. Trying Duplicate Vote (should update):")
    vote_data["vote_type"] = "Downvote"
    response = requests.post(f"{BASE_URL}/votes", json=vote_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Vote updated successfully")
    
    # 6. Get Vote Counts
    print(f"\n6. Getting Vote Counts for Issue {issue_id}:")
    response = requests.get(f"{BASE_URL}/issues/{issue_id}/votes")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        votes = response.json()
        print(f"✅ Upvotes: {votes['upvotes']}, Downvotes: {votes['downvotes']}")
    
    # 7. Add Feedback
    print(f"\n7. Adding Feedback to Issue {issue_id}:")
    feedback_data = {
        "issue_id": issue_id,
        "message": "This is a serious issue that needs immediate attention!"
    }
    response = requests.post(f"{BASE_URL}/feedbacks", json=feedback_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Feedback added successfully")
    
    # 8. Get Issue Feedbacks
    print(f"\n8. Getting Feedbacks for Issue {issue_id}:")
    response = requests.get(f"{BASE_URL}/issues/{issue_id}/feedbacks")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        feedbacks = response.json()
        print(f"✅ Found {len(feedbacks)} feedbacks")
    
    # 9. Update Issue Status
    print(f"\n9. Updating Issue Status to 'In Progress':")
    status_data = {"status": "In Progress"}
    response = requests.put(f"{BASE_URL}/issues/{issue_id}/status", json=status_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print("✅ Issue status updated successfully")
    
    # 10. Get Issues by Status
    print(f"\n10. Getting Issues by Status 'In Progress':")
    response = requests.get(f"{BASE_URL}/issues/status/In Progress")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        issues = response.json()
        print(f"✅ Found {len(issues)} issues in progress")
    
    # 11. Get Issues by Category
    print(f"\n11. Getting Issues by Category 'Infrastructure':")
    response = requests.get(f"{BASE_URL}/issues/category/Infrastructure")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        issues = response.json()
        print(f"✅ Found {len(issues)} infrastructure issues")
    
    # 12. Get Notifications
    print(f"\n12. Getting User Notifications:")
    response = requests.get(f"{BASE_URL}/notifications", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        notifications = response.json()
        print(f"✅ Found {len(notifications)} notifications")

def test_error_handling():
    """Test error handling"""
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n🚨 Testing Error Handling...")
    
    # Test invalid issue ID
    print("\n1. Testing Invalid Issue ID:")
    response = requests.get(f"{BASE_URL}/issues/invalid-uuid")
    print(f"Status: {response.status_code}")
    if response.status_code == 400:
        print("✅ Properly handled invalid UUID")
    
    # Test invalid vote type
    print("\n2. Testing Invalid Vote Type:")
    vote_data = {
        "issue_id": "550e8400-e29b-41d4-a716-446655440000",
        "vote_type": "InvalidVote"
    }
    response = requests.post(f"{BASE_URL}/votes", json=vote_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 400:
        print("✅ Properly handled invalid vote type")
    
    # Test invalid status update
    print("\n3. Testing Invalid Status Update:")
    status_data = {"status": "InvalidStatus"}
    response = requests.put(f"{BASE_URL}/issues/550e8400-e29b-41d4-a716-446655440000/status", json=status_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 400:
        print("✅ Properly handled invalid status")

if __name__ == "__main__":
    test_crud_operations()
    test_error_handling()