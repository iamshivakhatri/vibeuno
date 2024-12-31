import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function StatesHeader() {
  return (
    <div className="bg-white border-b">
      <div className="container py-12 px-4 md:px-6">
        <h1 className="text-4xl font-semibold mb-4 font-sans">Explore States</h1>
        <p className="text-lg text-gray-600 mb-8 font-sans max-w-2xl">
          Discover amazing places across the United States. From bustling cities to serene natural wonders.
        </p>
        <div className="flex gap-2 max-w-md">
          <Input 
            placeholder="Search states..." 
            className="font-sans"
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}