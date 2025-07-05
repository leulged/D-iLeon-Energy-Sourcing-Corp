"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "My Profile",
    icon: "\uD83D\uDC64",
    href: "/seller/dashboard/profile",
  },
  {
    label: "Onboarding Checklist",
    icon: "\u2705",
    href: "/seller/dashboard/onboarding",
  },
  {
    label: "Marketplace",
    icon: "\uD83D\uDCB0",
    href: "/seller/dashboard/marketplace",
  },
  {
    label: "Deal Tracker",
    icon: "\uD83D\uDD0D",
    href: "/seller/dashboard/deals",
  },
  { label: "Let's Chat", icon: "\uD83D\uDCAC", href: "/seller/dashboard/chat" },
  {
    label: "Documents",
    icon: "\uD83D\uDCC4",
    href: "/seller/dashboard/documents",
  },
  {
    label: "Payments",
    icon: "\uD83D\uDCB3",
    href: "/seller/dashboard/payments",
  },
];

export default function SellerDashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`bg-yellow-400 text-black h-full flex flex-col border-r border-yellow-600 min-w-[220px] max-w-[240px] transition-all duration-200 ${
        open ? "w-[220px]" : "w-16"
      } md:w-[220px] md:max-w-[240px] md:min-w-[220px]`}
    >
      <div className="flex items-center justify-between p-4 md:justify-center">
        <span className="font-bold text-lg tracking-wide text-black">
          D'ILEON
        </span>
        <button className="md:hidden ml-2" onClick={() => setOpen(!open)}>
          <span className="text-2xl">{open ? "\u2715" : "\u2630"}</span>
        </button>
      </div>
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer text-base
              ${
                pathname === item.href
                  ? "bg-yellow-300 text-black font-bold"
                  : "hover:bg-yellow-300 hover:text-black text-yellow-900"
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span
              className={`md:inline ${open ? "inline" : "hidden md:inline"}`}
            >
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
