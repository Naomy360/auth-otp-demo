// src/pages/VerifyOtp.jsx
import React, { useState } from "react";
import { verifyOtp } from "../api/authApi.js";

export default function VerifyOtp({ email, setStep }) {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(email, otp);
      setMessage("OTP verified! Redirecting...");
      setTimeout(() => setStep(3), 500); // Go to ProtectedPage
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Verify OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />
      <button type="submit">Verify</button>
      {message && <p>{message}</p>}
    </form>
  );
}
