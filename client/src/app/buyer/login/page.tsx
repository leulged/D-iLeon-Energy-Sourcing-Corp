"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BuyerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setSuccess("Login successful! Redirecting...");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "buyer");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 border border-neutral-800"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Login as Buyer</h2>
        {error && (
          <div className="bg-red-700 text-white rounded p-2 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-700 text-white rounded p-2 text-center">
            {success}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 rounded bg-neutral-800 border border-neutral-700 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="current-password"
        />
        <button
          type="submit"
          className="mt-4 px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-neutral-400 mt-2">
          Don&apos;t have an account?{" "}
          <a
            href="/register?role=buyer"
            className="text-orange-400 hover:underline cursor-pointer"
          >
            Register as Buyer
          </a>
        </div>
      </form>
    </div>
  );
}
