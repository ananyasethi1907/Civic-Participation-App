import requests
import json

# Test the root endpoint
try:
    response = requests.get("http://127.0.0.1:8000/")
    print("Root endpoint:", response.status_code, response.json())
except Exception as e:
    print("Server not running:", e)

# Test user registration
try:
    user_data = {
        "name": "Test User",
        "email": "test@example.com", 
        "password": "testpass123"
    }
    response = requests.post("http://127.0.0.1:8000/users/register", json=user_data)
    print("Registration:", response.status_code)
    if response.status_code == 200:
        print("Success:", response.json())
    else:
        print("Error:", response.text)
except Exception as e:
    print("Registration failed:", e)