"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ThumbsUp, MessageSquare, Bookmark, Send, TrendingUp, Filter } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { populateCities } from "@/actions/place";

type Place = {
  id: string;
  name: string;
  caption?: string;
  description?: string;
  imageUrl: string;
  category: string;
  city: string;
  state: string;
  numVotes: number;
  comments: Comment[];
  user: User;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  profileUrl: string;
  occupation?: string;
};

type Comment = {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  likes?: number;
};

const FILTERS = [
  "Trending",
  "Latest",
  "Most Voted",
  "Following"
];

const CATEGORIES = [
  "All",
  "Restaurants",
  "Parks",
  "Museums",
  "Nightlife",
  "Shopping",
  "Architecture",
  "Hidden Gems"
];

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState("Trending");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newComment, setNewComment] = useState("");

  // Mock data based on your schema
  const places: Place[] = [
    {
      id: "1",
      name: "Central Park",
      caption: "A peaceful afternoon in the heart of the city",
      description: "Found this amazing spot perfect for picnics and relaxation",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      category: "Parks",
      city: "New York",
      state: "NY",
      numVotes: 1234,
      createdAt: "2024-03-20T10:00:00Z",
      user: {
        id: "u1",
        name: "Sarah Chen",
        profileUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        occupation: "Photographer"
      },
      comments: [
        {
          id: "c1",
          content: "This is my favorite spot in the city!",
          user: {
            id: "u2",
            name: "Mike Johnson",
            profileUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
          },
          createdAt: "2024-03-20T11:00:00Z",
          likes: 23
        }
      ]
    },
    {
      id: "2",
      name: "The Metropolitan Museum",
      caption: "New exhibition just opened!",
      description: "An incredible showcase of modern art",
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      category: "Museums",
      city: "New York",
      state: "NY",
      numVotes: 892,
      createdAt: "2024-03-19T15:30:00Z",
      user: {
        id: "u3",
        name: "Alex Rivera",
        profileUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        occupation: "Art Curator"
      },
      comments: []
    }
  ];

  const trendingCities = [
    {
      name: "New York",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
      count: 1234
    },
    {
      name: "Los Angeles",
      image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261",
      count: 892
    },
    {
      name: "Chicago",
      image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f",
      count: 756
    }
  ];

  const handleComment = (placeId: string) => {
    if (!newComment.trim()) return;
    console.log("Adding comment to place:", placeId, newComment);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    {selectedFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {FILTERS.map((filter) => (
                    <DropdownMenuItem
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                    >
                      {filter}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <ScrollArea className="w-[400px]">
                <div className="flex gap-2">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full whitespace-nowrap"
                      size="sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {places.map((place) => (
                <div key={place.id} className="bg-card rounded-lg overflow-hidden shadow-md">
                  {/* User Info */}
                  <div className="p-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <Image
                        src={place.user.profileUrl}
                        alt={place.user.name}
                        width={40}
                        height={40}
                      />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{place.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {place.user.occupation}
                          </p>
                        </div>
                        <Link href={`/city/${place.city.toLowerCase()}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <MapPin className="w-4 h-4" />
                            {place.city}, {place.state}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-video">
                    <Image
                      src={place.imageUrl}
                      alt={place.name}
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
                    <p className="text-muted-foreground mb-4">{place.description}</p>

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
                              src={comment.user.profileUrl}
                              alt={comment.user.name}
                              width={32}
                              height={32}
                            />
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-accent rounded-lg p-3">
                              <p className="font-semibold text-sm">{comment.user.name}</p>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                              <button className="hover:text-foreground">Like</button>
                              <button className="hover:text-foreground">Reply</button>
                              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      <div className="flex gap-3 items-center">
                        <Avatar className="h-8 w-8">
                          <Image
                            src="https://github.com/shadcn.png"
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Cities */}
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Trending Cities</h3>
              </div>
              <div className="space-y-4">
                {trendingCities.map((city) => (
                  <Link
                    key={city.name}
                    href={`/city/${city.name.toLowerCase()}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={city.image}
                        alt={city.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-primary">
                        {city.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {city.count} places
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Share CTA */}
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Share Your Experience</h3>
              <p className="text-muted-foreground mb-4">
                Found an amazing place? Share it with the community!
              </p>
              <Button className="w-full" onClick={()=> populateCities()}>
                Share a Place
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import React from 'react'
// import { Button } from '@/components/ui/button'
// import { populateCities } from '@/actions/place'

// type Props = {}

// const page = (props: Props) => {
//      const populate = async () => {
//         await populateCities()
//      }


//   return (
//     <div>
        
//         <Button 
//         onClick={populate}
//         >
//             Poulate
//         </Button>
//     </div>
//   )
// }

// export default page