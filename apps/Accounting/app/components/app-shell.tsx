"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Tong quan" },
  { href: "/accounts", label: "He thong tai khoan" },
  { href: "/journals", label: "But toan" },
  { href: "/periods", label: "Ky ke toan" },
  { href: "/reports", label: "Bao cao" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-kicker">VietERP Module</p>
          <p className="brand-title">Dieu hanh Ke toan</p>
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
            <h1 className="topbar-title">Trung tam van hanh Tai chinh</h1>
            <p className="topbar-sub">So cai, dong ky, va bao cao quan tri</p>
          </div>
          <span className="badge-live">Dang chay :3007</span>
        </header>
        {children}
      </div>
    </div>
  );
}
