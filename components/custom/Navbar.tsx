import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="py-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Rentify <span className="text-green-600">Kenya</span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-lg">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <Link href="/listings" className="hover:text-green-600 transition-colors">Listings</Link>
          <Link href="/agent/dashboard" className="hover:text-green-600 transition-colors">For Agents</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
