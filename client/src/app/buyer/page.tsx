"use client";
import BuyerDashboardSidebar from "../components/BuyerDashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";

export default function BuyerPortal() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <BuyerDashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        <main className="flex-1 p-8 md:p-12">
          <div className="text-xl font-semibold text-yellow-300">
            Buyer dashboard main content goes here.
          </div>
        </main>
      </div>
    </div>
  );
}
