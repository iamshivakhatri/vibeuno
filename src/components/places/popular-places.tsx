'use client'; // Ensure this is a Client Component

import { getPopularPlaces } from '@/actions/place';
import PopularPlaceCard from './popular-place-card';
import { useQuery } from '@tanstack/react-query';
import Loader from '../global/loader';

export default function PopularPlaces() {
  const { data: popularPlaces, isLoading, error } = useQuery({
    queryKey: ['popularPlaces'],
    queryFn: () => getPopularPlaces(),
  });

  if (isLoading) return
  (
   <Loader state={true} />
  )
   
   
  if (error) return <div>Error loading popular places.</div>;
  if (!popularPlaces || !popularPlaces.length) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
          <p className="mt-2 text-gray-600">Discover the most loved places by our community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPlaces.map((place) => (
            <PopularPlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
    </section>
  );
}
