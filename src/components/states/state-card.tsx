'use client';

import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

const STATE_IMAGES = {
  'California': 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'Florida': 'https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'Texas': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'Hawaii': 'https://images.unsplash.com/photo-1542259009477-d625272157b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
} as const;

interface StateCardProps {
  state: string;
}

export function StateCard({ state }: StateCardProps) {
  const imageUrl = STATE_IMAGES[state as keyof typeof STATE_IMAGES] || 
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