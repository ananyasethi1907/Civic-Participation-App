from database import get_supabase_client
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json
import asyncio

class RealtimeService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.active_connections: Dict[str, List[WebSocket]] = {
            "admins": [],
            "citizens": []
        }
    
    async def connect_admin(self, websocket: WebSocket):
        """Connect admin for real-time issue updates"""
        await websocket.accept()
        self.active_connections["admins"].append(websocket)
        
        # Send initial data
        try:
            issues = self.supabase.table("issues").select("*").order("created_at", desc=True).limit(10).execute()
            await websocket.send_text(json.dumps({
                "type": "initial_issues",
                "data": issues.data
            }))
        except Exception as e:
            print(f"Error sending initial data: {e}")
    
    async def connect_citizen(self, websocket: WebSocket, citizen_id: str):
        """Connect citizen for status updates"""
        await websocket.accept()
        if citizen_id not in self.active_connections:
            self.active_connections[citizen_id] = []
        self.active_connections[citizen_id].append(websocket)
        
        # Send initial notifications
        try:
            notifications = self.supabase.table("notifications").select("*").eq("citizen_id", citizen_id).eq("is_read", False).execute()
            await websocket.send_text(json.dumps({
                "type": "initial_notifications",
                "data": notifications.data
            }))
        except Exception as e:
            print(f"Error sending initial notifications: {e}")
    
    async def disconnect(self, websocket: WebSocket):
        """Remove websocket from all connections"""
        for connection_type in self.active_connections:
            if isinstance(self.active_connections[connection_type], list):
                if websocket in self.active_connections[connection_type]:
                    self.active_connections[connection_type].remove(websocket)
    
    async def broadcast_new_issue(self, issue_data: dict):
        """Broadcast new issue to all admins"""
        message = json.dumps({
            "type": "new_issue",
            "data": issue_data
        })
        
        # Send to all admin connections
        for websocket in self.active_connections["admins"]:
            try:
                await websocket.send_text(message)
            except:
                # Remove broken connections
                self.active_connections["admins"].remove(websocket)
    
    async def notify_status_change(self, citizen_id: str, issue_data: dict):
        """Notify specific citizen about status change"""
        message = json.dumps({
            "type": "status_update",
            "data": issue_data
        })
        
        # Send to specific citizen
        if citizen_id in self.active_connections:
            for websocket in self.active_connections[citizen_id]:
                try:
                    await websocket.send_text(message)
                except:
                    # Remove broken connections
                    self.active_connections[citizen_id].remove(websocket)
    
    async def broadcast_vote_update(self, issue_id: str, vote_counts: dict):
        """Broadcast vote count updates"""
        message = json.dumps({
            "type": "vote_update",
            "issue_id": issue_id,
            "data": vote_counts
        })
        
        # Send to all connections
        all_connections = []
        all_connections.extend(self.active_connections["admins"])
        for citizen_connections in self.active_connections.values():
            if isinstance(citizen_connections, list):
                all_connections.extend(citizen_connections)
        
        for websocket in all_connections:
            try:
                await websocket.send_text(message)
            except:
                pass  # Ignore broken connections

# Initialize realtime service
realtime_service = RealtimeService()