

'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TripData } from '@/types/trip';
import { MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { Compass as GasPump, UtensilsCrossed, Hotel, MapIcon, Utensils, Loader2 } from 'lucide-react';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


interface TripDetailsProps {
  tripData: Partial<TripData>;
}

interface AISuggestions {
  activities: string[]
  food: string[]
}

interface Activity {
  name: string;
  description: string;
}

interface Food {
  name: string;
  description: string;
}

interface AiSuggestions {
  activities: Activity[];
  food: Food[];
}

const fetchAISuggestions = async (destination: string): Promise<AiSuggestions> => {
  const response = await fetch('/api/ai-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ place: destination }),
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.statusText}`);
  }

  return response.json();
};

export default function TripDetails({ tripData }: TripDetailsProps) {
  const [selectedHotelStars, setSelectedHotelStars] = useState(3);
  const [routeDetails, setRouteDetails] = useState<any>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null)
  // const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient();

 


  useEffect(() => {
    if (tripData.stops && tripData.stops.length >= 2) {
      const coordinates = tripData.stops
        .map(stop => `${stop.coordinates.lng},${stop.coordinates.lat}`)
        .join(';');
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?steps=true&geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      )
        .then(response => response.json())
        .then(setRouteDetails);
    }
  }, [tripData]);


  // useEffect(() => {
  //   const fetchAISuggestions = async () => {
  //     if (!selectedDestination) return null;

  //     setLoading(true);
  //     setError(null);

  //     try {
  //       console.log('Fetching suggestions for destination:', selectedDestination);

  //       const response = await fetch('/api/ai-suggestions', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ place: selectedDestination }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Server error: ${response.statusText}`);
  //       }

  //       const data: AiSuggestions = await response.json();


  //       console.log('AI suggestions received:', data);
  //       setAiSuggestions(data);

  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error('Error fetching AI suggestions:', error.message);
  //       } else {
  //         console.error('Error fetching AI suggestions:', error);
  //       }
  //       setError('Failed to fetch suggestions. Please try again.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAISuggestions();
  // }, [selectedDestination]);

 const {
    data: aiSuggestions,
    isLoading,
    isError,
  } = useQuery<AiSuggestions, Error>({
    queryKey: ['aiSuggestions', selectedDestination],
    queryFn: () => selectedDestination ? fetchAISuggestions(selectedDestination) : Promise.reject('No destination selected'),
    enabled: !!selectedDestination,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    // cacheTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
    retry: 2, // Retry failed requests twice
  });

  

  

  const calculateTripCost = () => {
    if (!routeDetails) return { total: 0, gasMoney: 0, foodMoney: 0, hotelMoney: 0 };


    const fuelCost = 3.2; // $/gallon
    const fuelEfficiency = 25; // miles/gal
    const foodCostPerDay = 30; // $ per person per day
    const hotelCostPerNight = selectedHotelStars * 50; // $ per night


    const totalDistance = routeDetails.routes[0].distance / 1609.34; // Convert meters to miles
    const totalDays = Math.ceil(routeDetails.routes[0].duration / (3600 * 24)); // Convert seconds to days

    const gasMoney = (totalDistance / fuelEfficiency) * fuelCost;
    const foodMoney = foodCostPerDay * (tripData.travelers || 1) * totalDays;
    const hotelMoney = hotelCostPerNight * (tripData.traveldays || 1)  // Assuming they don't need a hotel on the last day and 2 people per room
    
    console.log("hotelMoney", hotelMoney);
    return {
      gasMoney: gasMoney.toFixed(2),
      foodMoney: foodMoney.toFixed(2),
      hotelMoney: hotelMoney.toFixed(2),
      total: (gasMoney + foodMoney + hotelMoney).toFixed(2).toString()
    };
  };

  const tripCost = calculateTripCost();

  return (
    <div className="space-y-6 font-sans">


      <Card>
  <CardHeader>
    <CardTitle className="text-xl font-bold flex items-center">
      <MapPin className="mr-2" /> Trip Summary
    </CardTitle>
  </CardHeader>
  <CardContent>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      <div className="flex items-center gap-2">
        <MapPin className="text-green-500 h-5 w-5" />
        <div>
          <p className="text-sm text-muted-foreground">Origin</p>
          <p className="text-base font-medium">{tripData.stops?.[0].name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="text-red-500 h-5 w-5" />
        <div>
          <p className="text-sm text-muted-foreground">Destination</p>
          <p className="text-base font-medium">
            {tripData.stops?.[tripData.stops.length - 1].name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-500" />
        <p className="text-base font-medium">Travelers: {tripData.travelers}</p>
      </div>

      {routeDetails && (
      <div className="mt-4">
        <p className="flex items-center">
          <Clock className="h-5 w-5 text-orange-500 mr-2" />
          Estimated Travel Time: {Math.round(routeDetails.routes[0].duration / 3600)} hours
        </p>
        <p>
          Total Distance: {(routeDetails.routes[0].distance / 1609.34).toFixed(2)} miles
        </p>
      </div>
    )}
    </div>
    
    <div className="mt-4">
      <h3 className="font-semibold text-sm text-muted-foreground">Itinerary</h3>
      <ul className="list-disc pl-5 text-sm space-y-2">
        {tripData.stops?.map((stop, index) => (
          <li key={index} className="flex flex-col">
            <span>{stop.name}</span>
            {routeDetails &&
              routeDetails.routes[0].legs &&
              index < tripData.stops!.length - 1 && (
                <span className="text-xs text-gray-500">
                  Travel time to next stop:{" "}
                  {Math.round(
                    (routeDetails.routes[0].legs[index]?.duration || 0) / 3600
                  )}{" "}
                  hrs
                </span>
              )}
          </li>
        ))}
      </ul>
    </div>
  </CardContent>
</Card>



      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <DollarSign className="mr-2" /> Hotel Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            {[3, 4, 5].map(stars => (
              <Button
                key={stars}
                variant={selectedHotelStars === stars ? 'default' : 'outline'}
                onClick={() => setSelectedHotelStars(stars)}
                className="font-medium"
              >
                {stars} Stars
              </Button>
            ))}
          </div>
          <p className="text-2xl font-bold">
            ${selectedHotelStars * 30} per night
          </p>
        </CardContent>
      </Card>

     

      <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="h-5 w-5" />
        <h2 className="font-semibold">Estimated Trip Costs</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <GasPump className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Gas</p>
            <p className="text-xl font-semibold">${tripCost.gasMoney}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Hotel className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Hotels</p>
            <p className="text-xl font-semibold">${tripCost.hotelMoney}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <UtensilsCrossed className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Food</p>
            <p className="text-xl font-semibold">${tripCost.foodMoney}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Total Estimated Cost</p>
          <p className="text-2xl font-bold">${tripCost.total}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">Total Estimated Cost Per Person</p>
          <p className="text-2xl font-bold">${(parseFloat(tripCost.total as string) / (tripData.travelers || 1)).toFixed(2)}</p>
        </div>
      </div>
    </Card>


    {/* <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <MapPin className="mr-2" /> Destination Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg font-semibold">Select a destination to see AI-generated suggestions:</p>
            {tripData.stops?.map((stop, index) => (
              <Button
                key={index}
                onClick={() => setSelectedDestination(stop.name)}
                variant={selectedDestination === stop.name ? 'default' : 'outline'}
              >
                {stop.name}
              </Button>
            ))}
          </div>
          {selectedDestination && (
            <div className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <MapIcon className="mr-2" /> Things to Do in {selectedDestination}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <p>Loading suggestions...</p>
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : aiSuggestions && aiSuggestions.activities.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {aiSuggestions.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No suggestions available. Try selecting a different destination.</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <Utensils className="mr-2" /> Food and Dining in {selectedDestination}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <p>Loading suggestions...</p>
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error.toString()}</p>
                  ) : aiSuggestions && aiSuggestions.food.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {aiSuggestions.food.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No suggestions available. Try selecting a different destination.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card> */}

<Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <MapPin className="mr-2" /> Destination Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            Select a destination to see AI-generated suggestions:
          </p>
          {tripData.stops?.map((stop, index) => (
            <Button
              key={index}
              onClick={() => setSelectedDestination(stop.name)}
              variant={selectedDestination === stop.name ? 'default' : 'outline'}
            >
              {stop.name}
            </Button>
          ))}
        </div>

        {selectedDestination && (
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MapIcon className="mr-2" /> Things to Do in {selectedDestination}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p>Loading suggestions...</p>
                  </div>
                ) : isError ? (
                  <p className="text-red-500">{error || 'An error occurred'}</p>
                ) : aiSuggestions && aiSuggestions.activities.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {aiSuggestions.activities.map((activity, index) => (
                      <li key={index}>
                        <strong>{activity.name}</strong> - {activity.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No suggestions available. Try selecting a different destination.</p>
                )}
                
                
                

              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Utensils className="mr-2" /> Food and Dining in {selectedDestination}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <p>Loading suggestions...</p>
                  </div>
                ) : isError ? (
                  <p className="text-red-500">An error occurred</p>
                ) : aiSuggestions && aiSuggestions.food.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {aiSuggestions.food.map((item, index) => (
                      <li key={index}>
                        <strong>{item.name}</strong> - {item.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No suggestions available. Try selecting a different destination.</p>
                )}
               
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>





    </div>
  );
}
