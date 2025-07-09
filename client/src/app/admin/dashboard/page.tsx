"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Section {
  title: string;
  desc: string;
  path?: string;
}

const sections: Section[] = [
  { title: "Compliance View", desc: "Approve/Reject docs" },
  { title: "Deal Flow", desc: "Assign reviewers" },
  { title: "Chat Oversight", desc: "View all communications" },
  {
    title: "Onboarding Status",
    desc: "View bottlenecks",
    path: "/admin/onboarding",
  },
  { title: "Payment Confirmations", desc: "" },
  { title: "Sanctions Screening Alerts", desc: "" },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const token = localStorage.getItem("token");
  //     const role = localStorage.getItem("role");
  //
  //     if (!token) {
  //       router.push("/admin/login");
  //       return;
  //     }
  //
  //     if (role !== "admin") {
  //       router.push("/admin/login");
  //       return;
  //     }
  //   }
  // }, [router]);
  //
  const handleSectionClick = (section: Section) => {
    if (section.path) {
      router.push(section.path);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-300 p-8">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section) => (
          <div
            key={section.title}
            onClick={() => handleSectionClick(section)}
            className={`bg-neutral-900 rounded-xl shadow-lg p-6 border border-yellow-700 ${
              section.path
                ? "cursor-pointer hover:bg-neutral-800 transition-colors"
                : ""
            }`}
          >
            <h2 className="text-2xl font-bold mb-2 text-yellow-300">
              {section.title}
            </h2>
            <p className="text-yellow-100 text-base">{section.desc}</p>
            <div className="mt-4 text-yellow-500 italic">
              {section.path ? (
                <span>Click to view {section.title.toLowerCase()}</span>
              ) : (
                <span>[Placeholder for {section.title} functionality]</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
