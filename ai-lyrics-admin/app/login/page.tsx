"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok && data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "/";
    } else {
      alert("Login failed");
    }
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-24 space-y-4">
      <h2 className="text-2xl font-bold text-center">Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
    </form>
  );
}
