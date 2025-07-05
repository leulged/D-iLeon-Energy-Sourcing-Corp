"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const role = searchParams.get("role");

  const loginHref = role ? `/login?role=${role}` : "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-neutral-900 rounded-xl shadow-xl p-8 w-full max-w-md text-center border border-neutral-800 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-white"
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
        <h2 className="text-2xl font-bold text-green-400">
          Registration Successful!
        </h2>
        <p className="text-neutral-200 text-center">
          Please check your email{email ? ` (${email})` : ""} to verify your
          account before logging in.
        </p>
        <a
          href={loginHref}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckEmailContent />
    </Suspense>
  );
}
