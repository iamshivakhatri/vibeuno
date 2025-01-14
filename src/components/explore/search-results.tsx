"use client";

import { useEffect, useState } from "react";
import { PlaceOverview } from "./place-overview";
import { CategorySection } from "./category-section";
import { WeatherDress } from "./weather-dress";
import { PLACE_DATA } from "@/lib/explore/data";
import { searchPlace } from "@/lib/explore/api";
import type { PlaceDetails } from "@/lib/explore/types";

interface SearchResultsProps {
  searchQuery: string;
}

export function SearchResults({ searchQuery }: SearchResultsProps) {
  const [placeData, setPlaceData] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log(searchQuery);


  useEffect(() => {
    async function fetchPlaceData() {
      setLoading(true);
      setError(null);

      try {
        // First check our local data
        const localData = PLACE_DATA[searchQuery.toLowerCase().trim()];
        if (localData) {
          setPlaceData(localData);
          return;
        }

        // If not in local data, fetch from API
        const apiData = await searchPlace(searchQuery);
        if (apiData) {
          setPlaceData(apiData);
        } else {
          setError(`No results found for "${searchQuery}"`);
        }
      } catch (err) {
        setError('Failed to fetch place data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (searchQuery) {
      fetchPlaceData();
    }
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground py-8">
        {error}
      </div>
    );
  }

  if (!placeData) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PlaceOverview placeData={placeData} />
      
      {/* <WeatherDress 
        weather={placeData.weather}
        dressCode={placeData.dressCode}
      /> */}
      
      {placeData.nearbyPlaces.length > 0 && (
        <CategorySection
          title="Nearby Places"
          items={placeData.nearbyPlaces}
          showTopList
        />
      )}

      {placeData.dining.length > 0 && (
        <CategorySection
          title="Food & Dining"
          items={placeData.dining}
          showTopList
        />
      )}

      {placeData.activities.length > 0 && (
        <CategorySection
          title="Things to Do"
          items={placeData.activities}
          showTopList
        />
      )}
      
    </div>
  );
}