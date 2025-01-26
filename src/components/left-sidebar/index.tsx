"use client";

import { getAllCityName } from "@/actions/place";
import { Button } from "@/components/ui/button";
import {
  Compass,
  BookMarked,
  Users,
  Calculator,
  Plane,
  Globe2,
  Route,
  MessageCircle,
  CameraIcon,
  MapPin,
  Building2,
  HomeIcon,
  HotelIcon
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

export const LeftSidebar = () => {
  const { data: cities } = useQuery({
    queryKey: ["getAllCityName"],
    queryFn: () => getAllCityName(),
  });

  return (
    <div className="space-y-4">
      {/* Navigation Section */}
      <h3 className="font-semibold px-2">Quick Links</h3>

      <div className="space-y-2">
        <Link
          href="/home"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
        >
          <HomeIcon className="w-5 h-5" />
          <span className="font-medium">Home</span>
        </Link>
        <Link
          href="/upload"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
        >
          <CameraIcon className="w-5 h-5" />
          <span className="font-medium">Upload</span>
        </Link>
        <Link
          href="/explore"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
        >
          <Compass className="w-5 h-5" />
          <span className="font-medium">Explore</span>
        </Link>
        {/* <Link
          href="/profile"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
        >
          <BookMarked className="w-5 h-5" />
          <span className="font-medium">Saved Routes</span>
        </Link>
        <Link
          href="/buddies"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
        >
          <Users className="w-5 h-5" />
          <span className="font-medium">Travel Buddies</span>
        </Link> */}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold px-2">Travel Tools</h3>

        <Link
          href="/plan"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
        >
          <Calculator className="w-5 h-5" />
          Budget Calculator
        </Link>

        {/* <Link
          href="/hotels"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
        >
          <HotelIcon className="w-5 h-5" />
          Hotels
        </Link> */}

        {/* <Link
          href="/guide"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
        >
          <Globe2 className="w-5 h-5" />
          Language Guide
        </Link> */}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold px-2">Cities</h3>
        <div className="h-32 overflow-y-auto border rounded-lg p-2">
          {cities &&
            cities.map((city, index) => (
              <Link
                key={index}
                href={`/city/${city.name}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
              >
                <Building2 className="w-5 h-5" />
                <span>
                  {city.name
                    .replace(/-/g, ' ') // Replace hyphens with spaces
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                  ,{' '}
                  {city.country}
                </span>

              </Link>
            ))}
        </div>
      </div>

      {/* Quick Access */}
      {/* <div className="space-y-4">
        <h3 className="font-semibold px-2">Quick Access</h3>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Route className="w-5 h-5" />
            My Itineraries
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <MessageCircle className="w-5 h-5" />
            Travel Forums
          </Button>
        </div>
      </div> */}


      
    </div>
  );
};
