"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Our custom hook to get user info
import { useAuth } from "@/app/context/AuthContext";

// Firebase imports for storage and database
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp, GeoPoint } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";

// Component Imports
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

// Define the form schema for validation
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  price: z.coerce.number().min(1, "Price must be a positive number."),
  type: z.enum(["Apartment", "Bungalow", "Townhouse", "Maisonette"]),
  bedrooms: z.coerce.number().min(1, "Must have at least 1 bedroom."),
  bathrooms: z.coerce.number().min(1, "Must have at least 1 bathroom."),
  county: z.string().min(3, "County is required."),
  city: z.string().min(3, "City/Town is required."),
  address: z.string().min(5, "A more specific address is required."),
  images: z.instanceof(FileList).refine(files => files?.length > 0, "At least one image is required."),
});

export default function AddListingPage() {
  const router = useRouter();
  const { user } = useAuth(); // Get the logged-in user
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      bedrooms: 1,
      bathrooms: 1,
      county: "",
      city: "",
      address: "",
    },
  });

  // **************************************************
  // THE CORE SUBMISSION LOGIC
  // **************************************************
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("You must be logged in to add a listing.");
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading("Submitting your listing, please wait...");

    try {
      // 1. UPLOAD IMAGES TO FIREBASE STORAGE
      const imageFiles = Array.from(values.images);
      const imageUrls: string[] = [];

      const uploadPromises = imageFiles.map(file => {
        const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_${file.name}`);
        return uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref));
      });
      
      // Promise.all waits for all uploads to complete
      const resolvedImageUrls = await Promise.all(uploadPromises);
      imageUrls.push(...resolvedImageUrls);

      // 2. CREATE A NEW DOCUMENT IN FIRESTORE
      await addDoc(collection(db, "properties"), {
        // Form values
        title: values.title,
        description: values.description,
        price: values.price,
        type: values.type,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        location: {
            county: values.county,
            city: values.city,
            address: values.address,
            geo: new GeoPoint(0, 0), // Placeholder, can be updated with a map feature
        },
        imageUrls: imageUrls, // The URLs from storage
        status: 'available',
        amenities: [], // Can add this to the form later
        
        // Agent and timestamp info
        agentId: user.uid,
        agentInfo: {
            name: user.displayName || "Agent", // Use displayName from auth profile
            phone: user.phoneNumber || "Not provided",
            isVerified: false, // This would be a separate admin process
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast.success("Listing Added Successfully!", { id: toastId });
      router.push("/agent/dashboard");

    } catch (error) {
      console.error("Error adding listing:", error);
      toast.error("Failed to add listing. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }

  // FileList to be passed into react-hook-form
  const fileRef = form.register("images");

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Property Listing</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ... All FormField components are the same as before ... */}
          {/* Title */}
          <FormField name="title" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Property Title</FormLabel><FormControl><Input placeholder="e.g., Modern 3 Bedroom in Westlands" {...field} /></FormControl><FormMessage /></FormItem>)} />
          {/* Type */}
          <FormField name="type" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Property Type</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select a property type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Apartment">Apartment</SelectItem><SelectItem value="Bungalow">Bungalow</SelectItem><SelectItem value="Townhouse">Townhouse</SelectItem><SelectItem value="Maisonette">Maisonette</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
          {/* Price */}
          <FormField name="price" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Rent Price (Ksh per month)</FormLabel><FormControl><Input type="number" placeholder="85000" {...field} /></FormControl><FormMessage /></FormItem>)} />
          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><FormField name="bedrooms" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" placeholder="3" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField name="bathrooms" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" placeholder="2" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><FormField name="county" control={form.control} render={({ field }) => ( <FormItem><FormLabel>County</FormLabel><FormControl><Input placeholder="Nairobi" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField name="city" control={form.control} render={({ field }) => ( <FormItem><FormLabel>City / Major Town</FormLabel><FormControl><Input placeholder="Westlands" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
          <FormField name="address" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Street / Address</FormLabel><FormControl><Input placeholder="Waiyaki Way, near ABC Place" {...field} /></FormControl><FormMessage /></FormItem>)} />
          {/* Description */}
          <FormField name="description" control={form.control} render={({ field }) => ( <FormItem><FormLabel>Property Description</FormLabel><FormControl><Textarea placeholder="Describe the property, its amenities, and nearby features..." className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>)} />

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem>
                <FormLabel>Property Images</FormLabel>
                <FormControl>
                  <Input 
                    type="file" 
                    multiple
                    accept="image/*"
                    {...fileRef}
                  />
                </FormControl>
                <FormDescription>You can upload multiple images.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Submitting..." : "Add Listing"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
