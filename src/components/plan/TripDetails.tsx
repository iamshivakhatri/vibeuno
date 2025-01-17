

'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TripData } from '@/types/trip';
import { MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { Compass as GasPump, UtensilsCrossed, Hotel } from 'lucide-react';


interface TripDetailsProps {
  tripData: Partial<TripData>;
}

export default function TripDetails({ tripData }: TripDetailsProps) {
  const [selectedHotelStars, setSelectedHotelStars] = useState(3);
  const [routeDetails, setRouteDetails] = useState<any>(null);

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
            ${selectedHotelStars * 50} per night
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





    </div>
  );
}
