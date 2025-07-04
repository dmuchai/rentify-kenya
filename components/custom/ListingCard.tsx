import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bath, BedDouble, CheckCircle2 } from "lucide-react";
import { Property } from "@/types";

type ListingCardProps = {
  property: Property;
};

export default function ListingCard({ property }: ListingCardProps) {
  // Fallback to a default image if imageUrls is missing or empty
  const imageUrl = property.imageUrls && property.imageUrls.length > 0 
    ? property.imageUrls[0] 
    : "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <Link href={`/listings/${property.id}`} className="block group h-full">
      <Card className="w-full overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-56 w-full">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            {property.agentInfo?.isVerified && (
              <Badge variant="secondary" className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-300">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Verified Agent
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <Badge variant="outline" className="mb-2">{property.type}</Badge>
          <CardTitle className="text-lg mb-2 truncate leading-tight">{property.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{property.location?.address}, {property.location?.city}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-4 bg-slate-50 mt-auto">
          <div className="flex gap-4 text-sm items-center">
            <div className="flex items-center gap-1">
              <BedDouble className="w-5 h-5 text-gray-600" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-5 h-5 text-gray-600" />
              <span>{property.bathrooms}</span>
            </div>
          </div>
          <div className="text-lg font-bold text-green-600">
            Ksh {property.price?.toLocaleString()}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
