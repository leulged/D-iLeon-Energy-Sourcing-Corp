"use client";
const sections = [
  { title: "Compliance View", desc: "Approve/Reject docs" },
  { title: "Deal Flow", desc: "Assign reviewers" },
  { title: "Chat Oversight", desc: "View all communications" },
  { title: "Onboarding Status", desc: "View bottlenecks" },
  { title: "Payment Confirmations", desc: "" },
  { title: "Sanctions Screening Alerts", desc: "" },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-black text-yellow-300 p-8">
      <h1 className="text-4xl font-bold mb-8 text-yellow-400">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-neutral-900 rounded-xl shadow-lg p-6 border border-yellow-700"
          >
            <h2 className="text-2xl font-bold mb-2 text-yellow-300">
              {section.title}
            </h2>
            <p className="text-yellow-100 text-base">{section.desc}</p>
            <div className="mt-4 text-yellow-500 italic">
              [Placeholder for {section.title} functionality]
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
