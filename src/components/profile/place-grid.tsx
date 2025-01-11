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
  viewMode?: 'grid' | 'list';
}

export function PlaceGrid({ places, viewMode = 'grid' }: PlaceGridProps) {
  if (places.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No places added yet.</p>
      </div>
    );
  }

  const gridClassName = viewMode === 'list'
    ? "flex flex-col gap-4"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={gridClassName}>
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} viewMode={viewMode} />
      ))}
    </div>
  );
}