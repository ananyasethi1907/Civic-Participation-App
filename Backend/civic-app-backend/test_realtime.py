import asyncio
import websockets
import json
import requests

BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000"

async def test_admin_websocket():
    """Test admin WebSocket connection"""
    print("🔌 Testing Admin WebSocket...")
    
    try:
        async with websockets.connect(f"{WS_URL}/ws/admin") as websocket:
            print("✅ Connected as Admin")
            
            # Listen for messages for 10 seconds
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=10.0)
                data = json.loads(message)
                print(f"📨 Received: {data['type']}")
                print(f"   Data: {len(data.get('data', []))} items")
            except asyncio.TimeoutError:
                print("⏰ No initial messages received (normal if no data)")
            
            print("✅ Admin WebSocket working")
            
    except Exception as e:
        print(f"❌ Admin WebSocket failed: {e}")

async def test_citizen_websocket():
    """Test citizen WebSocket connection"""
    print("\n🔌 Testing Citizen WebSocket...")
    
    citizen_id = "test-citizen-123"
    
    try:
        async with websockets.connect(f"{WS_URL}/ws/citizen/{citizen_id}") as websocket:
            print(f"✅ Connected as Citizen: {citizen_id}")
            
            # Listen for messages for 5 seconds
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                data = json.loads(message)
                print(f"📨 Received: {data['type']}")
            except asyncio.TimeoutError:
                print("⏰ No initial messages received (normal if no notifications)")
            
            print("✅ Citizen WebSocket working")
            
    except Exception as e:
        print(f"❌ Citizen WebSocket failed: {e}")

def test_api_health():
    """Test if API is running"""
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ API is running")
            return True
        else:
            print("❌ API not responding properly")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to API: {e}")
        return False

async def main():
    """Main test function"""
    print("🚀 Testing Real-time WebSocket Connections")
    print("=" * 50)
    
    # Check API health first
    if not test_api_health():
        print("\n❌ API is not running. Start it with: python main.py")
        return
    
    # Test WebSocket connections
    await test_admin_websocket()
    await test_citizen_websocket()
    
    print("\n🎉 Real-time testing complete!")
    print("\nTo test live updates:")
    print("1. Open frontend_realtime.html in browser")
    print("2. Connect as Admin and Citizen")
    print("3. Create issues via API to see real-time updates")

if __name__ == "__main__":
    asyncio.run(main())