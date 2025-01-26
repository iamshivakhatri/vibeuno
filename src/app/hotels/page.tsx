"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Star, School as Pool, Wifi, Coffee, Utensils, Heart, ChevronLeft, ChevronRight, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type Hotel = {
  id: string;
  name: string;
  images: string[];
  price: number;
  rating: number;
  location: string;
  distance: string;
  amenities: string[];
  description: string;
  reviews: number;
};

type Suggestion = {
  text: string;
  icon: JSX.Element;
};

export default function HotelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({});

  // Dummy data
  const suggestions: Suggestion[] = [
    { text: "Luxury Stays", icon: <Star className="w-4 h-4" /> },
    { text: "Near Landmarks", icon: <MapPin className="w-4 h-4" /> },
    { text: "Family Friendly", icon: <Users className="w-4 h-4" /> },
    { text: "Business Travel", icon: <Coffee className="w-4 h-4" /> }
  ];

  const hotels: Hotel[] = [
    {
      id: "1",
      name: "Le Grand Palace",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e"
      ],
      price: 299,
      rating: 4.8,
      location: "8th arr., Paris",
      distance: "0.3 km from Eiffel Tower",
      amenities: ["Pool", "Spa", "Restaurant", "Free WiFi"],
      description: "Luxury hotel with stunning Eiffel Tower views",
      reviews: 1234
    },
    {
      id: "2",
      name: "Riverside Boutique",
      images: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39",
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
      ],
      price: 189,
      rating: 4.5,
      location: "Seine River, Paris",
      distance: "1.2 km from Notre-Dame",
      amenities: ["Restaurant", "Free WiFi", "Bar", "Room Service"],
      description: "Charming boutique hotel by the Seine",
      reviews: 856
    }
  ];

  const nextImage = (hotelId: string) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % hotels.find(h => h.id === hotelId)!.images.length
    }));
  };

  const prevImage = (hotelId: string) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + hotels.find(h => h.id === hotelId)!.images.length) % hotels.find(h => h.id === hotelId)!.images.length
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Search Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
          alt="Hotel Search"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">
              Find Your Perfect Stay
            </h1>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder='Try "Paris hotel near Eiffel Tower under $200/night"'
                className="w-full h-14 pl-12 pr-4 text-lg rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Suggestions */}
            <ScrollArea className="w-full mt-4">
              <div className="flex gap-2 pb-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="secondary"
                    className="rounded-full whitespace-nowrap"
                    onClick={() => setSearchQuery(suggestion.text)}
                  >
                    {suggestion.icon}
                    <span className="ml-2">{suggestion.text}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          {/* Filters */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>

                {/* Price Range */}
                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    defaultValue={[50, 500]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>

                {/* Amenities */}
                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start">
                      <Pool className="mr-2 h-4 w-4" /> Pool
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Wifi className="mr-2 h-4 w-4" /> WiFi
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Coffee className="mr-2 h-4 w-4" /> Breakfast
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Utensils className="mr-2 h-4 w-4" /> Restaurant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Results */}
          <div className="space-y-6">
            {hotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                      {/* Image Carousel */}
                      <div className="relative aspect-[4/3]">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentImageIndexes[hotel.id] || 0}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0"
                          >
                            <Image
                              src={hotel.images[currentImageIndexes[hotel.id] || 0]}
                              alt={hotel.name}
                              fill
                              className="object-cover"
                            />
                          </motion.div>
                        </AnimatePresence>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => prevImage(hotel.id)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => nextImage(hotel.id)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 bg-black/20 hover:bg-black/40 text-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Hotel Info */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {hotel.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${hotel.price}</p>
                            <p className="text-sm text-muted-foreground">per night</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3 fill-primary" />
                              {hotel.rating}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {hotel.reviews.toLocaleString()} reviews
                            </span>
                            <Badge variant="outline" className="gap-1">
                              <MapPin className="h-3 w-3" />
                              {hotel.distance}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground">{hotel.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity) => (
                              <Badge key={amenity} variant="secondary">
                                {amenity}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-3">
                            <Button className="flex-1">Book Now</Button>
                            <Button variant="outline" className="flex-1">View Details</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}