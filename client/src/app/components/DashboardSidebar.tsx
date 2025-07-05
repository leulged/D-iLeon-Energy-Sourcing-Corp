"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", icon: "\uD83D\uDCCB", href: "/dashboard" },
  {
    label: "Document Center",
    icon: "\uD83D\uDCC4",
    href: "/dashboard/documents",
  },
  { label: "Agreements", icon: "\uD83D\uDCDD", href: "/dashboard/agreements" },
  {
    label: "Marketplace",
    icon: "\uD83D\uDCB0",
    href: "/dashboard/marketplace",
  },
  { label: "Deal Tracker", icon: "\uD83D\uDD0D", href: "/dashboard/deals" },
  { label: "Messages", icon: "\uD83D\uDCAC", href: "/dashboard/messages" },
  { label: "Engage Fee", icon: "\uD83D\uDCB3", href: "/dashboard/engage-fee" },
];

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`bg-neutral-900 text-white h-full flex flex-col border-r border-neutral-800 min-w-[220px] max-w-[240px] transition-all duration-200 ${
        open ? "w-[220px]" : "w-16"
      } md:w-[220px] md:max-w-[240px] md:min-w-[220px]`}
    >
      <div className="flex items-center justify-between p-4 md:justify-center">
        <span className="font-bold text-lg tracking-wide text-yellow-300">
          D&apos;ILEON
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
                  ? "bg-neutral-800 text-yellow-300"
                  : "hover:bg-neutral-800 hover:text-yellow-200 text-neutral-300"
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
