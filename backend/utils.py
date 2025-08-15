import os
import smtplib
import random
import jwt
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from dotenv import load_dotenv
from fastapi import HTTPException, Request, status

load_dotenv()

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  # Store in .env
ALGORITHM = "HS256"

# ---------- OTP ----------
def generate_otp(length: int = 6) -> str:
    return ''.join(str(random.randint(0, 9)) for _ in range(length))

def send_email_otp(email: str, otp: str):
    subject = "Your OTP Code"
    body = f"Your OTP code is: {otp}\nIt expires in 5 minutes."

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, email, msg.as_string())
        print(f"[INFO] OTP email sent to {email}")
    except Exception as e:
        print(f"[ERROR] Failed to send OTP email: {e}")

# ---------- JWT ----------
def create_jwt_token(data: dict, minutes: int = None, days: int = None):
    """Create a JWT token with either minutes or days expiration."""
    to_encode = data.copy()

    if days:
        expire = datetime.utcnow() + timedelta(days=days)
    elif minutes:
        expire = datetime.utcnow() + timedelta(minutes=minutes)
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)  # default

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user_from_cookie(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # contains email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
