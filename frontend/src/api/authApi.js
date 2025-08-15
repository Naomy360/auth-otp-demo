const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://backend:8000";

export async function requestOtp(email) {
  const res = await fetch(`${API_BASE_URL}/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include"
  });
  if (!res.ok) throw new Error((await res.json()).detail || `Error ${res.status}`);
  return res.json();
}

export async function verifyOtp(email, otp) {
  const res = await fetch(`${API_BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
    credentials: "include"
  });
  if (!res.ok) throw new Error((await res.json()).detail || `Error ${res.status}`);
  return res.json();
}

export async function refreshToken() {
  const res = await fetch(`${API_BASE_URL}/refresh-token`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to refresh token");
  return res.json();
}

export async function getProtectedData() {
  const res = await fetch(`${API_BASE_URL}/protected`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Not logged in");
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to log out");
  return res.json();
}

console.log("API base URL is:", import.meta.env.VITE_API_URL);
