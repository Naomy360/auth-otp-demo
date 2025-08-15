import React, { useState } from "react";
import RequestOtp from "./pages/RequestOtp";
import VerifyOtp from "./pages/VerifyOtp";
import ProtectedPage from "./pages/ProtectedPage";

export default function App() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);

  return (
    <div>
      {step === 1 && <RequestOtp setStep={setStep} setEmail={setEmail} />}
      {step === 2 && <VerifyOtp email={email} setStep={setStep} />}
      {step === 3 && <ProtectedPage setStep={setStep} />}
    </div>
  );
}
