"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Search, Filter, MessageCircle, UserPlus, Globe2, Calendar, Flag, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TravelBuddy = {
  id: string;
  name: string;
  avatar: string;
  location: string;
  interests: string[];
  languages: string[];
  upcomingTrips: {
    destination: string;
    dates: string;
  }[];
  bio: string;
  compatibility: number;
  mutualConnections: number;
};

export default function BuddiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const buddies: TravelBuddy[] = [
    {
      id: "1",
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      location: "London, UK",
      interests: ["Photography", "Hiking", "Local Cuisine", "Museums"],
      languages: ["English", "Spanish", "French"],
      upcomingTrips: [
        {
          destination: "Barcelona",
          dates: "May 2024"
        },
        {
          destination: "Tokyo",
          dates: "September 2024"
        }
      ],
      bio: "Adventure seeker and culture enthusiast. Always ready to explore new places and meet fellow travelers!",
      compatibility: 85,
      mutualConnections: 3
    },
    {
      id: "2",
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      location: "Singapore",
      interests: ["Street Food", "Architecture", "Night Markets", "History"],
      languages: ["English", "Mandarin", "Malay"],
      upcomingTrips: [
        {
          destination: "Seoul",
          dates: "June 2024"
        }
      ],
      bio: "Food lover and urban explorer. Let's discover hidden gems together!",
      compatibility: 92,
      mutualConnections: 5
    }
  ];

  const interests = ["Photography", "Hiking", "Food", "Culture", "Adventure", "Art", "Nature", "History", "Nightlife", "Shopping"];

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         buddy.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInterests = selectedInterests.length === 0 || 
                            selectedInterests.some(interest => buddy.interests.includes(interest));
    return matchesSearch && matchesInterests;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="Travel Buddies"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">Find Your Travel Companion</h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Connect with like-minded travelers, share experiences, and explore the world together
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Interests */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Popular Interests</h3>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-4">
              {interests.map((interest) => (
                <Button
                  key={interest}
                  variant={selectedInterests.includes(interest) ? "default" : "outline"}
                  onClick={() => {
                    setSelectedInterests(prev =>
                      prev.includes(interest)
                        ? prev.filter(i => i !== interest)
                        : [...prev, interest]
                    );
                  }}
                  className="rounded-full"
                >
                  {interest}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Buddies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuddies.map((buddy) => (
            <Card key={buddy.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <Image
                        src={buddy.avatar}
                        alt={buddy.name}
                        width={48}
                        height={48}
                      />
                    </Avatar>
                    <div>
                      <CardTitle>{buddy.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {buddy.location}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{buddy.bio}</p>

                {/* Stats */}
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{buddy.mutualConnections} mutual</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                    <span>{buddy.languages.length} languages</span>
                  </div>
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-2">
                  {buddy.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>

                {/* Upcoming Trips */}
                {buddy.upcomingTrips.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Upcoming Trips</p>
                    {buddy.upcomingTrips.map((trip, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{trip.destination} • {trip.dates}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}