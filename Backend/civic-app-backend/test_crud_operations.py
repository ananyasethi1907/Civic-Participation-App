import pytest
import asyncio
from services import CivicService
from auth import AuthService
from database import get_supabase_client
import uuid

@pytest.fixture
def civic_service():
    """Fixture for CivicService"""
    return CivicService()

@pytest.fixture
def auth_service():
    """Fixture for AuthService"""
    return AuthService()

@pytest.fixture
async def test_citizen(auth_service):
    """Create a test citizen for testing"""
    test_email = f"test_{uuid.uuid4()}@example.com"
    citizen = await auth_service.register_citizen(
        email=test_email,
        password="test123",
        name="Test User",
        ward="Test Ward"
    )
    return citizen["user"]

@pytest.fixture
async def test_issue(civic_service, test_citizen):
    """Create a test issue for testing"""
    issue = await civic_service.create_issue(
        title="Test Issue",
        description="This is a test issue",
        category="Infrastructure",
        created_by=test_citizen["citizen_id"],
        location="Test Location"
    )
    return issue

class TestCitizenCRUD:
    """Test citizen CRUD operations"""
    
    @pytest.mark.asyncio
    async def test_create_citizen(self, auth_service):
        """Test citizen creation"""
        test_email = f"create_test_{uuid.uuid4()}@example.com"
        
        result = await auth_service.register_citizen(
            email=test_email,
            password="password123",
            name="John Doe",
            ward="Ward 1"
        )
        
        assert result["user"]["email"] == test_email
        assert result["user"]["name"] == "John Doe"
        assert result["user"]["ward"] == "Ward 1"
        assert "access_token" in result
    
    @pytest.mark.asyncio
    async def test_login_citizen(self, auth_service, test_citizen):
        """Test citizen login"""
        result = await auth_service.login_citizen(
            email=test_citizen["email"],
            password="test123"
        )
        
        assert "access_token" in result
        assert result["user"]["citizen_id"] == test_citizen["citizen_id"]
    
    @pytest.mark.asyncio
    async def test_get_citizen_by_id(self, civic_service, test_citizen):
        """Test retrieving citizen by ID"""
        citizen = await civic_service.get_citizen_by_id(test_citizen["citizen_id"])
        
        assert citizen["citizen_id"] == test_citizen["citizen_id"]
        assert citizen["email"] == test_citizen["email"]

class TestIssueCRUD:
    """Test issue CRUD operations"""
    
    @pytest.mark.asyncio
    async def test_create_issue(self, civic_service, test_citizen):
        """Test issue creation"""
        issue = await civic_service.create_issue(
            title="Pothole on Main Street",
            description="Large pothole causing traffic issues",
            category="Infrastructure",
            created_by=test_citizen["citizen_id"],
            location="Main Street",
            image_url="https://example.com/image.jpg"
        )
        
        assert issue["title"] == "Pothole on Main Street"
        assert issue["category"] == "Infrastructure"
        assert issue["status"] == "Pending"
        assert issue["created_by"] == test_citizen["citizen_id"]
    
    @pytest.mark.asyncio
    async def test_get_issue_by_id(self, civic_service, test_issue):
        """Test retrieving issue by ID"""
        issue = await civic_service.get_issue_by_id(test_issue["issue_id"])
        
        assert issue["issue_id"] == test_issue["issue_id"]
        assert issue["title"] == test_issue["title"]
    
    @pytest.mark.asyncio
    async def test_update_issue_status(self, civic_service, test_issue):
        """Test updating issue status"""
        updated_issue = await civic_service.update_issue_status(
            test_issue["issue_id"], 
            "In Progress"
        )
        
        assert updated_issue["status"] == "In Progress"
        assert updated_issue["issue_id"] == test_issue["issue_id"]
    
    @pytest.mark.asyncio
    async def test_get_all_issues(self, civic_service, test_issue):
        """Test retrieving all issues"""
        issues = await civic_service.get_all_issues(limit=10)
        
        assert isinstance(issues, list)
        assert len(issues) > 0
        # Check if our test issue is in the list
        issue_ids = [issue["issue_id"] for issue in issues]
        assert test_issue["issue_id"] in issue_ids
    
    @pytest.mark.asyncio
    async def test_get_issues_by_category(self, civic_service, test_issue):
        """Test filtering issues by category"""
        issues = await civic_service.get_issues_by_category("Infrastructure")
        
        assert isinstance(issues, list)
        for issue in issues:
            assert issue["category"] == "Infrastructure"
    
    @pytest.mark.asyncio
    async def test_get_issues_by_status(self, civic_service, test_issue):
        """Test filtering issues by status"""
        issues = await civic_service.get_issues_by_status("Pending")
        
        assert isinstance(issues, list)
        for issue in issues:
            assert issue["status"] == "Pending"

