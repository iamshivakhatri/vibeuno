"use client";

import { useState } from "react";
import Image from "next/image";
import { Plane, Train, Car, Bus, Search, Calendar, Users, MapPin, ArrowRight, Filter, Clock, Wallet, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type TransportOption = {
  id: string;
  type: "flight" | "train" | "bus" | "car";
  provider: string;
  providerLogo: string;
  departure: {
    city: string;
    time: string;
    terminal?: string;
  };
  arrival: {
    city: string;
    time: string;
    terminal?: string;
  };
  duration: string;
  price: number;
  rating: number;
  amenities: string[];
};

export default function TransportationPage() {
  const [selectedTab, setSelectedTab] = useState("flight");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");

  const transportOptions: TransportOption[] = [
    {
      id: "1",
      type: "flight",
      provider: "SkyWings Airlines",
      providerLogo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
      departure: {
        city: "New York",
        time: "07:30",
        terminal: "T2"
      },
      arrival: {
        city: "London",
        time: "19:45",
        terminal: "T5"
      },
      duration: "7h 15m",
      price: 549,
      rating: 4.5,
      amenities: ["Wi-Fi", "Meals", "Entertainment", "USB Power"]
    },
    {
      id: "2",
      type: "train",
      provider: "EuroRail Express",
      providerLogo: "https://images.unsplash.com/photo-1474487548417-781cb71495f3",
      departure: {
        city: "Paris",
        time: "09:00",
        terminal: "Gare du Nord"
      },
      arrival: {
        city: "Amsterdam",
        time: "12:30",
        terminal: "Central"
      },
      duration: "3h 30m",
      price: 89,
      rating: 4.8,
      amenities: ["Wi-Fi", "Dining Car", "Power Outlets", "Quiet Zone"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05"
          alt="Transportation"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">
              Find the Perfect Way to Travel
            </h1>

            {/* Search Card */}
            <Card className="bg-card/95 backdrop-blur">
              <CardContent className="p-6">
                <Tabs defaultValue="flight" className="space-y-6">
                  <TabsList className="grid grid-cols-4 gap-4 bg-transparent">
                    <TabsTrigger value="flight" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Plane className="h-4 w-4 mr-2" />
                      Flights
                    </TabsTrigger>
                    <TabsTrigger value="train" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Train className="h-4 w-4 mr-2" />
                      Trains
                    </TabsTrigger>
                    <TabsTrigger value="bus" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Bus className="h-4 w-4 mr-2" />
                      Buses
                    </TabsTrigger>
                    <TabsTrigger value="car" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      <Car className="h-4 w-4 mr-2" />
                      Car Rental
                    </TabsTrigger>
                  </TabsList>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="From where?"
                        className="pl-10"
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="To where?"
                        className="pl-10"
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                      />
                    </div>
                    <Button className="gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium">Price Range</label>
                <div className="mt-2 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="h-4 w-4 mr-2" />
                    Under $100
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    $100 - $300
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    $300 - $500
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    $500+
                  </Button>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm font-medium">Duration</label>
                <div className="mt-2 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Under 3 hours
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    3 - 6 hours
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    6+ hours
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="mt-2 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    4.5 & up
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    4.0 & up
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    3.5 & up
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transport Options */}
          <div className="space-y-4">
            {transportOptions.map((option) => (
              <Card key={option.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Provider Info */}
                    <div className="md:w-48">
                      <div className="relative h-16 w-full rounded-lg overflow-hidden">
                        <Image
                          src={option.providerLogo}
                          alt={option.provider}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium">{option.provider}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-primary" />
                        {option.rating}
                      </div>
                    </div>

                    {/* Journey Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{option.departure.time}</p>
                          <p className="text-sm text-muted-foreground">{option.departure.city}</p>
                          {option.departure.terminal && (
                            <Badge variant="secondary">{option.departure.terminal}</Badge>
                          )}
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="h-[2px] flex-1 bg-border" />
                          <div className="text-center">
                            <p className="text-sm font-medium">{option.duration}</p>
                            <p className="text-xs text-muted-foreground">Direct</p>
                          </div>
                          <div className="h-[2px] flex-1 bg-border" />
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{option.arrival.time}</p>
                          <p className="text-sm text-muted-foreground">{option.arrival.city}</p>
                          {option.arrival.terminal && (
                            <Badge variant="secondary">{option.arrival.terminal}</Badge>
                          )}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {option.amenities.map((amenity) => (
                          <Badge key={amenity} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="md:w-48 flex flex-col items-center justify-between">
                      <div className="text-center">
                        <p className="text-3xl font-bold">${option.price}</p>
                        <p className="text-sm text-muted-foreground">per person</p>
                      </div>
                      <Button className="w-full">Select</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}