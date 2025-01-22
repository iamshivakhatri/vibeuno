"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Users,
  TrendingUp,
  Camera,
  Bookmark,
  MessageSquare,
  Send,
  ThumbsUp,
  Link,
} from "lucide-react";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCityData } from "@/actions/place";
import { useUser } from "@clerk/nextjs";
import { getAppUserId } from "@/actions/auth";
import { getProfileUrl } from "@/actions/user";
import { useRouter } from "next/navigation";

// Types based on your schema
type Place = {
  id: string;
  name: string | null;
  caption?: string | null;
  description?: string | null;
  image?: string[];
  imageUrl?: string | null;
  category?: string | null;
  numVotes: number | 0;
  comments: Comment[];
  user: User;
  createdAt: string;
};

type User = {
  id: string;
  name?: string;
  profileUrl?: string;
  occupation?: string;
};

type Comment = {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  likes?: number;
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
  const appUser = getAppUserId(user?.id ?? "");
  const { cityName } = useParams();
  const formattedCityName = cityName as string;
  console.log("this is the city name", formattedCityName);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newComment, setNewComment] = useState("");
  const router = useRouter();

  const { data: profileUrl } = useQuery({
    queryKey: ["profileUrl", user?.id],
    queryFn: () => getProfileUrl(user?.id ?? ""),
    enabled: !!user?.id,
    initialData: user?.imageUrl, // Use Clerk's image URL as initial data
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data } = useQuery({
    queryKey: ["hasVoted", cityName],
    queryFn: () => getCityData(formattedCityName),
  });

  const mockPlaces: Place[] =
    data?.[0]?.places.map((place: any) => ({
      ...place,
      comments: place.comments.map((comment: any) => ({
        ...comment,
        user: {
          id: comment.userId,
          name: comment.userName,
          profileUrl: comment.userProfileUrl,
          occupation: comment.userOccupation,
        },
      })),
    })) || [];

  const cityStats = {
    members: 12453,
    places: mockPlaces?.length,
    trending: "+24%",
  };

  const filteredPlaces =
    selectedCategory === "All"
      ? mockPlaces
      : mockPlaces?.filter((place) => place.category === selectedCategory);

  const handleComment = (placeId: string) => {
    if (!newComment.trim()) return;
    // Here you would typically make an API call to add the comment
    console.log("Adding comment to place:", placeId, newComment);
    setNewComment("");
  };

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
            {formattedCityName}
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Places Feed */}
          <div className="lg:col-span-2 space-y-6">
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
                <div
                  key={place.id}
                  className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* User Info */}
                  <div className="p-4 flex items-center gap-3 border-b">
                    <Avatar className="h-10 w-10">
                      <Image
                        src={
                          place.user.profileUrl ||
                          "https://github.com/shadcn.png"
                        }
                        alt={place.user.name || "User"}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <div>
                      <p className="font-semibold">{place.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {place.user.occupation}
                      </p>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative h-[400px]">
                    <Image
                      src={place?.image?.[0] || ""}
                      alt={place?.name || "Place"}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-4 right-4">
                      {place.category}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                    <p className="text-muted-foreground mb-4">
                      {place.description}
                    </p>

                    {/* Interactions */}
                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{place.numVotes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>{place.comments.length}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Comments */}
                    <div className="space-y-4">
                      {place.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <Image
                              src={
                                comment.user.profileUrl ||
                                "https://github.com/shadcn.png"
                              }
                              alt={comment.user.name || "User"}
                              width={32}
                              height={32}
                            />
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-accent rounded-lg p-3">
                              <p className="font-semibold text-sm">
                                {comment.user.name}
                              </p>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                              <button className="hover:text-foreground">
                                Like
                              </button>
                              <button className="hover:text-foreground">
                                Reply
                              </button>
                              <span>
                                {new Date(
                                  comment.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      <div className="flex gap-3 items-center">
                        <Avatar className="h-8 w-8">
                          <Image
                            src={profileUrl || "https://github.com/shadcn.png"}
                            alt="Your avatar"
                            width={32}
                            height={32}
                          />
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-0 h-9 py-2 resize-none"
                          />
                          <Button
                            size="icon"
                            onClick={() => handleComment(place.id)}
                            disabled={!newComment.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - City Info & Categories */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 sticky top-10">
              <h3 className="text-lg font-semibold mb-4">
                About {formattedCityName}
              </h3>
              <p className="text-muted-foreground mb-4">
                Discover the best places, share your experiences, and connect
                with fellow travelers in {formattedCityName}. From hidden gems
                to popular attractions, find everything you need to know about
                this amazing city.
              </p>

                <Button
                 className="w-full"
                 onClick={() => router.push(`/upload`)}
                 
                 
                 >
                  Share Your Experience
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
