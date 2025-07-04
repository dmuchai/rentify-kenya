"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Property } from "@/types";

// UI and Icon Imports
import { Loader2, BedDouble, Bath, Phone } from "lucide-react";
import ImageCarousel from "@/components/custom/ImageCarousel";

// Dynamically import MapView with no Server-Side Rendering (SSR)
// This is crucial for libraries like Leaflet that rely on the 'window' object.
const MapView = dynamic(() => import('@/components/custom/MapView'), { 
  ssr: false,
  // Provide a loading component while the map is being loaded
  loading: () => <div className="bg-slate-200 h-96 rounded-lg animate-pulse" />
});

// The 'params' prop is passed by Next.js and contains the dynamic route parameters
export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      // Guard clause for safety
      if (!params.id) {
        setError("Listing ID not found in URL.");
        setIsLoading(false);
        return;
      };

      try {
        const docRef = doc(db, "properties", params.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
        } else {
          setError("Listing not found.");
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load listing details.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProperty();
  }, [params]); // Depend on the entire params object

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Loader2 className="w-16 h-16 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-2xl mt-12">{error}</div>;
  }

  if (!property) {
    // This state could be reached if there's no error but the property is still null
    return <div className="text-center text-2xl mt-12">Listing data is unavailable.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          <ImageCarousel imageUrls={property.imageUrls} title={property.title} />

          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{property.title}</h1>
          <p className="text-lg text-muted-foreground">
            {property.location.address}, {property.location.city}, {property.location.county}
          </p>
          
          <div className="flex items-center gap-6 border-y py-4 text-muted-foreground">
            <div className="flex items-center gap-2"><BedDouble /> {property.bedrooms} Bedrooms</div>
            <div className="flex items-center gap-2"><Bath /> {property.bathrooms} Bathrooms</div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{property.description}</p>
          </div>
        </div>

        {/* Right Column: Price and Agent Info */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 border rounded-lg shadow-md bg-white">
            <p className="text-3xl font-bold mb-4">
              Ksh {property.price.toLocaleString()}
              <span className="text-lg font-normal text-muted-foreground">/month</span>
            </p>
            <h3 className="text-xl font-semibold border-t pt-4 mb-4">Contact Agent</h3>
            <div className="space-y-3">
                <p className="font-medium text-lg">{property.agentInfo.name}</p>
                {property.agentInfo.phone && (
                  <a href={`tel:${property.agentInfo.phone}`} className="flex items-center gap-2 text-green-600 hover:underline">
                      <Phone size={18} /> {property.agentInfo.phone}
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map View Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <MapView geo={property.location.geo} title={property.title} />
      </div>
    </div>
  );
}
