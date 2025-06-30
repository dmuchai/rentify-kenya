import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bath, BedDouble, CheckCircle2 } from "lucide-react";
import { Property } from "@/lib/mock-data";

type ListingCardProps = {
  property: Property;
};

export default function ListingCard({ property }: ListingCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden group">
      <CardHeader className="p-0">
        <div className="relative h-56 w-full">
          <Image
            src={property.imageUrls[0]}
            alt={property.title}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {property.agentInfo.isVerified && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-green-100 text-green-800">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Verified Agent
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2">{property.type}</Badge>
        <CardTitle className="text-lg mb-2 truncate">{property.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{property.location.address}, {property.location.city}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-slate-50">
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
          Ksh {property.price.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  );
}
