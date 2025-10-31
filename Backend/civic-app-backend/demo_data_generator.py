import asyncio
from services import CivicService
from auth import AuthService
import random
import uuid

class DemoDataGenerator:
    def __init__(self):
        self.civic_service = CivicService()
        self.auth_service = AuthService()
        self.demo_citizens = []
        self.demo_issues = []
    
    async def create_demo_citizens(self, count=5):
        """Create demo citizens"""
        print(f"👥 Creating {count} demo citizens...")
        
        names = ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Eva Brown"]
        wards = ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"]
        
        for i in range(count):
            try:
                citizen = await self.auth_service.register_citizen(
                    email=f"demo_user_{i+1}@example.com",
                    password="demo123",
                    name=names[i % len(names)],
                    ward=wards[i % len(wards)]
                )
                self.demo_citizens.append(citizen["user"])
                print(f"✅ Created citizen: {citizen['user']['name']}")
            except Exception as e:
                print(f"❌ Failed to create citizen {i+1}: {e}")
    
    async def create_demo_issues(self, count=10):
        """Create demo issues"""
        print(f"📋 Creating {count} demo issues...")
        
        issue_templates = [
            {
                "title": "Pothole on Main Street",
                "description": "Large pothole causing damage to vehicles",
                "category": "Infrastructure",
                "location": "Main Street near City Hall"
            },
            {
                "title": "Broken Street Light",
                "description": "Street light not working, creating safety hazard",
                "category": "Safety",
                "location": "Oak Avenue and 5th Street"
            },
            {
                "title": "Garbage Collection Missed",
                "description": "Garbage not collected for 3 days",
                "category": "Sanitation",
                "location": "Residential Area Block 12"
            },
            {
                "title": "Park Bench Vandalized",
                "description": "Park bench damaged by vandals",
                "category": "Vandalism",
                "location": "Central Park"
            },
            {
                "title": "Water Leak",
                "description": "Water pipe leaking on sidewalk",
                "category": "Infrastructure",
                "location": "Pine Street"
            }
        ]
        
        for i in range(count):
            if not self.demo_citizens:
                print("❌ No demo citizens available")
                break
                
            template = issue_templates[i % len(issue_templates)]
            citizen = random.choice(self.demo_citizens)
            
            try:
                issue = await self.civic_service.create_issue(
                    title=f"{template['title']} #{i+1}",
                    description=template['description'],
                    category=template['category'],
                    created_by=citizen['citizen_id'],
                    location=template['location']
                )
                self.demo_issues.append(issue)
                print(f"✅ Created issue: {issue['title']}")
            except Exception as e:
                print(f"❌ Failed to create issue {i+1}: {e}")
    
    async def create_demo_votes(self, votes_per_issue=3):
        """Create demo votes"""
        print(f"🗳️ Creating demo votes...")
        
        vote_count = 0
        for issue in self.demo_issues:
            # Random number of votes per issue
            num_votes = random.randint(1, min(votes_per_issue, len(self.demo_citizens)))
            voters = random.sample(self.demo_citizens, num_votes)
            
            for voter in voters:
                try:
                    vote_type = random.choice(["Upvote", "Downvote"])
                    await self.civic_service.cast_vote(
                        issue_id=issue['issue_id'],
                        citizen_id=voter['citizen_id'],
                        vote_type=vote_type
                    )
                    vote_count += 1
                except Exception as e:
                    print(f"❌ Failed to create vote: {e}")
        
        print(f"✅ Created {vote_count} demo votes")
    
    async def create_demo_feedbacks(self, feedbacks_per_issue=2):
        """Create demo feedbacks"""
        print(f"💬 Creating demo feedbacks...")
        
        feedback_templates = [
            "This is a serious issue that needs immediate attention!",
            "I've seen this problem getting worse over time.",
            "Thank you for reporting this. It affects our daily commute.",
            "This has been an ongoing issue in our neighborhood.",
            "I hope the authorities take action soon.",
            "This is causing safety concerns for pedestrians.",
            "The problem is more widespread than reported."
        ]
        
        feedback_count = 0
        for issue in self.demo_issues:
            # Random number of feedbacks per issue
            num_feedbacks = random.randint(0, min(feedbacks_per_issue, len(self.demo_citizens)))
            commenters = random.sample(self.demo_citizens, num_feedbacks)
            
            for commenter in commenters:
                try:
                    message = random.choice(feedback_templates)
                    await self.civic_service.add_feedback(
                        citizen_id=commenter['citizen_id'],
                        issue_id=issue['issue_id'],
                        message=message
                    )
                    feedback_count += 1
                except Exception as e:
                    print(f"❌ Failed to create feedback: {e}")
        
        print(f"✅ Created {feedback_count} demo feedbacks")
    
    async def update_demo_issue_statuses(self):
        """Update some issues to different statuses"""
        print(f"🔄 Updating issue statuses...")
        
        statuses = ["In Progress", "Resolved"]
        updated_count = 0
        
        # Update random issues
        issues_to_update = random.sample(self.demo_issues, min(5, len(self.demo_issues)))
        
        for issue in issues_to_update:
            try:
                new_status = random.choice(statuses)
                await self.civic_service.update_issue_status(
                    issue['issue_id'],
                    new_status
                )
                updated_count += 1
                print(f"✅ Updated {issue['title']} to {new_status}")
            except Exception as e:
                print(f"❌ Failed to update issue status: {e}")
        
        print(f"✅ Updated {updated_count} issue statuses")
    
    async def generate_all_demo_data(self):
        """Generate complete demo dataset"""
        print("🚀 Generating Demo Data for Civic Participation App")
        print("=" * 60)
        
        await self.create_demo_citizens(5)
        await self.create_demo_issues(10)
        await self.create_demo_votes(4)
        await self.create_demo_feedbacks(3)
        await self.update_demo_issue_statuses()
        
        print("\n✅ Demo data generation complete!")
        print(f"📊 Summary:")
        print(f"   - Citizens: {len(self.demo_citizens)}")
        print(f"   - Issues: {len(self.demo_issues)}")
        print(f"   - Check Supabase dashboard to view live data")
    
    async def cleanup_demo_data(self):
        """Clean up demo data (use with caution)"""
        print("🧹 Cleaning up demo data...")
        
        # Note: This would require additional cleanup methods
        # For now, just print warning
        print("⚠️ Manual cleanup required in Supabase dashboard")
        print("   Go to Table Editor and delete demo records")

async def main():
    """Main function to run demo data generation"""
    generator = DemoDataGenerator()
    
    try:
        await generator.generate_all_demo_data()
    except Exception as e:
        print(f"❌ Demo data generation failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())