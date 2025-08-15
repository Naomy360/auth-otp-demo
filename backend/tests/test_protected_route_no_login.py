def test_protected_route_no_login(client):
    res = client.get("/protected")
    assert res.status_code == 401
    assert res.json()["detail"] == "Not authenticated"
