'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { STATE_IMAGE_URLS } from '@/lib/states';

interface StateCardProps {
  state: string;
}

export function StateCard({ state }: StateCardProps) {
  const imageUrl = STATE_IMAGE_URLS[state as keyof typeof STATE_IMAGE_URLS] || 
    `https://source.unsplash.com/featured/?${encodeURIComponent(state)},landscape`;

  return (
    <Link href={`/states/${state.toLowerCase().replace(/\s+/g, '-')}`}>
      <Card className="group overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
        <div className="aspect-[16/9] relative">
          <Image
            src={imageUrl}
            alt={state}
            className="object-cover w-full h-full"
            width={800}
            height={450}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl font-semibold text-white font-sans">{state}</h2>
          </div>
        </div>
      </Card>
    </Link>
  );
}