"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/accounts", label: "Chart of Accounts" },
  { href: "/journals", label: "Journal Entries" },
  { href: "/periods", label: "Fiscal Periods" },
  { href: "/reports", label: "Reports" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-kicker">VietERP Module</p>
          <p className="brand-title">Accounting Control</p>
        </div>

        <nav className="nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`.trim()}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="content-wrap">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">Finance Operations Hub</h1>
            <p className="topbar-sub">General Ledger, period close, and reporting workspace</p>
          </div>
          <span className="badge-live">Live on :3007</span>
        </header>
        {children}
      </div>
    </div>
  );
}
