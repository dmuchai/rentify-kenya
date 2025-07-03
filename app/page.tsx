"use client"; // We need this to use hooks like useState and useEffect

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Property } from "@/types"; // We will use our central Property type

import ListingCard from "@/components/custom/ListingCard";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        // Create a query to get properties, ordered by creation date, limited to 8
        const propertiesRef = collection(db, "properties");
        const q = query(propertiesRef, orderBy("createdAt", "desc"), limit(8));
        
        const querySnapshot = await getDocs(q);
        
        const props: Property[] = [];
        querySnapshot.forEach((doc) => {
          // We need to shape the data from Firestore to match our Property type
          const data = doc.data();
          props.push({
            id: doc.id,
            ...data,
            // Firestore timestamps need to be converted, but for the card, it's not displayed
            // so we can cast it for now. A more robust solution would convert them.
            createdAt: data.createdAt, 
            updatedAt: data.updatedAt,
          } as Property);
        });
        
        setProperties(props);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load listings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, []); // The empty array ensures this runs only once when the component mounts

  return (
    <div>
      <section>
        <h2 className="text-3xl font-bold mb-6">Featured Listings</h2>

        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="w-12 h-12 animate-spin text-green-600" />
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.length > 0 ? (
              properties.map((property) => (
                <ListingCard key={property.id} property={property} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No listings found. Be the first to add one!
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