class TestVoteCRUD:
    """Test vote CRUD operations"""
    
    @pytest.mark.asyncio
    async def test_cast_vote(self, civic_service, test_issue, test_citizen):
        """Test casting a vote"""
        vote_result = await civic_service.cast_vote(
            issue_id=test_issue["issue_id"],
            citizen_id=test_citizen["citizen_id"],
            vote_type="Upvote"
        )
        
        assert "vote" in vote_result
        assert vote_result["vote"]["vote_type"] == "Upvote"
    
    @pytest.mark.asyncio
    async def test_update_vote(self, civic_service, test_issue, test_citizen):
        """Test updating an existing vote"""
        # First cast a vote
        await civic_service.cast_vote(
            issue_id=test_issue["issue_id"],
            citizen_id=test_citizen["citizen_id"],
            vote_type="Upvote"
        )
        
        # Then update it
        vote_result = await civic_service.cast_vote(
            issue_id=test_issue["issue_id"],
            citizen_id=test_citizen["citizen_id"],
            vote_type="Downvote"
        )
        
        assert vote_result["message"] == "Vote updated"
        assert vote_result["vote"]["vote_type"] == "Downvote"
    
    @pytest.mark.asyncio
    async def test_get_vote_counts(self, civic_service, test_issue, test_citizen):
        """Test getting vote counts"""
        # Cast a vote first
        await civic_service.cast_vote(
            issue_id=test_issue["issue_id"],
            citizen_id=test_citizen["citizen_id"],
            vote_type="Upvote"
        )
        
        vote_counts = await civic_service.get_vote_counts(test_issue["issue_id"])
        
        assert "upvotes" in vote_counts
        assert "downvotes" in vote_counts
        assert "total_votes" in vote_counts
        assert vote_counts["upvotes"] >= 1
    
    @pytest.mark.asyncio
    async def test_remove_vote(self, civic_service, test_issue, test_citizen):
        """Test removing a vote"""
        # Cast a vote first
        await civic_service.cast_vote(
            issue_id=test_issue["issue_id"],
            citizen_id=test_citizen["citizen_id"],
            vote_type="Upvote"
        )
        
        # Remove the vote
        result = await civic_service.remove_vote(
            test_issue["issue_id"],
            test_citizen["citizen_id"]
        )
        
        assert result["message"] == "Vote removed successfully"

class TestFeedbackCRUD:
    """Test feedback CRUD operations"""
    
    @pytest.mark.asyncio
    async def test_add_feedback(self, civic_service, test_issue, test_citizen):
        """Test adding feedback"""
        feedback = await civic_service.add_feedback(
            citizen_id=test_citizen["citizen_id"],
            issue_id=test_issue["issue_id"],
            message="This is a serious issue that needs attention!"
        )
        
        assert feedback["message"] == "This is a serious issue that needs attention!"
        assert feedback["citizen_id"] == test_citizen["citizen_id"]
        assert feedback["issue_id"] == test_issue["issue_id"]
    
    @pytest.mark.asyncio
    async def test_get_issue_feedbacks(self, civic_service, test_issue, test_citizen):
        """Test retrieving feedbacks for an issue"""
        # Add a feedback first
        await civic_service.add_feedback(
            citizen_id=test_citizen["citizen_id"],
            issue_id=test_issue["issue_id"],
            message="Test feedback"
        )
        
        feedbacks = await civic_service.get_issue_feedbacks(test_issue["issue_id"])
        
        assert isinstance(feedbacks, list)
        assert len(feedbacks) > 0
        assert feedbacks[0]["message"] == "Test feedback"

