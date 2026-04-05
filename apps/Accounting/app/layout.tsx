import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import { AppShell } from "./components/app-shell";
import "./globals.css";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const text = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-text",
});

export const metadata: Metadata = {
  title: "ERP Accounting Dashboard",
  description: "Accounting and finance operations dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${text.variable}`}>
      <body className="app-body">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
