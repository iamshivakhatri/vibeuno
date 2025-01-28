"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPost } from "@/actions/place";
import { getProfileFromClerk } from "@/actions/user";
import { useUser } from "@clerk/nextjs";
import PostCard from "@/components/post/PostCard";
import { Place as PlaceType } from "@/components/post/index.type";

import { useQuery } from "@tanstack/react-query";
import { JsonValue } from "@prisma/client/runtime/library";

const FILTERS = ["Trending", "Latest", "Most Voted", "Following"];
const CATEGORIES = [
  "All",
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

type PostCardProps = {
  place: Place;
  profileUrl: string | null | undefined;
  userId: string;
  clerkId: string | undefined;
};

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState("Trending");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newComment, setNewComment] = useState("");
  const { user } = useUser();

  const { data: profileData } = useQuery({
    queryKey: ["profileData"],
    queryFn: () => getProfileFromClerk(user?.id as string),
    enabled: !!user?.id,
  });

  const { data: places } = useQuery({
    queryKey: ["all-posts"],
    queryFn: () => getPost(),
  });

  console.log("this is the places. in the home", places);

  const handleComment = (placeId: string) => {
    if (!newComment.trim()) return;
    console.log("Adding comment to place:", placeId, newComment);
    setNewComment("");
  };

  const processedPlaces = (places ?? []).map((place) => ({
    ...place,
    name: place.name ?? "",
    image: Array.isArray(place.image)
      ? place.image.filter((img): img is string => typeof img === "string")
      : [],
    comments: place.comments.map((comment) => ({
      ...comment,
      user: {
        ...comment.user,
        name: comment.user.name ?? "",
      },
      likes: comment.likes?.length || 0, // Convert likes array to number
    })),
  }));

  // Filter places based on selectedCategory
  const filteredPlaces =
    selectedCategory === "All"
      ? processedPlaces ?? []
      : (processedPlaces ?? []).filter(
          (place) => place.category === selectedCategory
        );


  return (
  
    <div className="max-w-2xl mx-auto md:px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-3 space-y-6">

        {/* <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategory === category ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea> */}
              <ScrollArea className="w-full overflow-x-auto pb-4">
          <div className="flex gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>



        <div className="grid gap-6">
        {processedPlaces?.map(
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


      </div>
    </div>
  </div>
  );
}
