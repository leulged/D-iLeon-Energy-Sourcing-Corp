"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardNavbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="flex items-center justify-between px-6 py-4 bg-black border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <span className="text-neutral-300 text-sm md:text-base ml-2">
            We Don&apos;t Sell Oil. We Deliver Access.
          </span>
        </div>
        <div>
          <div className="px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-700">
            Loading...
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black border-b border-neutral-800">
      <div className="flex items-center gap-4">
        <span className="text-neutral-300 text-sm md:text-base ml-2">
          We Don&apos;t Sell Oil. We Deliver Access.
        </span>
      </div>
      <div>
        {loggedIn ? (
          <button
            className="px-4 py-2 rounded bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <a
            href="/login"
            className="px-4 py-2 rounded border border-white text-white hover:bg-orange-500 hover:text-white transition"
          >
            Login
          </a>
        )}
      </div>
    </header>
  );
}
