import subprocess
import sys
import os

def run_tests():
    """Run all tests with proper configuration"""
    print("🧪 Running Civic Participation App Tests")
    print("=" * 50)
    
    # Check if pytest is installed
    try:
        import pytest
    except ImportError:
        print("❌ pytest not installed. Installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pytest", "pytest-asyncio"])
    
    # Set test environment
    os.environ["TESTING"] = "true"
    
    # Run tests with verbose output
    test_args = [
        "-v",  # verbose
        "-s",  # don't capture output
        "--tb=short",  # shorter traceback format
        "test_crud_operations.py"
    ]
    
    try:
        result = subprocess.run([sys.executable, "-m", "pytest"] + test_args, 
                              capture_output=False, text=True)
        
        if result.returncode == 0:
            print("\n✅ All tests passed!")
        else:
            print(f"\n❌ Tests failed with exit code: {result.returncode}")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running tests: {e}")
        return False

def run_specific_test(test_name):
    """Run a specific test"""
    test_args = ["-v", "-s", f"test_crud_operations.py::{test_name}"]
    
    try:
        result = subprocess.run([sys.executable, "-m", "pytest"] + test_args)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running test {test_name}: {e}")
        return False

def run_test_coverage():
    """Run tests with coverage report"""
    try:
        # Install coverage if not available
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pytest-cov"])
        
        test_args = [
            "--cov=services",
            "--cov=auth", 
            "--cov=database",
            "--cov-report=html",
            "--cov-report=term",
            "test_crud_operations.py"
        ]
        
        result = subprocess.run([sys.executable, "-m", "pytest"] + test_args)
        
        if result.returncode == 0:
            print("\n✅ Coverage report generated in htmlcov/")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Error running coverage: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "coverage":
            run_test_coverage()
        elif command.startswith("test_"):
            run_specific_test(command)
        else:
            print("Usage: python test_runner.py [coverage|test_name]")
    else:
        run_tests()