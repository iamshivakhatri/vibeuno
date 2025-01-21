// "use client";

import { useParams } from "next/navigation";
import { MapPin, Users, TrendingUp, Camera, Bookmark, MessageSquare } from "lucide-react";
import Image from "next/image";

// This is required for static site generation with dynamic routes
export function generateStaticParams() {
  // Add all the cities you want to pre-render
  return [
    { cityName: 'new-york' },
    { cityName: 'los-angeles' },
    { cityName: 'chicago' },
    { cityName: 'houston' },
    { cityName: 'phoenix' },
    { cityName: 'philadelphia' },
    { cityName: 'san-antonio' },
    { cityName: 'san-diego' },
    { cityName: 'dallas' },
    { cityName: 'san-jose' }
  ];
}

export default function CityPage() {
  // const { cityName } = useParams();

  const cityName = 'dallas'
  const formattedCityName = (cityName as string).replace(/-/g, ' ');

  // This would be replaced with real data from your API
  const cityStats = {
    members: 12453,
    places: 342,
    trending: "+24%"
  };

  const featuredPlaces = [
    {
      id: 1,
      name: "Central Park",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      votes: 1234,
      comments: 89,
      category: "Parks"
    },
    {
      id: 2,
      name: "Art Museum",
      imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
      votes: 892,
      comments: 45,
      category: "Culture"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        <Image
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000"
          alt={formattedCityName}
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h1 className="text-4xl font-bold text-white mb-2">{formattedCityName}</h1>
          <div className="flex gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{cityStats.members.toLocaleString()} members</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{cityStats.places} places</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>{cityStats.trending} this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Featured Places */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Featured Places</h2>
              <button className="text-primary hover:underline">View all</button>
            </div>
            
            <div className="grid gap-6">
              {featuredPlaces.map((place) => (
                <div key={place.id} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={place.imageUrl}
                      alt={place.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
                      {place.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{place.votes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{place.comments}</span>
                      </div>
                      <button className="ml-auto text-primary hover:text-primary/80">
                        <Bookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - City Info & Categories */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">About {formattedCityName}</h3>
              <p className="text-muted-foreground mb-4">
                Discover the best places, share your experiences, and connect with fellow travelers
                in {formattedCityName}. From hidden gems to popular attractions, find everything
                you need to know about this amazing city.
              </p>
              <button className="w-full bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors">
                Share Your Experience
              </button>
            </div>

            <div className="bg-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Popular Categories</h3>
              <div className="space-y-2">
                {["Restaurants", "Parks", "Museums", "Nightlife", "Shopping"].map((category) => (
                  <button
                    key={category}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center justify-between"
                  >
                    <span>{category}</span>
                    <Camera className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}