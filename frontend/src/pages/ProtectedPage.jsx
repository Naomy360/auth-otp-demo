// src/pages/ProtectedPage.jsx
import React, { useEffect, useState } from "react";
import { getProtectedData, refreshToken, logout } from "../api/authApi.js";

const REFRESH_INTERVAL_MINUTES = parseInt(
  import.meta.env.VITE_REFRESH_INTERVAL_MINUTES || "5",
  10
);

export default function ProtectedPage({ setStep }) {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    let refreshInterval;

    async function init() {
      try {
        await refreshToken();
        const data = await getProtectedData();
        setMessage(data.message);

        refreshInterval = setInterval(async () => {
          try {
            await refreshToken();
            console.log("Token refreshed automatically");
          } catch {
            console.warn("Token refresh failed, logging out...");
            await logout();
            setStep(1);
          }
        }, REFRESH_INTERVAL_MINUTES * 60 * 1000);
      } catch {
        setMessage("Not logged in.");
        setTimeout(() => setStep(1), 1000);
      }
    }

    init();
    return () => refreshInterval && clearInterval(refreshInterval);
  }, [setStep]);

  const handleLogout = async () => {
    try {
      await logout();
      setMessage("Logged out.");
      setTimeout(() => setStep(1), 1000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>{message}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
