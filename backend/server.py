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
    return {"message": "Rise Gum API - Ready to energize India!"}

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

# Rise Gum Waitlist Endpoints
@api_router.post("/waitlist", response_model=WaitlistResponse)
async def add_to_waitlist(entry: WaitlistEntryCreate):
    try:
        # Check if email already exists
        existing_entry = await db.waitlist_entries.find_one({"email": entry.email.lower()})
        if existing_entry:
            raise HTTPException(
                status_code=409, 
                detail="Email already registered in waitlist"
            )
        
        # Create new waitlist entry
        waitlist_data = {
            "name": entry.name,
            "email": entry.email.lower(),
            "city": entry.city,
            "timestamp": datetime.utcnow(),
            "status": "pending",
            "source": "landing_page"
        }
        
        # Insert into database
        result = await db.waitlist_entries.insert_one(waitlist_data)
        
        # Prepare response
        waitlist_entry = WaitlistEntry(
            id=str(result.inserted_id),
            **waitlist_data
        )
        
        logger.info(f"New waitlist entry: {entry.email} from {entry.city}")
        
        return WaitlistResponse(
            success=True,
            data=waitlist_entry,
            message="Successfully added to waitlist! We'll notify you when Rise Gum launches."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding waitlist entry: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error. Please try again later."
        )

@api_router.get("/waitlist", response_model=WaitlistListResponse)
async def get_waitlist_entries(skip: int = 0, limit: int = 100):
    try:
        # Get total count
        total_count = await db.waitlist_entries.count_documents({})
        
        # Get entries with pagination
        cursor = db.waitlist_entries.find({}).sort("timestamp", -1).skip(skip).limit(limit)
        entries = await cursor.to_list(length=limit)
        
        # Convert to response format
        waitlist_entries = []
        for entry in entries:
            waitlist_entry = WaitlistEntry(
                id=str(entry["_id"]),
                name=entry["name"],
                email=entry["email"],
                city=entry["city"],
                timestamp=entry["timestamp"],
                status=entry.get("status", "pending"),
                source=entry.get("source", "landing_page")
            )
            waitlist_entries.append(waitlist_entry)
        
        return WaitlistListResponse(
            success=True,
            data=waitlist_entries,
            count=total_count
        )
        
    except Exception as e:
        logger.error(f"Error fetching waitlist entries: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )

@api_router.get("/content", response_model=ContentResponse)
async def get_static_content():
    """Serve static content for the landing page"""
    content_data = {
        "testimonials": [
            {
                "id": 1,
                "name": "Arjun Sharma",
                "role": "Engineering Student, IIT Delhi",
                "city": "Delhi",
                "quote": "Finally, energy without the sugar crash! Perfect for those late-night study sessions.",
                "rating": 5
            },
            {
                "id": 2,
                "name": "Priya Patel",
                "role": "Medical Student",
                "city": "Mumbai", 
                "quote": "As a med student, I need clean energy. Rise Gum is a game-changer!",
                "rating": 5
            },
            {
                "id": 3,
                "name": "Rohan Gupta",
                "role": "Software Developer",
                "city": "Bangalore",
                "quote": "Convenient and effective. No more coffee stains on my laptop!",
                "rating": 5
            }
        ],
        "socialProofStats": {
            "interestedStudents": 1247,
            "universities": 15,
            "cities": 8,
            "growthRate": "+12% weekly"
        },
        "productBenefits": [
            {
                "id": 1,
                "title": "Sugar-Free & Healthy",
                "description": "Zero sugar, zero calories. All the energy, none of the crash.",
                "icon": "Heart"
            },
            {
                "id": 2,
                "title": "Pocket-Sized Convenience", 
                "description": "Fits anywhere. Perfect for exams, meetings, or long commutes.",
                "icon": "Zap"
            },
            {
                "id": 3,
                "title": "Fast-Acting Energy",
                "description": "Energy in seconds, not minutes. Powered by natural caffeine.",
                "icon": "Clock"
            }
        ],
        "problemPoints": [
            {
                "id": 1,
                "title": "Sugary Energy Drinks",
                "description": "High sugar, crashes, unhealthy",
                "icon": "X",
                "type": "problem"
            },
            {
                "id": 2,
                "title": "Regular Gum",
                "description": "No energy boost, just flavor",
                "icon": "Minus", 
                "type": "neutral"
            },
            {
                "id": 3,
                "title": "Rise Gum",
                "description": "Clean energy, sugar-free, convenient",
                "icon": "CheckCircle",
                "type": "solution"
            }
        ],
        "socialLinks": [
            {"platform": "Instagram", "icon": "Instagram", "url": "#"},
            {"platform": "Twitter", "icon": "Twitter", "url": "#"},
            {"platform": "LinkedIn", "icon": "Linkedin", "url": "#"},
            {"platform": "WhatsApp", "icon": "MessageCircle", "url": "#"}
        ],
        "contactInfo": {
            "email": "hello@risegum.in",
            "phone": "+91-9999-RISE-GUM",
            "address": "Coming to campuses near you"
        }
    }
    
    return ContentResponse(
        success=True,
        data=content_data
    )

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler for validation errors
@app.exception_handler(422)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Validation failed",
            "details": [{"field": error["loc"][-1], "message": error["msg"]} for error in exc.errors()]
        }
    )

# Global exception handler for HTTP exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "message": "Request failed"
        }
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
