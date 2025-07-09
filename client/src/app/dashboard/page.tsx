"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        router.push("/login");
        return;
      }

      // Redirect to appropriate portal based on role
      if (role === "buyer") {
        router.push("/buyer/dashboard");
        return;
      } else if (role === "seller") {
        router.push("/seller/dashboard");
        return;
      } else if (role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      // Default fallback
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
