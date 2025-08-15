import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import VerifyOtp from "../pages/VerifyOtp";
import * as authApi from "../api/authApi";

vi.mock("../api/authApi");

describe("VerifyOtp Page", () => {
  it("should verify OTP successfully", async () => {
    const setStepMock = vi.fn();
    authApi.verifyOtp.mockResolvedValue({ message: "OTP verified" });

    render(<VerifyOtp email="test@example.com" setStep={setStepMock} setEmail={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/enter otp/i), {
      target: { value: "123456" }
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /verify/i })).toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    await waitFor(() => {
      expect(authApi.verifyOtp).toHaveBeenCalledWith("test@example.com", "123456");
      expect(screen.getByText(/otp verified/i)).toBeInTheDocument();
      expect(setStepMock).toHaveBeenCalledWith(3);
    });
  });

  it("should show error on wrong OTP", async () => {
    authApi.verifyOtp.mockRejectedValue(new Error("Invalid OTP"));

    render(<VerifyOtp email="test@example.com" setStep={vi.fn()} setEmail={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/enter otp/i), {
      target: { value: "999999" }
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /verify/i })).toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: /verify/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid otp/i)).toBeInTheDocument();
    });
  });
});
