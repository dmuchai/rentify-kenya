"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

// Our custom hook and firebase config
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/lib/firebase";
import { Property } from "@/types";

// UI Components
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import ListingCard from "@/components/custom/ListingCard"; // We can reuse our card component!

export default function AgentDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth(); // Get the logged-in user
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We can only fetch listings if we have a user
    if (user) {
      async function fetchAgentProperties() {
        try {
          // Create a query to get properties for the current agent
          const propertiesRef = collection(db, "properties");
          const q = query(
            propertiesRef,
            where("agentId", "==", user.uid), // <-- THE MAGIC FILTER
            orderBy("createdAt", "desc")
          );

          const querySnapshot = await getDocs(q);
          
          const props = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Property[];

          setProperties(props);
        } catch (err) {
          console.error("Error fetching agent properties:", err);
          setError("Failed to load your listings.");
        } finally {
          setIsLoading(false);
        }
      }
      fetchAgentProperties();
    } else if (!isAuthLoading) {
        // If auth is done loading and there's still no user, stop loading
        setIsLoading(false);
    }
  }, [user, isAuthLoading]); // Re-run this effect when the user object becomes available

  const renderContent = () => {
    if (isLoading || isAuthLoading) {
      return (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="w-12 h-12 animate-spin text-green-600" />
        </div>
      );
    }

    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }

    if (properties.length === 0) {
      return (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No listings yet!</h3>
          <p className="text-muted-foreground mb-4">You have not added any listings. Get started by adding your first one.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <ListingCard key={property.id} property={property} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/agent/listings/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Listing
          </Link>
        </Button>
      </div>
      {renderContent()}
    </div>
  );
}
