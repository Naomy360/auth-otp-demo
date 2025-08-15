from auth import otp as otp_service
from datetime import datetime, timedelta

def test_verify_otp_expired(client, db_session):
    email = "expired@example.com"
    otp_code = otp_service.generate_otp()
    otp_service.store_otp(db_session, email, otp_code, expires_at=datetime.utcnow() - timedelta(minutes=1))

    res = client.post("/verify-otp", json={"email": email, "otp": otp_code})
    assert res.status_code == 400
    assert res.json()["detail"] == "Invalid OTP"
