"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BuyerDashboardSidebar from "../../components/BuyerDashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";

export default function BuyerDashboardPage() {
	const router = useRouter();

	// useEffect(() => {
	//   if (typeof window !== "undefined") {
	//     const token = localStorage.getItem("token");
	//     const role = localStorage.getItem("role");

	//     if (!token) {
	//       router.push("/login");
	//       return;
	//     }

	//     if (role !== "buyer") {
	//       router.push("/login");
	//       return;
	//     }
	//   }
	// }, [router]);

	return (
		<div className="min-h-screen flex bg-black text-white">
			<BuyerDashboardSidebar />
			<div className="flex-1 flex flex-col min-h-screen">
				<DashboardNavbar />
				<header className="p-8 border-b border-neutral-800 bg-neutral-900">
					<h1 className="text-3xl font-bold mb-2">
						Welcome, [Buyer Name]
					</h1>
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
					<div className="text-xl font-semibold text-neutral-300">
						Buyer dashboard main content goes here.
					</div>
				</main>
			</div>
		</div>
	);
}
