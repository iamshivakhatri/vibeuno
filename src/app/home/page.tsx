

"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProfileFromClerk } from "@/actions/user";
import { useUser } from "@clerk/nextjs";
import PostCard from "@/components/post/PostCard";
import { PostSkeleton } from "@/components/post/PostSkeleton";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer"; 
import { useQuery } from "@tanstack/react-query";

const FILTERS = ["Trending", "Latest", "Most Voted", "Following"];
const CATEGORIES = [
  "All",
  "Nature",
  "Restaurants",
  "Parks",
  "Museums",
  "Nightlife",
  "Shopping",
  "Architecture",
  "Hidden Gems",
];

type Place = {
  id: string;
  name: string | null;
  caption: string | null;
  description: string | null;
  image: string[] | null;
  city: string;
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

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState("Trending");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { user, isLoaded } = useUser();

  const { ref, inView } = useInView(); // Hook to detect when the user scrolls to the bottom

  const { data: profileData } = useQuery({
    queryKey: ["profileData", user?.id],
    queryFn: () => getProfileFromClerk(user?.id as string),
    enabled: !!user?.id && isLoaded,
    staleTime: Infinity,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["all-posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/get-posts?page=${pageParam}&limit=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined; // No more pages
      return allPages.length + 1; // Return the next page number
    },
    initialPageParam: 1, // Add this line
  });

  // Fetch the next page when the user scrolls to the bottom
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const filteredPlaces = useMemo(() => {
    const allPlaces = data?.pages.flat() || [];
    return selectedCategory === "All"
      ? allPlaces
      : allPlaces.filter(
          (place: Place) => place.category === selectedCategory.toLowerCase()
        );
  }, [selectedCategory, data]);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto md:px-4 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <ScrollArea className="w-full whitespace-nowrap rounded-md overflow-x-hidden">
            <div className="flex w-max space-x-4 p-4">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <div className="grid gap-6">
            {isLoading ? (
              // Show multiple skeletons while loading
              Array.from({ length: 3 }).map((_, index: number) => (
                <PostSkeleton key={index} />
              ))
            ) : (
              filteredPlaces?.map((place: Place) =>
                profileData?.profileUrl &&
                profileData?.userId ? (
                  <PostCard
                    key={place.id}
                    place={place}
                    profileUrl={profileData.profileUrl}
                    clerkId={user?.id}
                    userId={profileData.userId}
                  />
                ) : null
              )
            )}
          </div>

          {/* Load more trigger */}
          <div ref={ref} className="text-center py-4">
            {isFetchingNextPage ? (
              <PostSkeleton />
            ) : hasNextPage ? (
              <Button onClick={() => fetchNextPage()}>Load More</Button>
            ) : (
              <p>No more posts to load.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}