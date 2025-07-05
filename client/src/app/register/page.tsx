"use client";
export const dynamic = "force-dynamic";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const roleParam = searchParams.get("role");

    if (roleParam === "buyer") {
      router.replace("/buyer/register");
    } else if (roleParam === "seller") {
      router.replace("/seller/register");
    } else {
      // Default to buyer if no role specified
      router.replace("/buyer/register");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-neutral-900 rounded-xl shadow-xl p-8 w-full max-w-md text-center border border-neutral-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p>Redirecting to registration...</p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
