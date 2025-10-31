import pytest
import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(autouse=True)
async def setup_test_environment():
    """Setup test environment before each test"""
    # Ensure we're using test environment
    assert os.getenv("SUPABASE_URL"), "SUPABASE_URL not found in environment"
    assert os.getenv("SUPABASE_ANON_KEY"), "SUPABASE_ANON_KEY not found in environment"
    
    # You can add test database cleanup here if needed
    yield
    
    # Cleanup after test (optional)
    pass