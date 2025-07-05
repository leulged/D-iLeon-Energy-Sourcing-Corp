"use client";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardNavbar from "../components/DashboardNavbar";

const demoMarketplace = [
  {
    company: "Optimus Energy",
    status: "Urgent",
    details: "Request product",
    date: "May 2024",
  },
  {
    company: "OceSea Co.",
    status: "Standard",
    details: "Target start date",
    date: "June 2024",
  },
  {
    company: "Nova Supply",
    status: "Urgent",
    details: "Request product",
    date: "April 2024",
    volume: "300,000 b",
  },
  {
    company: "Vertex Enterprises",
    status: "Standard",
    details: "Target start date",
    date: "May 2024",
  },
];

export default function BuyerPortal() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar />
        <main className="flex-1 p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
          <div className="flex gap-4 mb-8 flex-wrap">
            <select className="bg-neutral-900 border border-neutral-700 rounded px-4 py-2 text-white">
              <option>Product</option>
            </select>
            <select className="bg-neutral-900 border border-neutral-700 rounded px-4 py-2 text-white">
              <option>Location</option>
            </select>
            <select className="bg-neutral-900 border border-neutral-700 rounded px-4 py-2 text-white">
              <option>Volume</option>
            </select>
          </div>
          <div className="flex flex-col gap-4">
            {demoMarketplace.map((item, idx) => (
              <div
                key={item.company + idx}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg"
              >
                <div>
                  <div className="text-xl font-bold mb-1">{item.company}</div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mr-2 ${
                      item.status === "Urgent"
                        ? "bg-yellow-700 text-yellow-200"
                        : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.volume && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800 text-yellow-300 border border-yellow-700 ml-2">
                      {item.volume}
                    </span>
                  )}
                </div>
                <div className="text-right md:text-left">
                  <div className="text-sm text-neutral-400">{item.details}</div>
                  <div className="text-base font-semibold text-yellow-300">
                    {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            <a
              href="/buyer/login"
              className="px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600 transition"
            >
              Login
            </a>
            <a
              href="/buyer/register"
              className="px-4 py-2 rounded bg-neutral-800 text-white font-semibold hover:bg-neutral-700 transition border border-neutral-700"
            >
              Register
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
