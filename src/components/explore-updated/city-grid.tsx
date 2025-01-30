"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import type { City } from "@/types"

export default function CitiesGrid() {
  const { data: cities } = useQuery<City[]>({
    queryKey: ["cities"],
  })

  if (!cities) return null



  return (
    <div className="container mx-auto px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Popular Cities</h2>
        <p className="text-muted-foreground">Explore the world&apos;s most vibrant destinations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <Link href={`/city/${city.name.toLowerCase()}`} key={city.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  <Image src={city.places[0].image[0]  ||city.coverImage || "/placeholder.svg"} alt={city.name} fill className="object-cover" />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                  <h3 className="text-lg font-semibold">
                    Vibe/
                    {city.name.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    </h3>

                    <p className="text-sm text-muted-foreground">{city.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {city.state}, {city.country}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">{city.places.length} places</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

