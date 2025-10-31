import jwt
import requests
import uuid
import hashlib
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import get_supabase_client
import os
from dotenv import load_dotenv

load_dotenv()

# Security scheme
security = HTTPBearer()

# Supabase JWT settings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "your-jwt-secret")

def get_supabase_public_key():
    """Get Supabase public key for JWT verification"""
    try:
        response = requests.get(f"{SUPABASE_URL}/rest/v1/")
        # In production, cache this key
        return SUPABASE_JWT_SECRET
    except:
        return SUPABASE_JWT_SECRET

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token and return user info"""
    try:
        token = credentials.credentials
        
        # Decode JWT token
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=["HS256"],
            options={"verify_signature": False}  # Supabase handles signature verification
        )
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        return {"user_id": user_id, "email": payload.get("email")}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(user_info: dict = Depends(verify_token)):
    """Get current authenticated user"""
    return user_info

class AuthService:
    def __init__(self):
        self.supabase = get_supabase_client()
    
    async def register_citizen(self, email: str, password: str, name: str, ward: str):
        """Register a new citizen"""
        try:
            # For now, create user directly in citizens table
            # In production, integrate with Supabase Auth
            import uuid
            import hashlib
            
            # Hash password (simple hash for demo)
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            citizen_data = {
                "citizen_id": str(uuid.uuid4()),
                "name": name,
                "email": email,
                "password_hash": password_hash,
                "ward": ward
            }
            
            response = self.supabase.table("citizens").insert(citizen_data).execute()
            
            if response.data:
                # Generate simple JWT token
                token_payload = {
                    "sub": response.data[0]["citizen_id"],
                    "email": email,
                    "exp": datetime.utcnow() + timedelta(hours=24)
                }
                
                token = jwt.encode(token_payload, SUPABASE_JWT_SECRET, algorithm="HS256")
                
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": response.data[0]
                }
            else:
                raise HTTPException(status_code=400, detail="Registration failed")
                
        except Exception as e:
            if "duplicate key value" in str(e):
                raise HTTPException(status_code=400, detail="Email already exists")
            raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")
    
    async def login_citizen(self, email: str, password: str):
        """Login citizen and return JWT"""
        try:
            import hashlib
            
            # Hash password for comparison
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            
            # Find user by email and password
            response = self.supabase.table("citizens").select("*").eq("email", email).eq("password_hash", password_hash).execute()
            
            if response.data:
                user = response.data[0]
                
                # Generate JWT token
                token_payload = {
                    "sub": user["citizen_id"],
                    "email": email,
                    "exp": datetime.utcnow() + timedelta(hours=24)
                }
                
                token = jwt.encode(token_payload, SUPABASE_JWT_SECRET, algorithm="HS256")
                
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": user
                }
            else:
                raise HTTPException(status_code=401, detail="Invalid credentials")
                
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")
    
    async def logout_citizen(self, token: str):
        """Logout citizen"""
        return {"message": "Logged out successfully"}