// 'use client';

// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { PlaceGrid } from '@/components/places/profile-places';
// import { useQuery } from '@tanstack/react-query';
// import { getUserPlaces, getUserWishlist } from '@/actions/place';

// interface PlaceTabsProps {
//   userId: string;
// }

// export function PlaceTabs({ userId }: PlaceTabsProps) {
//   // Fetch the user's visited places with React Query
//   const { data: visitedPlaces = [], isLoading: isLoadingVisited } = useQuery({
//     queryKey: ['userPlaces', userId],
//     queryFn: () => getUserPlaces(userId),
//   });

//   // Fetch the user's wishlist places with React Query
//   const { data: wishlistPlaces = [], isLoading: isLoadingWishlist } = useQuery({
//     queryKey: ['userWishlist', userId],
//     queryFn: () => getUserWishlist(userId),
//   });

//   console.log('Visited places:', visitedPlaces);
//   console.log('Wishlist places:', wishlistPlaces);

//   // Loading state management (you can customize the loading UI here)
//   if (isLoadingVisited || isLoadingWishlist) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Tabs defaultValue="visited" className="space-y-6">
//       <TabsList className="grid w-full max-w-md grid-cols-2">
//         <TabsTrigger value="visited">
//           Visited Places ({visitedPlaces.length})
//         </TabsTrigger>
//         <TabsTrigger value="wishlist">
//           Want to Visit ({wishlistPlaces.length})
//         </TabsTrigger>
//       </TabsList>
//       <TabsContent value="visited">
//         <PlaceGrid places={visitedPlaces} />
//       </TabsContent>

//       <TabsContent value="wishlist">
//         <PlaceGrid places={wishlistPlaces} />
//       </TabsContent>
//     </Tabs>
//   );
// }
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceGrid } from '@/components/places/profile-places';
import { useQuery } from '@tanstack/react-query';
import { getUserPlaces, getUserWishlist } from '@/actions/place';
import { Grid, List, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PlaceTabsProps {
  userId: string;
}

export function PlaceTabs({ userId }: PlaceTabsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  return (
    <Tabs defaultValue="visited" className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="visited">
            Visited Places ({visitedPlaces.length})
          </TabsTrigger>
          <TabsTrigger value="wishlist">
            Want to Visit ({wishlistPlaces.length})
          </TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'text-primary' : ''}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'text-primary' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <TabsContent value="visited">
        <PlaceGrid places={visitedPlaces} viewMode={viewMode} />
      </TabsContent>
      <TabsContent value="wishlist">
        <PlaceGrid places={wishlistPlaces} viewMode={viewMode} />
      </TabsContent>
    </Tabs>
  );
}

