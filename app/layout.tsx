import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar"; // <-- IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rentify Kenya",
  description: "Find your next home in Kenya. Verified listings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* <-- ADD THE NAVBAR HERE */}
        <main className="container mx-auto py-8">{children}</main>
      </body>
    </html>
  );
}
