def test_request_otp_happy(client):
    payload = {"email": "test@example.com"}
    res = client.post("/request-otp", json=payload)
    assert res.status_code == 200
    assert res.json()["message"] == "OTP sent"
