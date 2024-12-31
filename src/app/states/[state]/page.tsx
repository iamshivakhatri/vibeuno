import { StateHeader } from '@/components/states/state-header';
import { PlaceGrid } from '@/components/places/place-grid';
import { PlaceFilters } from '@/components/places/place-filters';
import { US_STATES } from '@/lib/states';
import { notFound } from 'next/navigation';

interface StatePageProps {
  params: { state: string };
}

export function generateStaticParams() {
  return US_STATES.map((state) => ({
    state: state.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function StatePage({ params }: StatePageProps) {
  const state = decodeURIComponent(params.state).replace(/-/g, ' ');
  const formattedState = state.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  if (!US_STATES.map(s => s.toLowerCase()).includes(state.toLowerCase())) {
    notFound();
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <StateHeader state={formattedState} />
      <div className="container py-8">
        <PlaceFilters />
        <PlaceGrid state={formattedState} />
      </div>
    </div>
  );
}