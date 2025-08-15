from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import jwt
import os

import models, schemas
from database import engine, SessionLocal
from auth import otp as otp_service
from utils import create_jwt_token, get_current_user_from_cookie, SECRET_KEY

# Environment-based cookie settings
IS_PROD = os.getenv("ENV", "dev") == "prod"
COOKIE_SECURE = IS_PROD      # True in production, False locally
COOKIE_SAMESITE = "Strict" if IS_PROD else "Lax"

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://frontend:3000",
        "https://steady-macaron-535e2c.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/request-otp")
def request_otp(payload: schemas.RequestOtpSchema, db: Session = Depends(get_db)):
    otp_service.create_and_send_otp(db, payload.email)
    return {"message": "OTP sent"}

@app.post("/verify-otp")
def verify_otp(payload: schemas.VerifyOtpSchema, db: Session = Depends(get_db)):
    if otp_service.verify_otp(db, payload.email, payload.otp):
        access_token = create_jwt_token({"email": payload.email}, minutes=15)
        refresh_token = create_jwt_token({"email": payload.email}, days=7)
        
        response = JSONResponse({"message": "OTP verified"})
        # Access token cookie
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=15 * 60
        )
        # Refresh token cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=COOKIE_SECURE,
            samesite=COOKIE_SAMESITE,
            max_age=7 * 24 * 60 * 60
        )
        return response
    raise HTTPException(status_code=400, detail="Invalid OTP")

@app.post("/refresh-token")
def refresh_token(request: Request):
    refresh_token_cookie = request.cookies.get("refresh_token")
    if not refresh_token_cookie:
        raise HTTPException(status_code=401, detail="No refresh token found")

    try:
        payload = jwt.decode(refresh_token_cookie, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_jwt_token({"email": email}, minutes=15)
    response = JSONResponse({"message": "Token refreshed"})
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=15 * 60
    )
    return response

@app.post("/logout")
def logout():
    response = JSONResponse({"message": "Logged out"})
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response

@app.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user_from_cookie)):
    return {"message": f"Hello {current_user['email']}, you are logged in!"}
