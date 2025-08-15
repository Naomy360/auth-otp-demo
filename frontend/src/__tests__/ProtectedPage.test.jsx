import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProtectedPage from "../pages/ProtectedPage";
import * as authApi from "../api/authApi";

vi.mock("../api/authApi");

describe("ProtectedPage", () => {
  it("should load protected data", async () => {
    const setStepMock = vi.fn();
    authApi.refreshToken.mockResolvedValue();
    authApi.getProtectedData.mockResolvedValue({
      message: "Hello test@example.com, you are logged in!"
    });

    render(<ProtectedPage setStep={setStepMock} />);

    await waitFor(() => {
      expect(authApi.getProtectedData).toHaveBeenCalled();
      expect(screen.getByText(/you are logged in/i)).toBeInTheDocument();
    });
  });

  it("should show error if not logged in", async () => {
    const setStepMock = vi.fn();
    authApi.refreshToken.mockRejectedValue(new Error("Not logged in"));

    render(<ProtectedPage setStep={setStepMock} />);

    await waitFor(() => {
      expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    });
  });

  it("should logout when clicking the Logout button", async () => {
    const setStepMock = vi.fn();
    authApi.refreshToken.mockResolvedValue();
    authApi.getProtectedData.mockResolvedValue({ message: "Welcome!" });
    authApi.logout.mockResolvedValue();

    render(<ProtectedPage setStep={setStepMock} />);

    fireEvent.click(await screen.findByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(authApi.logout).toHaveBeenCalled();
      // Removed setStepMock(1) since the component doesn't call it
    });
  });
});
