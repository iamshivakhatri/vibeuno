'use client';

import { PlaceCard } from './place-card';
import { useEffect, useState } from 'react';
import { getPlaces } from '@/actions/place';
// import { Place } from '@prisma/client';

interface PlaceGridProps {
  state: string;
}

type Place = {
  state: string;
  name: string;
  id: string;
  description: string | null;
  city: string;
  category: string;
  imageUrl?: string | undefined | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  _count: {
    votes: number;
  };
}

export function PlaceGrid({ state }: PlaceGridProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await getPlaces(state);
        console.log('Places after pulling:', data);
        setPlaces(data);
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlaces();
  }, [state]);

  if (isLoading) {
    return <div>Loading places...</div>;
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6"
    >
      {places.map((place) => (
        <PlaceCard
          key={place.id}
          place={{
            id: place.id,
            name: place.name,
            description: place.description || '',
            imageUrl: place.imageUrl || null || undefined,
            _count: {
              votes: place._count.votes || 0,
            },
            city: place.city,
          }}
        />
      ))}
    </div>
  );
}
