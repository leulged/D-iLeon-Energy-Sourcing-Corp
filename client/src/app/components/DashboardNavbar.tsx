"use client";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const router = useRouter();
  const loggedIn =
    typeof window !== "undefined" && localStorage.getItem("token");

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
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              router.push("/login");
            }}
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
