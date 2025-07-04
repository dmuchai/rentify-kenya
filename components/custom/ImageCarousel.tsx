"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type ImageCarouselProps = {
  imageUrls: string[];
  title: string;
};

export default function ImageCarousel({ imageUrls, title }: ImageCarouselProps) {
  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="bg-slate-200 h-96 rounded-lg flex items-center justify-center">
        <p>No images available for this listing.</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {imageUrls.map((url, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="relative flex aspect-video items-center justify-center p-0">
                  <Image
                    src={url}
                    alt={`${title} - Image ${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4" />
      <CarouselNext className="absolute right-4" />
    </Carousel>
  );
}
