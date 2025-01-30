
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlaceGrid } from '@/components/places/profile-places';
import { useQuery } from '@tanstack/react-query';
import { getUserPlaces, getUserWishlist } from '@/actions/place';
import { Grid, List, Loader2,Bookmark, GalleryHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/post/PostCard';
import { useQueryData } from '@/hooks/useQueryData';
import {getPostUser} from "@/actions/place"
// import { placesDataProps } from '@/app/city/[cityName]/page';
import { getProfileFromClerk } from "@/actions/user";
import { useUser } from "@clerk/nextjs";



interface PlaceTabsProps {
  userId: string;
}






export type Place = {
  id: string;
  name: string | null;
  caption: string | null;
  description: string | null;
  city: string ;
  image: string[] | null;
  imageUrl: string | null;
  category: string | null;
  numVotes: number;
  comments: Comment[];
  user: User;
  createdAt: Date;
};

type User = {
  id: string;
  name: string | null;
  profileUrl: string | null;
  occupation: string | null;
};

type Comment = {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    profileUrl: string | null;
    occupation: string | null;
  };
  userId: string;
  placeId: string;
  createdAt: Date;
  editedAt: Date | null;
  isEdited: boolean;
  likes: number;
  reported: boolean;
  parentId: string | null;
  visible: boolean;
};


export function PlaceTabs({ userId }: PlaceTabsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useUser();


const { data: profileData } = useQuery({
  queryKey: ["profileData"],
  queryFn: () => getProfileFromClerk(user?.id as string),
  enabled: !!user?.id,
});

  const { data: visitedPlaces = [], isLoading: isLoadingVisited } = useQuery({
    queryKey: ['userPlaces', userId],
    queryFn: () => getUserPlaces(userId),
  });

  const { data: wishlistPlaces = [], isLoading: isLoadingWishlist } = useQuery({
    queryKey: ['userWishlist', userId],
    queryFn: () => getUserWishlist(userId),
  });



 const { data } = useQueryData(["placesFromCity"], () =>
    getPostUser(userId)
   );
 
   if (!data) {
     console.log("No data available.");
     return;
   }
 
   const placesData = data as Place[]; // Type assertion, if you know the shape.




  if (isLoadingVisited || isLoadingWishlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="visited" className="space-y-6">
       <TabsList>
       
        <TabsTrigger value="visited" className="gap-2">
          <Grid className="w-4 h-4" />
          Places
        </TabsTrigger>
        <TabsTrigger value="posts" className="gap-2">
          <GalleryHorizontal className="w-4 h-4" />
          Posts
        </TabsTrigger>

        <TabsTrigger value="wishlist" className="gap-2">
          <Bookmark className="w-4 h-4" />
          Saved
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts">

        <div className='grid grid-cols-1 w-1/2 m-auto'>
        {placesData?.map(
                (place) =>
                  profileData?.profileUrl &&
                  profileData?.userId && (
                    <PostCard
                      key={place.id}
                      place={place}
                      profileUrl={profileData.profileUrl}
                      clerkId={user?.id}
                      userId={profileData.userId}
                    />
                  )
              )}

        </div>

       
        
      </TabsContent>

      <TabsContent value="visited">
        <PlaceGrid places={visitedPlaces} viewMode={viewMode}  />
      </TabsContent>
      <TabsContent value="wishlist">
        <PlaceGrid places={wishlistPlaces} viewMode={viewMode}  />
      </TabsContent>
    </Tabs>
  );
}

