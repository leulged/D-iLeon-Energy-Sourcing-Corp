"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SellerDashboardSidebar from "../../components/SellerDashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function SellerDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        router.push("/login");
        return;
      }

      if (role !== "seller") {
        router.push("/login");
        return;
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex bg-black text-white">
      <SellerDashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        <header className="p-8 border-b border-yellow-600 bg-neutral-900">
          <h1 className="text-3xl font-bold mb-2">Welcome, [Seller Name]</h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white font-semibold text-sm">
              &#10003; Verified
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-600 text-white font-semibold text-sm">
              Onboarding Incomplete
            </span>
          </div>
        </header>
        <main className="flex-1 p-8 md:p-12">
          <div className="text-xl font-semibold text-yellow-300">
            Seller dashboard main content goes here.
          </div>
        </main>
      </div>
    </div>
  );
}
