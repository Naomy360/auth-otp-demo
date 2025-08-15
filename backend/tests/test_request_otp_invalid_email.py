def test_verify_otp_invalid(client):
    res = client.post("/verify-otp", json={"email": "invalid@example.com", "otp": "999999"})
    assert res.status_code == 400
    assert res.json()["detail"] == "Invalid OTP"
