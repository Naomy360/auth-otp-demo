from utils import create_jwt_token

def test_refresh_token(client):
    email = "refresh@example.com"
    refresh_token = create_jwt_token({"email": email}, days=7)

    client.cookies.set("refresh_token", refresh_token)
    res = client.post("/refresh-token")
    assert res.status_code == 200
    assert res.json()["message"] == "Token refreshed"
