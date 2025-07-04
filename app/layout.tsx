import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/custom/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/app/context/AuthContext";
import "leaflet/dist/leaflet.css";

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
        <AuthProvider> {/* <-- WRAPPER START */}
          <Navbar />
          <main className="container mx-auto py-8">{children}</main>
	  <Toaster /> {/* <-- THIS STAYS THE SAME */}
        </AuthProvider> {/* <-- WRAPPER END */}
      </body>
    </html>
  );
}
