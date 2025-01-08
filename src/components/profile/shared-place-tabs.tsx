'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { getUserPlaces, getUserWishlist } from '@/actions/place';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Place } from '@/types/index.type';

interface SharedPlaceTabsProps {
  userId: string;
}

export function SharedPlaceTabs({ userId }: SharedPlaceTabsProps) {
  const { data: visitedPlaces = [], isLoading: isLoadingVisited } = useQuery({
    queryKey: ['userPlaces', userId],
    queryFn: () => getUserPlaces(userId),
  });

  const { data: wishlistPlaces = [], isLoading: isLoadingWishlist } = useQuery({
    queryKey: ['userWishlist', userId],
    queryFn: () => getUserWishlist(userId),
  });

  if (isLoadingVisited || isLoadingWishlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const limitedVisitedPlaces = visitedPlaces.slice(0, 3);
  const limitedWishlistPlaces = wishlistPlaces.slice(0, 3);

  return (
    <Tabs defaultValue="visited" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="visited">
          Visited Places ({visitedPlaces.length})
        </TabsTrigger>
        <TabsTrigger value="wishlist">
          Want to Visit ({wishlistPlaces.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="visited">
        <SharedPlaceGrid places={limitedVisitedPlaces} />
      </TabsContent>
      <TabsContent value="wishlist">
        <SharedPlaceGrid places={limitedWishlistPlaces} />
      </TabsContent>
    </Tabs>
  );
}

// Removed duplicate Place interface

function SharedPlaceGrid({ places }: { places: Place[] }) {
  if (places.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No places added yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {places.map((place) => (
        <div
          key={place.id}
          className="relative group overflow-hidden rounded-2xl"
        >
          <img
            src={place.imageUrl || "/placeholder.svg?height=300&width=400"}
            alt={place.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            <div className="absolute bottom-0 p-4 w-full">
              <h3 className="text-white font-semibold">{place.name}</h3>
            </div>
          </div>
          <Link href="/sign-in" className="absolute inset-0">
            <span className="sr-only">View details</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