class TestNotificationCRUD:
    """Test notification CRUD operations"""
    
    @pytest.mark.asyncio
    async def test_create_notification(self, civic_service, test_citizen):
        """Test creating a notification"""
        notification = await civic_service.create_notification(
            citizen_id=test_citizen["citizen_id"],
            message="Test notification message"
        )
        
        assert notification["message"] == "Test notification message"
        assert notification["citizen_id"] == test_citizen["citizen_id"]
        assert notification["is_read"] == False
    
    @pytest.mark.asyncio
    async def test_get_citizen_notifications(self, civic_service, test_citizen):
        """Test retrieving citizen notifications"""
        # Create a notification first
        await civic_service.create_notification(
            citizen_id=test_citizen["citizen_id"],
            message="Test notification"
        )
        
        notifications = await civic_service.get_citizen_notifications(test_citizen["citizen_id"])
        
        assert isinstance(notifications, list)
        assert len(notifications) > 0
    
    @pytest.mark.asyncio
    async def test_mark_notification_read(self, civic_service, test_citizen):
        """Test marking notification as read"""
        # Create a notification first
        notification = await civic_service.create_notification(
            citizen_id=test_citizen["citizen_id"],
            message="Test notification"
        )
        
        # Mark it as read
        updated_notification = await civic_service.mark_notification_read(
            notification["notification_id"],
            test_citizen["citizen_id"]
        )
        
        assert updated_notification["is_read"] == True

# Integration test
class TestDataFlow:
    """Test complete data flow scenarios"""
    
    @pytest.mark.asyncio
    async def test_complete_issue_lifecycle(self, civic_service, auth_service):
        """Test complete issue lifecycle from creation to resolution"""
        # 1. Create a citizen
        test_email = f"lifecycle_test_{uuid.uuid4()}@example.com"
        citizen = await auth_service.register_citizen(
            email=test_email,
            password="test123",
            name="Lifecycle Test User",
            ward="Test Ward"
        )
        citizen_id = citizen["user"]["citizen_id"]
        
        # 2. Create an issue
        issue = await civic_service.create_issue(
            title="Complete Lifecycle Test Issue",
            description="Testing complete issue lifecycle",
            category="Infrastructure",
            created_by=citizen_id,
            location="Test Location"
        )
        issue_id = issue["issue_id"]
        
        # 3. Cast votes
        await civic_service.cast_vote(issue_id, citizen_id, "Upvote")
        vote_counts = await civic_service.get_vote_counts(issue_id)
        assert vote_counts["upvotes"] == 1
        
        # 4. Add feedback
        feedback = await civic_service.add_feedback(
            citizen_id=citizen_id,
            issue_id=issue_id,
            message="This needs immediate attention!"
        )
        assert feedback["message"] == "This needs immediate attention!"
        
        # 5. Update status
        updated_issue = await civic_service.update_issue_status(issue_id, "In Progress")
        assert updated_issue["status"] == "In Progress"
        
        # 6. Resolve issue
        resolved_issue = await civic_service.update_issue_status(issue_id, "Resolved")
        assert resolved_issue["status"] == "Resolved"
        
        # 7. Verify final state
        final_issue = await civic_service.get_issue_by_id(issue_id)
        assert final_issue["status"] == "Resolved"
        assert final_issue["title"] == "Complete Lifecycle Test Issue"