from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SECRET_KEY = os.environ.get('SECRET_KEY', 'yoga-wellness-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    profile_image: Optional[str] = "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
    is_premium: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class Trainer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    bio: str
    image: str
    specialization: str

class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    trainer_id: str
    trainer_name: str
    trainer_image: str
    category: str
    duration: int
    description: str
    image: str
    video_url: Optional[str] = None

class Program(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image: str
    duration_days: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    category: str
    sessions_count: int

class UserProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: Optional[str] = None
    program_id: Optional[str] = None
    completed: bool = False
    completed_at: Optional[str] = None
    progress_percentage: int = 0

@api_router.post("/auth/signup", response_model=TokenResponse)
async def signup(user_input: UserCreate):
    existing_user = await db.users.find_one({"email": user_input.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user_input.password)
    user = User(email=user_input.email, name=user_input.name)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    access_token = create_access_token({"sub": user.id})
    user_response = User(**{k: v for k, v in user_dict.items() if k != "password"})
    return TokenResponse(access_token=access_token, user=user_response)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(user_input: UserLogin):
    user = await db.users.find_one({"email": user_input.email}, {"_id": 0})
    if not user or not verify_password(user_input.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": user["id"]})
    user_response = User(**{k: v for k, v in user.items() if k != "password"})
    return TokenResponse(access_token=access_token, user=user_response)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    return User(**current_user)

@api_router.get("/trainers", response_model=List[Trainer])
async def get_trainers():
    trainers = await db.trainers.find({}, {"_id": 0}).to_list(100)
    return trainers

@api_router.get("/sessions", response_model=List[Session])
async def get_sessions(category: Optional[str] = None):
    query = {"category": category} if category else {}
    sessions = await db.sessions.find(query, {"_id": 0}).to_list(100)
    return sessions

@api_router.get("/sessions/{session_id}", response_model=Session)
async def get_session(session_id: str):
    session = await db.sessions.find_one({"id": session_id}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@api_router.get("/programs", response_model=List[Program])
async def get_programs():
    programs = await db.programs.find({}, {"_id": 0}).to_list(100)
    return programs

@api_router.get("/programs/{program_id}", response_model=Program)
async def get_program(program_id: str):
    program = await db.programs.find_one({"id": program_id}, {"_id": 0})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program

@api_router.get("/progress", response_model=List[UserProgress])
async def get_user_progress(current_user: dict = Depends(get_current_user)):
    progress = await db.progress.find({"user_id": current_user["id"]}, {"_id": 0}).to_list(100)
    return progress

class ProgressUpdate(BaseModel):
    session_id: Optional[str] = None
    program_id: Optional[str] = None
    completed: bool = False
    progress_percentage: int = 0

@api_router.post("/progress", response_model=UserProgress)
async def update_progress(progress_input: ProgressUpdate, current_user: dict = Depends(get_current_user)):
    progress = UserProgress(
        user_id=current_user["id"],
        session_id=progress_input.session_id,
        program_id=progress_input.program_id,
        completed=progress_input.completed,
        completed_at=datetime.now(timezone.utc).isoformat() if progress_input.completed else None,
        progress_percentage=progress_input.progress_percentage
    )
    
    progress_dict = progress.model_dump()
    await db.progress.insert_one(progress_dict)
    return progress

@api_router.post("/seed")
async def seed_data():
    trainers_count = await db.trainers.count_documents({})
    if trainers_count > 0:
        return {"message": "Data already seeded"}
    
    trainers = [
        {
            "id": "trainer-1",
            "name": "David John",
            "bio": "Mindfulness meditation expert with 10+ years of experience",
            "image": "https://images.unsplash.com/photo-1662302392561-b1deecd3579d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "specialization": "Meditation"
        },
        {
            "id": "trainer-2",
            "name": "Lisa Mary",
            "bio": "Vinyasa flow yoga instructor passionate about holistic wellness",
            "image": "https://images.unsplash.com/photo-1755549476788-efd8bf819561?crop=entropy&cs=srgb&fm=jpg&q=85",
            "specialization": "Yoga"
        },
        {
            "id": "trainer-3",
            "name": "Sarah Chen",
            "bio": "Sleep meditation specialist helping people achieve better rest",
            "image": "https://images.unsplash.com/photo-1638244398513-17b778d24efe?crop=entropy&cs=srgb&fm=jpg&q=85",
            "specialization": "Sleep"
        }
    ]
    
    sessions = [
        {
            "id": "session-1",
            "title": "Mindfulness Meditation",
            "trainer_id": "trainer-1",
            "trainer_name": "David John",
            "trainer_image": "https://images.unsplash.com/photo-1662302392561-b1deecd3579d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Meditation",
            "duration": 20,
            "description": "A calming mindfulness meditation session to center your thoughts",
            "image": "https://images.unsplash.com/photo-1662302392561-b1deecd3579d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "video_url": "https://example.com/meditation-video"
        },
        {
            "id": "session-2",
            "title": "Vinyasa Flow Yoga",
            "trainer_id": "trainer-2",
            "trainer_name": "Lisa Mary",
            "trainer_image": "https://images.unsplash.com/photo-1755549476788-efd8bf819561?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Yoga",
            "duration": 45,
            "description": "Dynamic flowing yoga sequence to energize your body",
            "image": "https://images.unsplash.com/photo-1755549476788-efd8bf819561?crop=entropy&cs=srgb&fm=jpg&q=85",
            "video_url": "https://example.com/yoga-video"
        },
        {
            "id": "session-3",
            "title": "Deep Sleep Journey",
            "trainer_id": "trainer-3",
            "trainer_name": "Sarah Chen",
            "trainer_image": "https://images.unsplash.com/photo-1638244398513-17b778d24efe?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Sleep",
            "duration": 30,
            "description": "Guided sleep meditation for deep, restful sleep",
            "image": "https://images.unsplash.com/photo-1638244398513-17b778d24efe?crop=entropy&cs=srgb&fm=jpg&q=85",
            "video_url": "https://example.com/sleep-video"
        },
        {
            "id": "session-4",
            "title": "Morning Stretch Flow",
            "trainer_id": "trainer-2",
            "trainer_name": "Lisa Mary",
            "trainer_image": "https://images.unsplash.com/photo-1755549476788-efd8bf819561?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Yoga",
            "duration": 15,
            "description": "Gentle morning yoga to wake up your body",
            "image": "https://images.unsplash.com/photo-1660171465646-23a749459e74?crop=entropy&cs=srgb&fm=jpg&q=85",
            "video_url": "https://example.com/morning-yoga"
        },
        {
            "id": "session-5",
            "title": "Breathing Basics",
            "trainer_id": "trainer-1",
            "trainer_name": "David John",
            "trainer_image": "https://images.unsplash.com/photo-1662302392561-b1deecd3579d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "category": "Meditation",
            "duration": 10,
            "description": "Learn fundamental breathing techniques for relaxation",
            "image": "https://images.unsplash.com/photo-1662302392561-b1deecd3579d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "video_url": "https://example.com/breathing"
        }
    ]
    
    programs = [
        {
            "id": "program-1",
            "title": "10-Day Yoga Workshop",
            "description": "Complete yoga foundation program for beginners",
            "image": "https://images.unsplash.com/photo-1660171465646-23a749459e74?crop=entropy&cs=srgb&fm=jpg&q=85",
            "duration_days": 10,
            "start_date": "2026-04-09",
            "end_date": "2026-04-19",
            "category": "Yoga",
            "sessions_count": 10
        },
        {
            "id": "program-2",
            "title": "Relax with Yin Yoga",
            "description": "Slow-paced, gentle yoga for deep relaxation",
            "image": "https://images.pexels.com/photos/3823040/pexels-photo-3823040.jpeg",
            "duration_days": 7,
            "category": "Yoga",
            "sessions_count": 7
        },
        {
            "id": "program-3",
            "title": "Vinyasa Flow Challenge",
            "description": "21-day challenge to master dynamic flow sequences",
            "image": "https://images.unsplash.com/photo-1660171465646-23a749459e74?crop=entropy&cs=srgb&fm=jpg&q=85",
            "duration_days": 21,
            "category": "Yoga",
            "sessions_count": 21
        },
        {
            "id": "program-4",
            "title": "Meditation Mastery",
            "description": "14-day meditation intensive for inner peace",
            "image": "https://images.unsplash.com/photo-1729886484969-188f0d7f196c?crop=entropy&cs=srgb&fm=jpg&q=85",
            "duration_days": 14,
            "category": "Meditation",
            "sessions_count": 14
        }
    ]
    
    await db.trainers.insert_many(trainers)
    await db.sessions.insert_many(sessions)
    await db.programs.insert_many(programs)
    
    return {"message": "Demo data seeded successfully"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()