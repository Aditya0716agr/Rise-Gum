from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional
import uuid
from datetime import datetime
import re


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Rise Gum Waitlist Models
class WaitlistEntryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Full name")
    email: EmailStr = Field(..., description="Valid email address")
    city: str = Field(..., min_length=1, max_length=50, description="City name")
    
    @validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        # Remove extra whitespace
        v = re.sub(r'\s+', ' ', v.strip())
        # Check for valid characters (letters, spaces, hyphens, apostrophes)
        if not re.match(r"^[a-zA-Z\s'-]+$", v):
            raise ValueError('Name can only contain letters, spaces, hyphens, and apostrophes')
        return v
    
    @validator('city')
    def validate_city(cls, v):
        if not v or not v.strip():
            raise ValueError('City cannot be empty')
        # Remove extra whitespace
        v = re.sub(r'\s+', ' ', v.strip())
        # Check for valid characters
        if not re.match(r"^[a-zA-Z\s'-]+$", v):
            raise ValueError('City name can only contain letters, spaces, hyphens, and apostrophes')
        return v

class WaitlistEntry(BaseModel):
    id: str
    name: str
    email: str
    city: str
    timestamp: datetime
    status: str = "pending"
    source: str = "landing_page"

class WaitlistResponse(BaseModel):
    success: bool
    data: Optional[WaitlistEntry] = None
    message: str
    error: Optional[str] = None

class WaitlistListResponse(BaseModel):
    success: bool
    data: List[WaitlistEntry]
    count: int

# Static content models
class ContentResponse(BaseModel):
    success: bool
    data: dict

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
