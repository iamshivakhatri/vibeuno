'use client';

import { PlaceCard } from '@/components/places/place-card';

interface PlaceGridProps {
  places: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    city: string;
    state: string;
    _count: { votes: number };
  }>;
}

export function PlaceGrid({ places }: PlaceGridProps) {
  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No places added yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}