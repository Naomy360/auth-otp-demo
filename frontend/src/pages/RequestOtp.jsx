import React, { useState } from "react";
import { requestOtp } from "../api/authApi.js";

export default function RequestOtp({ setStep, setEmail }) {
  const [inputEmail, setInputEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestOtp(inputEmail);
      setEmail(inputEmail);
      setMessage("OTP sent! Check your email.");
      // Wait 1.2 seconds so user sees the success message
      setTimeout(() => {
        setStep(2);
      }, 1200);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Request OTP</h2>
      <input
        type="email"
        value={inputEmail}
        onChange={(e) => setInputEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send OTP"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
