"use client";

import { useEffect, useState } from "react";
import { getPlaces, getPlacesData } from "@/actions/place";
import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Place = {
  id: string;
  name: string | null;
  description: string | null;
  imageUrl: string | null;
};

export function PlacesSection() {
  const [expanded, setExpanded] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadPlaces = async () => {
      const data = await getPlacesData();
      setPlaces(data);
    };
    loadPlaces();
  }, []);

  const displayPlaces = expanded ? places : places.slice(0, 9);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Popular Places</h2>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push('/explore/places')}
          className="flex items-center gap-2"
        >
          {expanded ? "Show Less" : "View All"}
          <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {displayPlaces.map((place) => (
          <div
            key={place.id}
            className="group relative overflow-hidden rounded-lg cursor-pointer"
            onClick={() => router.push(`/places/${place.id}`)}
          >


            <div className="aspect-[4/3] relative">
              <Image
                src={place.imageUrl || "/placeholder.jpg"}
                alt={place.name || " "}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 w-full   from-black to-transparent p-4">
              <h3 className="text-lg font-semibold text-white">{place.name}</h3>
              <p className="text-sm text-white/80">{place.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 