'use client';

import { City } from '@/types/index.type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import Link from 'next/link';

interface CityCardProps {
  city: City;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/city/${city.id}`}>
        <div className="relative h-32">
          <img
            src={city.coverImage}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="font-semibold text-lg text-white">t/{city.name}</h3>
            <p className="text-sm text-white/80">{city.country}</p>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{city.members.toLocaleString()}</span> members
          </div>
          <Button size="sm" variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            Join
          </Button>
        </div>
      </div>
    </Card>
  );
}