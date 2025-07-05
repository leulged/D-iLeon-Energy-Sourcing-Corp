"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { useRouter } from "next/navigation";

function LoginPageContent() {
  const router = useRouter();

  const handleLogin = (role: "buyer" | "seller") => {
    if (role === "buyer") {
      router.push("/buyer/login");
    } else {
      router.push("/seller/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-neutral-900 rounded-xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6 border border-neutral-800 items-center">
        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
        <div className="flex gap-4 w-full justify-center mb-4">
          <button
            className="flex-1 px-4 py-2 rounded-full font-semibold border transition cursor-pointer select-none bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            onClick={() => handleLogin("buyer")}
          >
            Login as Buyer
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-full font-semibold border transition cursor-pointer select-none bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-orange-400"
            onClick={() => handleLogin("seller")}
          >
            Login as Seller
          </button>
        </div>
        <div className="text-center text-neutral-400 mt-2">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-orange-400 hover:underline cursor-pointer"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
