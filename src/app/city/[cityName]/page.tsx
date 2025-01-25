"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,

} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getCityData } from "@/actions/place";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import PostCard from "@/components/post/PostCard";
import { getProfileFromClerk } from "@/actions/user";
import { useQueryData } from "@/hooks/useQueryData";



type Place = {
  id: string;
  name: string | null;
  caption: string | null;
  description: string | null;
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

type placesDataProps = {
  id: string; // Unique identifier for the country
  name: string; // Name of the country or city (e.g., "dallas")
  description: string; // Brief description (e.g., "Community for dallas, Texas")
  state: string; // The state (e.g., "Texas")
  coverImage: string; // URL of the cover image
  createdAt: Date; // Date when the country object was created
  updatedAt: Date; // Date when the country object was last updated
  places: Place[]; // Array of places associated with this country
  _count: {
    places: number; // Count of places
  };
};
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

export default function CityPage() {
  const { user } = useUser();
  const { cityName  } = useParams();
  const formattedCityName = cityName as string;
  const newCityName = formattedCityName
    .replace('-', ' ') // Replace the hyphen with a space
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first character
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();


  const { data: profileData } = useQuery({
    queryKey: ["profileData"],
    queryFn: () => getProfileFromClerk(user?.id as string),
    enabled: !!user?.id,

  });
  
  


  const { data } = useQueryData(
    ['placesFromCity'],
    () => getCityData(formattedCityName)
);

if (!data) {
    console.log("No data available.");
    return;
}

const placesData = data as placesDataProps[]; // Type assertion, if you know the shape.


if (!placesData[0].places) {
  console.error("Places data is missing or invalid");
  return;
}
if (!placesData || !Array.isArray(placesData) || placesData.length === 0) {
  console.error("placesData is missing or invalid");
  return <div>Error: Unable to load places data</div>;
}

// Safely access places and _count
const places = placesData[0]?.places || [];
const cityStats = {
  members: 12453,
  places: placesData[0]?._count?.places || 0, // Fallback to 0 if _count or places is missing
  trending: "+24%",
};

// Filter places based on selectedCategory
const filteredPlaces =
  selectedCategory === "All"
    ? places
    : places.filter((place) => place.category === selectedCategory);





  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
          alt={formattedCityName}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            {newCityName}
          </h1>
          <div className="flex gap-4 text-black/90">
            {/* <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{cityStats.members.toLocaleString()} members</span>
            </div> */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{cityStats.places} places</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{cityStats.trending} this week</span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto md:px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Places Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Pills */}
            <ScrollArea className="w-full whitespace-nowrap pb-4">
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
            </ScrollArea>

            <div className="grid gap-6">
              {filteredPlaces?.map((place) => (
                profileData?.profileUrl && profileData?.userId && (
                  <PostCard key={place.id} place={place} profileUrl={profileData.profileUrl} clerkId={user?.id} userId ={profileData.userId}/>
                )
     
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
