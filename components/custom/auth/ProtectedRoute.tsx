"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // If it's still loading, show a spinner.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="w-12 h-12 animate-spin text-green-600" />
      </div>
    );
  }

  // If a user is logged in, show the actual page content.
  if (user) {
    return <>{children}</>;
  }

  // Return null or a loading indicator while redirecting
  return null;
}
