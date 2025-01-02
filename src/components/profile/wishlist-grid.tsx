'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface WishlistGridProps {
  places: Array<{
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    city: string;
    state: string;
    notes?: string;
  }>;
}

export function WishlistGrid({ places }: WishlistGridProps) {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const handleShare = async (placeId: string) => {
    const url = `${window.location.origin}/places/${placeId}`;
    await navigator.clipboard.writeText(url);
    toast({ title: "Place link copied to clipboard!" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <Card key={place.id} className="group overflow-hidden">
          <div className="aspect-[4/3] relative overflow-hidden">
            <img
              src={place.imageUrl || `https://source.unsplash.com/featured/?${encodeURIComponent(place.name)},landmark`}
              alt={place.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="text-lg font-semibold">{place.name}</h3>
              <p className="text-sm">{place.city}, {place.state}</p>
            </div>
          </div>
          <div className="p-4">
            {place.notes && (
              <p className="text-sm text-muted-foreground mb-4">{place.notes}</p>
            )}
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedPlace(selectedPlace === place.id ? null : place.id)}
              >
                <Heart className="h-4 w-4 mr-2" fill={selectedPlace === place.id ? "currentColor" : "none"} />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(place.id)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}