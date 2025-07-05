"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function VerifyEmailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");

    // Handle redirect from backend GET route
    if (verified === "true") {
      setStatus("success");
      setMessage("Email verified successfully! You can now login.");
      return;
    }

    if (error === "verification_failed") {
      setStatus("error");
      setMessage("Verification failed. The link may be invalid or expired.");
      return;
    }

    // Handle direct API call
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.message || "Verification failed");
        } else {
          setStatus("success");
          setMessage("Email verified successfully! You can now login.");
        }
      } catch (err) {
        setStatus("error");
        if (err instanceof Error)
          setMessage("Network error. Please try again.");
        else setMessage("Network error. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-neutral-900 rounded-xl shadow-xl p-8 w-full max-w-md text-center border border-neutral-800">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>

        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p>Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-green-400">{message}</p>
            <button
              onClick={handleLogin}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-red-400">{message}</p>
            <button
              onClick={handleLogin}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}
