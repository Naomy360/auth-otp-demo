from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from models import UserOTP
from utils import generate_otp, send_email_otp

def create_and_send_otp(db: Session, email: str):
    otp = generate_otp()
    expiry_time = datetime.utcnow() + timedelta(minutes=5)  # OTP valid for 5 min
    
    print(f"[DEBUG] Generated OTP for {email}: {otp} (expires at {expiry_time})")

    user_otp = db.query(UserOTP).filter(UserOTP.email == email).first()
    if user_otp:
        user_otp.otp = otp
        user_otp.expires_at = expiry_time
    else:
        user_otp = UserOTP(email=email, otp=otp, expires_at=expiry_time)
        db.add(user_otp)

    db.commit()
    send_email_otp(email, otp)

def verify_otp(db: Session, email: str, otp: str) -> bool:
    user_otp = db.query(UserOTP).filter(UserOTP.email == email, UserOTP.otp == otp).first()
    if not user_otp:
        print(f"[DEBUG] No OTP record found for {email} with OTP {otp}")
        return False
    if datetime.utcnow() > user_otp.expires_at:
        print(f"[DEBUG] OTP for {email} expired at {user_otp.expires_at}")
        return False
    print(f"[DEBUG] OTP for {email} verified successfully")
    return True

def store_otp(db: Session, email: str, otp_code: str, expires_at: datetime = None):
    """Stores OTP in the database (used by tests to pre-seed an OTP)."""
    if expires_at is None:
        expires_at = datetime.utcnow() + timedelta(minutes=5)

    user_otp = db.query(UserOTP).filter(UserOTP.email == email).first()
    if user_otp:
        user_otp.otp = otp_code
        user_otp.expires_at = expires_at
    else:
        user_otp = UserOTP(email=email, otp=otp_code, expires_at=expires_at)
        db.add(user_otp)

    db.commit()
