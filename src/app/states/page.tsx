import { StatesGrid } from '@/components/states/states-grid';
import { StatesHeader } from '@/components/states/states-header';

export default function StatesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StatesHeader />
      <div className="container py-8">
        <StatesGrid />
      </div>
    </div>
  );
}