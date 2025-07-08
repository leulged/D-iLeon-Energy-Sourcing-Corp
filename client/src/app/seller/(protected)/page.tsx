"use client";
import SellerDashboardSidebar from "@/app/components/SellerDashboardSidebar";

export default function SellerPortal() {
	return (
		<div className="min-h-screen flex bg-yellow-400 text-black">
			<SellerDashboardSidebar />
			<div className="flex-1 flex flex-col min-h-screen">
				<header className="p-8 border-b border-yellow-600 bg-yellow-300">
					<h1 className="text-3xl font-bold mb-2">
						Welcome, [Seller Name]
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
					{/* Placeholder for dashboard content */}
					<div className="text-xl font-semibold text-yellow-900">
						Seller dashboard main content goes here.
					</div>
				</main>
			</div>
		</div>
	);
}
