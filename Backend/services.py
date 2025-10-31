from database import get_supabase_client
from fastapi import HTTPException
from typing import List, Dict, Optional
import uuid

class CivicService:
    def __init__(self):
        self.supabase = get_supabase_client()

    # CITIZENS CRUD
    async def get_citizen_by_id(self, citizen_id: str) -> Dict:
        """Get citizen by ID"""
        try:
            response = self.supabase.table("citizens").select("*").eq("citizen_id", citizen_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Citizen not found")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error fetching citizen: {str(e)}")

    async def update_citizen_profile(self, citizen_id: str, name: str = None, ward: str = None) -> Dict:
        """Update citizen profile"""
        try:
            update_data = {}
            if name:
                update_data["name"] = name
            if ward:
                update_data["ward"] = ward
                
            response = self.supabase.table("citizens").update(update_data).eq("citizen_id", citizen_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Citizen not found")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating citizen: {str(e)}")

    # ISSUES CRUD
    async def get_all_issues(self, limit: int = 50, offset: int = 0) -> List[Dict]:
        """Get all issues with pagination"""
        try:
            response = self.supabase.table("issues").select("*").range(offset, offset + limit - 1).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error fetching issues: {str(e)}")

    async def get_issue_by_id(self, issue_id: str) -> Dict:
        """Get issue by ID"""
        try:
            response = self.supabase.table("issues").select("*").eq("issue_id", issue_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Issue not found")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error fetching issue: {str(e)}")

    async def create_issue(self, title: str, description: str, category: str, created_by: str, 
                          location: str = None, image_url: str = None) -> Dict:
        """Create new issue"""
        try:
            issue_data = {
                "title": title,
                "description": description,
                "category": category,
                "created_by": created_by,
                "location": location,
                "image_url": image_url
            }
            
            response = self.supabase.table("issues").insert(issue_data).execute()
            if not response.data:
                raise HTTPException(status_code=400, detail="Failed to create issue")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating issue: {str(e)}")

    async def update_issue_status(self, issue_id: str, status: str, updated_by: str = None) -> Dict:
        """Update issue status"""
        try:
            # Validate status
            valid_statuses = ["Pending", "In Progress", "Resolved"]
            if status not in valid_statuses:
                raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
            
            response = self.supabase.table("issues").update({"status": status}).eq("issue_id", issue_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Issue not found")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating issue status: {str(e)}")

    async def get_issues_by_category(self, category: str) -> List[Dict]:
        """Get issues by category"""
        try:
            response = self.supabase.table("issues").select("*").eq("category", category).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error fetching issues by category: {str(e)}")

    async def get_issues_by_status(self, status: str) -> List[Dict]:
        """Get issues by status"""
        try:
            response = self.supabase.table("issues").select("*").eq("status", status).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error fetching issues by status: {str(e)}")

    # VOTES CRUD
    async def cast_vote(self, issue_id: str, citizen_id: str, vote_type: str) -> Dict:
        """Cast vote on an issue"""
        try:
            # Validate vote type
            if vote_type not in ["Upvote", "Downvote"]:
                raise HTTPException(status_code=400, detail="Vote type must be 'Upvote' or 'Downvote'")
            
            # Check if issue exists
            issue = await self.get_issue_by_id(issue_id)
            
            # Check for existing vote
            existing_vote = self.supabase.table("votes").select("*").eq("issue_id", issue_id).eq("citizen_id", citizen_id).execute()
            
            if existing_vote.data:
                # Update existing vote
                response = self.supabase.table("votes").update({"vote_type": vote_type}).eq("issue_id", issue_id).eq("citizen_id", citizen_id).execute()
                return {"message": "Vote updated", "vote": response.data[0]}
            else:
                # Create new vote
                vote_data = {
                    "issue_id": issue_id,
                    "citizen_id": citizen_id,
                    "vote_type": vote_type
                }
                response = self.supabase.table("votes").insert(vote_data).execute()
                return {"message": "Vote cast successfully", "vote": response.data[0]}
                
        except HTTPException:
            raise
        except Exception as e:
            if "duplicate key value violates unique constraint" in str(e):
                raise HTTPException(status_code=409, detail="You have already voted on this issue")
            raise HTTPException(status_code=400, detail=f"Error casting vote: {str(e)}")

    async def get_vote_counts(self, issue_id: str) -> Dict:
        """Get vote counts for an issue"""
        try:
            response = self.supabase.table("votes").select("vote_type").eq("issue_id", issue_id).execute()
            
            upvotes = len([v for v in response.data if v["vote_type"] == "Upvote"])
            downvotes = len([v for v in response.data if v["vote_type"] == "Downvote"])
            
            return {
                "issue_id": issue_id,
                "upvotes": upvotes,
                "downvotes": downvotes,
                "total_votes": upvotes + downvotes
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error getting vote counts: {str(e)}")

    async def remove_vote(self, issue_id: str, citizen_id: str) -> Dict:
        """Remove vote from an issue"""
        try:
            response = self.supabase.table("votes").delete().eq("issue_id", issue_id).eq("citizen_id", citizen_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Vote not found")
            return {"message": "Vote removed successfully"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error removing vote: {str(e)}")

    # FEEDBACKS CRUD
    async def add_feedback(self, citizen_id: str, issue_id: str, message: str) -> Dict:
        """Add feedback to an issue"""
        try:
            # Check if issue exists
            await self.get_issue_by_id(issue_id)
            
            feedback_data = {
                "citizen_id": citizen_id,
                "issue_id": issue_id,
                "message": message
            }
            
            response = self.supabase.table("feedbacks").insert(feedback_data).execute()
            if not response.data:
                raise HTTPException(status_code=400, detail="Failed to add feedback")
            return response.data[0]
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error adding feedback: {str(e)}")

    async def get_issue_feedbacks(self, issue_id: str) -> List[Dict]:
        """Get all feedbacks for an issue"""
        try:
            response = self.supabase.table("feedbacks").select("*, citizens(name)").eq("issue_id", issue_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error fetching feedbacks: {str(e)}")

    async def update_feedback(self, feedback_id: str, message: str, citizen_id: str) -> Dict:
        """Update feedback (only by the author)"""
        try:
            response = self.supabase.table("feedbacks").update({"message": message}).eq("feedback_id", feedback_id).eq("citizen_id", citizen_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Feedback not found or unauthorized")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error updating feedback: {str(e)}")

    async def delete_feedback(self, feedback_id: str, citizen_id: str) -> Dict:
        """Delete feedback (only by the author)"""
        try:
            response = self.supabase.table("feedbacks").delete().eq("feedback_id", feedback_id).eq("citizen_id", citizen_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Feedback not found or unauthorized")
            return {"message": "Feedback deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error deleting feedback: {str(e)}")

    # NOTIFICATIONS CRUD
    async def create_notification(self, citizen_id: str, message: str) -> Dict:
        """Create notification for a citizen"""
        try:
            notification_data = {
                "citizen_id": citizen_id,
                "message": message
            }
            
            response = self.supabase.table("notifications").insert(notification_data).execute()
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error creating notification: {str(e)}")

    async def get_citizen_notifications(self, citizen_id: str, unread_only: bool = False) -> List[Dict]:
        """Get notifications for a citizen"""
        try:
            query = self.supabase.table("notifications").select("*").eq("citizen_id", citizen_id)
            
            if unread_only:
                query = query.eq("is_read", False)
                
            response = query.order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error fetching notifications: {str(e)}")

    async def mark_notification_read(self, notification_id: str, citizen_id: str) -> Dict:
        """Mark notification as read"""
        try:
            response = self.supabase.table("notifications").update({"is_read": True}).eq("notification_id", notification_id).eq("citizen_id", citizen_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Notification not found")
            return response.data[0]
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error marking notification as read: {str(e)}")

# Initialize service
civic_service = CivicService()