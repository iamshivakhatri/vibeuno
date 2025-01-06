"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoGallery } from "./photo-gallery";
import type { PlaceDetails } from "@/lib/explore/types";
import { WeatherDress } from "./weather-dress";

interface PlaceOverviewProps {
  placeData: PlaceDetails;
}

export function PlaceOverview({ placeData }: PlaceOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
// add these two inside the card

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{placeData.name}</h2>
            <p className="text-muted-foreground">
              {placeData.shortDescription}
            </p>
            
            <div className={`space-y-4 ${isExpanded ? "" : "line-clamp-3"}`}>
              <p>{placeData.longDescription}</p>
              
              {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">Best Time to Visit</h4>
                      <p className="text-sm text-muted-foreground">{placeData.bestTimeToVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">Known For</h4>
                      <p className="text-sm text-muted-foreground">{placeData.knownFor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">Language</h4>
                      <p className="text-sm text-muted-foreground">{placeData.language}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Read More
            </>
          )}
        </Button>
        <WeatherDress 
          weather={placeData.weather}
          dressCode={placeData.dressCode}
          />

        <div className="mt-8">
          <PhotoGallery photos={placeData.photos} />
        </div>
      </CardContent>
    </Card>
  );
}