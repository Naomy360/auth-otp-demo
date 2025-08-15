import React, { useState } from "react";

const OtpForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const requestOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      setStep(2);
      setMessage("OTP sent! Please check your email.");
    } catch (err) {
      setMessage(`Failed to send OTP: ${err.message}`);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      setMessage("OTP verified! You are logged in.");
    } catch (err) {
      setMessage(`Verification failed: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      {step === 1 && (
        <form onSubmit={requestOtp}>
          <h2>Request OTP</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifyOtp}>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify</button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default OtpForm;
