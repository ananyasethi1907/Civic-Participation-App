import subprocess
import time
import sys
import requests

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import supabase
        import fastapi
        import uvicorn
        print("✅ All dependencies are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Run: pip install -r requirements.txt")
        return False

def start_api():
    """Start the FastAPI server"""
    print("🚀 Starting FastAPI server...")
    try:
        # Start the server in background
        process = subprocess.Popen([
            sys.executable, "main.py"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Wait for server to start
        time.sleep(3)
        
        # Check if server is running
        try:
            response = requests.get("http://localhost:8000/")
            if response.status_code == 200:
                print("✅ API server started successfully")
                return process
            else:
                print("❌ API server failed to start properly")
                return None
        except:
            print("❌ API server is not responding")
            return None
            
    except Exception as e:
        print(f"❌ Failed to start API server: {e}")
        return None

def run_setup():
    """Run setup script"""
    print("\n🔧 Setting up test environment...")
    try:
        result = subprocess.run([sys.executable, "setup_test_data.py"], 
                              capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        return False

def run_tests():
    """Run the test script"""
    print("\n🧪 Running CRUD tests...")
    try:
        result = subprocess.run([sys.executable, "test_crud.py"], 
                              capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print(result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Tests failed: {e}")
        return False

def main():
    """Main test runner"""
    print("🎯 Civic Participation App - Test Runner")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Start API server
    server_process = start_api()
    if not server_process:
        print("❌ Cannot start API server")
        return
    
    try:
        # Run setup
        if run_setup():
            # Run tests
            run_tests()
        else:
            print("❌ Setup failed, skipping tests")
    
    finally:
        # Stop the server
        print("\n🛑 Stopping API server...")
        server_process.terminate()
        server_process.wait()
        print("✅ Server stopped")

if __name__ == "__main__":
    main()