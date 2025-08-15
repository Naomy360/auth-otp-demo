import React from "react";

export default function HomePage({ email }) {
  return (
    <div>
      <h1>Welcome Home</h1>
      <p>You are logged in as: {email}</p>
    </div>
  );
}
