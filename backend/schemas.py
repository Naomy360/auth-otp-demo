from pydantic import BaseModel, EmailStr

class RequestOtpSchema(BaseModel):
    email: EmailStr

class VerifyOtpSchema(BaseModel):
    email: EmailStr
    otp: str
