import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { STATE_IMAGE_URLS } from '@/lib/states';



interface StateHeaderProps {
  state: string;
}

export function StateHeader({ state }: StateHeaderProps) {
  const imageUrl = STATE_IMAGE_URLS[state as keyof typeof STATE_IMAGE_URLS] || 'https://source.unsplash.com/featured/?landscape';

  return (
    <div
    className="relative h-[300px] flex items-end bg-cover bg-center"
    style={{ backgroundImage: `url(${imageUrl})` }}
  >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="relative z-10 container py-8">
        <h1 className="text-4xl font-bold text-white mb-4">{state}</h1>
        <div className="flex gap-4">
          <Button asChild variant="secondary">
            <Link href={`/states/${state.toLowerCase()}/cities`}>
              Explore Cities
            </Link>
          </Button>
          <Button asChild>
            <Link href="/add-place">
              Add Place
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}