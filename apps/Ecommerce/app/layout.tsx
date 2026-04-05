import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import { EcommerceShell } from "./components/ecommerce-shell";
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
  title: "Ecommerce Dashboard",
  description: "Van hanh ban hang va thuong mai dien tu",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${heading.variable} ${text.variable}`}>
      <body className="ecom-app">
        <EcommerceShell>{children}</EcommerceShell>
      </body>
    </html>
  );
}
