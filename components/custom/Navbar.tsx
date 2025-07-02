// components/custom/Navbar.tsx
"use client"; // <-- Make this a client component

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext"; // <-- Import our hook
import { auth } from "@/lib/firebase"; // <-- Import auth for logout
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Building2, Loader2 } from "lucide-react";

export default function Navbar() {
  const { user, isLoading } = useAuth(); // <-- Use our hook
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <header className="py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        {/* ... Logo part is unchanged ... */}
        <Link href="/" className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">
            Rental Houses <span className="text-green-600">Kenya</span>
            </h1>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-lg">
          {/* ... Nav links are unchanged ... */}
        </nav>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/agent/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={handleLogout}>Log Out</Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
