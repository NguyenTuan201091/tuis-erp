"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Tong quan" },
  { href: "/products", label: "San pham" },
  { href: "/orders", label: "Don hang" },
  { href: "/payments", label: "Thanh toan" },
  { href: "/storefronts", label: "Cua hang" },
];

export function EcommerceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="ecom-shell">
      <aside className="ecom-sidebar">
        <div className="ecom-brand">
          <small>VietERP Module</small>
          <h2>Dieu hanh Ban hang</h2>
        </div>

        <nav className="ecom-nav" aria-label="Ecommerce navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`ecom-link ${pathname === item.href ? "active" : ""}`.trim()}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="ecom-main">
        <header className="ecom-topbar">
          <div>
            <h1>Trung tam van hanh Thuong mai</h1>
            <p>Quan ly san pham, don hang, thanh toan va cua hang truc tuyen</p>
          </div>
          <span className="ecom-badge">Dang chay :3008</span>
        </header>
        {children}
      </div>
    </div>
  );
}
