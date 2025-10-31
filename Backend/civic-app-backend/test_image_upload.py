import requests
import json

BASE_URL = "http://localhost:8000"

def get_auth_token():
    """Get authentication token"""
    login_data = {
        "email": "john@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

def test_image_upload():
    """Test image upload functionality"""
    token = get_auth_token()
    if not token:
        print("❌ Failed to get auth token")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("📸 Testing Image Upload...")
    
    # Create a test image file (you can replace with actual image)
    test_image_content = b"fake_image_data_for_testing"
    
    # Test 1: Upload image directly
    print("\n1. Testing direct image upload:")
    files = {"image": ("test.jpg", test_image_content, "image/jpeg")}
    
    try:
        response = requests.post(f"{BASE_URL}/upload-image", files=files, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            image_url = result.get("image_url")
            print(f"✅ Image uploaded: {image_url}")
        else:
            print("❌ Image upload failed")
            
    except Exception as e:
        print(f"❌ Upload error: {e}")
    
    # Test 2: Create issue with image
    print("\n2. Testing issue creation with image:")
    
    issue_data = {
        "title": "Pothole on Main Street",
        "description": "Large pothole causing traffic issues",
        "category": "Infrastructure",
        "location": "Main Street"
    }
    
    files = {"image": ("pothole.jpg", test_image_content, "image/jpeg")}
    
    try:
        response = requests.post(f"{BASE_URL}/issues", data=issue_data, files=files, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Issue created with image")
        else:
            print("❌ Issue creation failed")
            
    except Exception as e:
        print(f"❌ Issue creation error: {e}")

if __name__ == "__main__":
    test_image_upload()