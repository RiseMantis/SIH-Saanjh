from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Annotated

from app.db import get_db
from app.config import get_settings
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse

settings = get_settings()

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRY_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    result = await db.execute(text("SELECT * FROM users WHERE id = :id"), {"id": user_id})
    user = result.mappings().first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if email/phone exists
    if request.email:
        res = await db.execute(text("SELECT id FROM users WHERE email = :email"), {"email": request.email})
        if res.first():
            raise HTTPException(status_code=400, detail="Email already registered")
    if request.phone:
        res = await db.execute(text("SELECT id FROM users WHERE phone = :phone"), {"phone": request.phone})
        if res.first():
            raise HTTPException(status_code=400, detail="Phone already registered")
            
    hashed_password = get_password_hash(request.password)
    
    query = text("""
        INSERT INTO users (
            id, name, email, phone, password_hash, role, 
            village, district, state, craft_category, bio, 
            group_name, monthly_capacity, bulk_capable,
            trust_score, is_kyc_verified
        ) VALUES (
            gen_random_uuid(), :name, :email, :phone, :password_hash, :role,
            :village, :district, :state, :craft_category, :bio,
            :group_name, :monthly_capacity, :bulk_capable,
            100, false
        ) RETURNING id, role, name
    """)
    params = {
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "password_hash": hashed_password,
        "role": request.role,
        "village": request.village,
        "district": request.district,
        "state": request.state,
        "craft_category": request.craft_category,
        "bio": request.bio,
        "group_name": request.group_name,
        "monthly_capacity": request.monthly_capacity,
        "bulk_capable": request.bulk_capable
    }
    
    result = await db.execute(query, params)
    new_user = result.mappings().first()
    
    access_token = create_access_token(
        data={"sub": str(new_user["id"]), "role": new_user["role"], "name": new_user["name"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    if request.email:
        res = await db.execute(text("SELECT * FROM users WHERE email = :email"), {"email": request.email})
    else:
        res = await db.execute(text("SELECT * FROM users WHERE phone = :phone"), {"phone": request.phone})
        
    user = res.mappings().first()
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(
        data={"sub": str(user["id"]), "role": user["role"], "name": user["name"]}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: Annotated[dict, Depends(get_current_user)]):
    return current_user

@router.post("/mock-kyc")
async def mock_kyc(current_user: Annotated[dict, Depends(get_current_user)], db: AsyncSession = Depends(get_db)):
    await db.execute(
        text("UPDATE users SET is_kyc_verified = true WHERE id = :id"),
        {"id": current_user["id"]}
    )
    return {"message": "KYC verified successfully"}
