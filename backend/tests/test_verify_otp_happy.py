from auth import otp as otp_service

def test_verify_otp_happy(client, db_session):
    email = "verify@example.com"
    otp_code = otp_service.generate_otp()
    otp_service.store_otp(db_session, email, otp_code)

    res = client.post("/verify-otp", json={"email": email, "otp": otp_code})
    assert res.status_code == 200
    data = res.json()
    assert data["message"] == "OTP verified"
    assert "set-cookie" in res.headers
