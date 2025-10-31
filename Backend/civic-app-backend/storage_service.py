import os
import uuid
from datetime import datetime
from fastapi import HTTPException, UploadFile
from database import get_supabase_client
from typing import Optional

class StorageService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.bucket_name = "issue_images"
    
    async def upload_issue_image(self, file: UploadFile, citizen_id: str) -> str:
        """Upload image to Supabase Storage and return public URL"""
        try:
            # Validate file type
            allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
            if file.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and WebP allowed")
            
            # Validate file size (5MB max)
            file_content = await file.read()
            if len(file_content) > 5 * 1024 * 1024:  # 5MB
                raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB")
            
            # Generate unique filename
            file_extension = file.filename.split('.')[-1].lower()
            unique_filename = f"{citizen_id}/{uuid.uuid4()}.{file_extension}"
            
            # Upload to Supabase Storage
            response = self.supabase.storage.from_(self.bucket_name).upload(
                path=unique_filename,
                file=file_content,
                file_options={"content-type": file.content_type}
            )
            
            if response.status_code == 200:
                # Get public URL
                public_url = self.supabase.storage.from_(self.bucket_name).get_public_url(unique_filename)
                return public_url
            else:
                raise HTTPException(status_code=400, detail="Failed to upload image")
                
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    
    async def delete_issue_image(self, image_url: str, citizen_id: str) -> bool:
        """Delete image from Supabase Storage"""
        try:
            # Extract filename from URL
            filename = image_url.split('/')[-1]
            file_path = f"{citizen_id}/{filename}"
            
            response = self.supabase.storage.from_(self.bucket_name).remove([file_path])
            return response.status_code == 200
            
        except Exception as e:
            print(f"Failed to delete image: {e}")
            return False
    
    def get_image_url(self, file_path: str) -> str:
        """Get public URL for an image"""
        return self.supabase.storage.from_(self.bucket_name).get_public_url(file_path)

# Initialize storage service
storage_service = StorageService()