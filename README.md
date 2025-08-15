
# Auth + OTP Demo

A secure **email-based One-Time Password (OTP)** authentication app with backend and frontend integration.
Handles OTP generation, email delivery, verification, JWT authentication, and protected routes.

---


## Features



* **Request OTP** via email
* **Verify OTP** with automatic login
* **JWT-based authentication** with refresh tokens
* **Secure cookies** (`HttpOnly`, `Secure`, `SameSite`)
* **Protected routes** only accessible after login
* **Logout** to clear authentication cookies
* **Environment-based settings** for dev and prod

---

## QA & Testing Approach

### QA Methodologies Applied

* Functional testing for OTP and login flow
* Negative testing for wrong or expired OTPs
* Regression testing after backend/frontend changes
* Security validation for token expiry and cookie handling

### Development Practices

* Git/GitHub for version control
* `.gitignore` to exclude `.env` and local DB
* Clean, modular code for backend (FastAPI) and frontend (React)

### Scripting & Automation

* Python test scripts for OTP logic in isolation
* Postman API tests for:

  * OTP request/verify
  * Token refresh
  * Logout
* Ready for pytest integration

### Web Concepts Implemented

* RESTful APIs with JSON
* CORS configuration for cross-origin cookie support
* Correct HTTP status code usage

---

## Test Plan Summary

| Test Case                 | Type        | Expected Result                        |
| ------------------------- | ----------- | -------------------------------------- |
| Request OTP (valid email) | Functional  | OTP email received within 5s           |
| Request OTP (invalid)     | Validation  | Error: invalid email format            |
| Verify OTP (correct)      | Functional  | Cookies set, user authenticated        |
| Verify OTP (wrong)        | Negative    | Error: "Invalid OTP"                   |
| OTP Expiry Test           | Negative    | Error after 5 min                      |
| Protected Route Access    | Security    | Only works if logged in                |
| Logout                    | Functional  | Clears cookies, blocks protected route |
| Token Refresh             | Integration | New access token issued                |

<img width="943" height="259" alt="Screenshot 2025-08-14 at 7 31 41 PM" src="https://github.com/user-attachments/assets/72914d76-9f73-4457-8b2c-dc76cab73d7a" />


---

## Tech Stack

| Layer    | Tech                              |
| -------- | --------------------------------- |
| Backend  | FastAPI, SQLAlchemy, JWT, smtplib |
| Frontend | React (Vite), Fetch API           |
| Hosting  | Render (API), Netlify (UI)        |
| Email    | Gmail SMTP + App Password         |
| Database | SQLite (dev) / PostgreSQL (prod)  |

---

## Live Deployment

* **Frontend**: [https://steady-macaron-535e2c.netlify.app](https://steady-macaron-535e2c.netlify.app)
* **Backend**: [https://auth-otp-demo.onrender.com](https://auth-otp-demo.onrender.com)

---

