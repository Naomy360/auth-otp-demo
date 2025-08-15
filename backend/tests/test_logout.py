def test_logout(client):
    res = client.post("/logout")
    assert res.status_code == 200
    assert res.json()["message"] == "Logged out"
