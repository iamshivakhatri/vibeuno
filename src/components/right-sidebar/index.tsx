
"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  TrendingUp, 
  Calendar
} from "lucide-react";

type RightSidebarProps = {
  trendingCities: Array<{ name: string; image: string; count: number }>;
  upcomingEvents: Array<{ name: string; city: string; date: string; image: string }>;
  localExperts: Array<{ name: string; city: string; expertise: string; avatar: string }>;
};



export const RightSidebar = ({ trendingCities, upcomingEvents, localExperts }: RightSidebarProps) => {
    return (
      <div className="space-y-6">
        {/* Trending Cities */}
        <div className="bg-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Trending Cities</h3>
          </div>
          <div className="space-y-4">
            {trendingCities.map((city) => (
              <Link
                key={city.name}
                href={`/city/${city.name.toLowerCase()}`}
                className="flex items-center gap-3 group"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-primary">
                    {city.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {city.count} places
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
  
        {/* Upcoming Events */}
        <div className="bg-card rounded-lg p-2">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Events & Festivals</h3>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.name} className="group">
                <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <p className="font-semibold">{event.name}</p>
                    <p className="text-sm">{event.city}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            ))}
          </div>
        </div>
  
        {/* Local Experts */}
        {/* <div className="bg-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Ask Locals</h3>
          </div>
          <div className="space-y-4">
            {localExperts.map((expert) => (
              <div key={expert.name} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <Image
                    src={expert.avatar}
                    alt={expert.name}
                    width={40}
                    height={40}
                  />
                </Avatar>
                <div>
                  <p className="font-semibold">{expert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {expert.expertise} • {expert.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}


      </div>
    );
  }