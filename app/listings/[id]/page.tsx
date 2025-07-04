"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Property } from "@/types";
import { Loader2, BedDouble, Bath, Phone, Mail } from "lucide-react";

// We'll create these components in the next step
// import ImageCarousel from "@/components/custom/ImageCarousel"; 
// import MapView from "@/components/custom/MapView";

// The 'params' prop is passed by Next.js and contains the dynamic route parameters
export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      if (!params.id) return;

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
  }, [params]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-16 h-16 animate-spin" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-2xl mt-12">{error}</div>;
  }

  if (!property) {
    return <div className="text-center text-2xl mt-12">No property data available.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Carousel Placeholder */}
          <div className="bg-slate-200 h-96 rounded-lg flex items-center justify-center">
            <p>Image Carousel will go here</p>
            {/* <ImageCarousel imageUrls={property.imageUrls} /> */}
          </div>

          <h1 className="text-4xl font-bold">{property.title}</h1>
          <p className="text-lg text-muted-foreground">{property.location.address}, {property.location.city}</p>
          
          <div className="flex items-center gap-6 border-y py-4">
            <div className="flex items-center gap-2"><BedDouble /> {property.bedrooms} Bedrooms</div>
            <div className="flex items-center gap-2"><Bath /> {property.bathrooms} Bathrooms</div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
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
                <a href={`tel:${property.agentInfo.phone}`} className="flex items-center gap-2 text-green-600 hover:underline">
                    <Phone size={18} /> {property.agentInfo.phone}
                </a>
                {/* We don't have agent email in property doc, but could be added */}
                {/* <a href={`mailto:agent@email.com`} className="flex items-center gap-2 text-green-600 hover:underline">
                    <Mail size={18} /> Email Agent
                </a> */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Map View Placeholder */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <div className="bg-slate-200 h-96 rounded-lg flex items-center justify-center">
            <p>Map View will go here</p>
            {/* <MapView geo={property.location.geo} /> */}
        </div>
      </div>

    </div>
  );
}
