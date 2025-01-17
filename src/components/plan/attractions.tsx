"use client";

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AttractionsProps {
  location: string;
}

interface Attraction {
  name: string;
  description: string;
  image: string;
  rating: number;
}

// Mock attractions data (replace with real API)
const MOCK_ATTRACTIONS: Attraction[] = [
  {
    name: "City Museum",
    description: "Historic museum featuring local artifacts",
    image: "https://images.unsplash.com/photo-1582711012153-0671c94a3ae8?auto=format&fit=crop&q=80&w=2970",
    rating: 4.5
  },
  {
    name: "Central Park",
    description: "Large urban park with walking trails",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2970",
    rating: 4.8
  },
  {
    name: "Art Gallery",
    description: "Modern art exhibitions and events",
    image: "https://images.unsplash.com/photo-1594970484107-dbf0e488a14c?auto=format&fit=crop&q=80&w=2968",
    rating: 4.3
  }
];

export function Attractions({ location }: AttractionsProps) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!location) return;

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setAttractions(MOCK_ATTRACTIONS);
      setLoading(false);
    }, 1000);
  }, [location]);

  if (!location) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5" />
        <h2 className="font-semibold">Popular Attractions</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-16 h-16 bg-muted rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {attractions.map((attraction) => (
            <div key={attraction.name} className="flex gap-4">
              <img
                src={attraction.image}
                alt={attraction.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{attraction.name}</h3>
                <p className="text-sm text-muted-foreground">{attraction.description}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-medium">{attraction.rating}</span>
                  <span className="text-yellow-400">★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}