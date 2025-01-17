"use client";

import { useState, useEffect } from 'react';
import { Hotel, Star, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface HotelListProps {
  location: string;
  starRating: number;
  travelers: number;
  duration: number;
}

interface Hotel {
  name: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
}

// Mock hotel data (replace with real API)
const MOCK_HOTELS: Hotel[] = [
  {
    name: "Grand Hotel",
    rating: 5,
    price: 299,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2970",
    amenities: ["Pool", "Spa", "Restaurant", "Gym"]
  },
  {
    name: "Business Inn",
    rating: 4,
    price: 199,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=2970",
    amenities: ["Restaurant", "Business Center", "Gym"]
  },
  {
    name: "Comfort Stay",
    rating: 3,
    price: 129,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=2970",
    amenities: ["Free Breakfast", "Wifi", "Parking"]
  }
];

export function HotelList({ location, starRating, travelers, duration }: HotelListProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setHotels(MOCK_HOTELS.filter(hotel => hotel.rating >= starRating));
      setLoading(false);
    }, 1000);
  }, [location, starRating]);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Hotel className="h-5 w-5" />
        <h2 className="font-semibold">Available Hotels</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.name} className="flex flex-col md:flex-row gap-6 border rounded-lg p-4">
              <div className="relative w-full md:w-48 h-48">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: hotel.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                </div>

                <div className="flex items-center gap-1 text-lg font-semibold mb-4">
                  <DollarSign className="h-4 w-4" />
                  {hotel.price} / night
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Total for {duration} nights, {travelers} travelers:
                    <span className="font-semibold text-foreground ml-2">
                      ${hotel.price * duration * Math.ceil(travelers / 2)}
                    </span>
                  </p>
                  <Button>Book Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}