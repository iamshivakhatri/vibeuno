"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PhotoGalleryItem } from "@/lib/explore/types";

interface PhotoGalleryProps {
  photos: PhotoGalleryItem[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayPhotos = isExpanded ? photos : photos.slice(0, 5);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Popular Photos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayPhotos.map((photo, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={photo.imageUrl}
                alt={`Photo by ${photo.author}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">by {photo.author}</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{photo.likes}</span>
                </div>
              </div>
              {photo.caption && (
                <p className="text-sm mt-1 text-muted-foreground">{photo.caption}</p>
              )}
            </div>
          </Card>
        ))}
      </div>
      {photos.length > 5 && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show More Photos
            </>
          )}
        </Button>
      )}
    </div>
  );
}