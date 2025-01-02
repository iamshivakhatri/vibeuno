'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceGrid } from '@/components/places/profile-places';
import { useQuery } from '@tanstack/react-query';
import { getUserPlaces, getUserWishlist } from '@/actions/place';

interface PlaceTabsProps {
  userId: string;
}

export function PlaceTabs({ userId }: PlaceTabsProps) {
  // Fetch the user's visited places with React Query
  const { data: visitedPlaces = [], isLoading: isLoadingVisited } = useQuery({
    queryKey: ['userPlaces', userId],
    queryFn: () => getUserPlaces(userId),
  });

  // Fetch the user's wishlist places with React Query
  const { data: wishlistPlaces = [], isLoading: isLoadingWishlist } = useQuery({
    queryKey: ['userWishlist', userId],
    queryFn: () => getUserWishlist(userId),
  });

  console.log('Visited places:', visitedPlaces);
  console.log('Wishlist places:', wishlistPlaces);

  // Loading state management (you can customize the loading UI here)
  if (isLoadingVisited || isLoadingWishlist) {
    return <div>Loading...</div>;
  }

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
        <PlaceGrid places={visitedPlaces} />
      </TabsContent>

      <TabsContent value="wishlist">
        <PlaceGrid places={wishlistPlaces} />
      </TabsContent>
    </Tabs>
  );
}
