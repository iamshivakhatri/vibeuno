// VisitedPlacesContent.tsx
import { PlaceGrid } from '@/components/places/profile-places';
import { TabsContent } from '../ui/tabs';

import {Place} from "@/types/index.type";

interface VisitedPlacesContentProps {
  visitedPlaces: Place[];
}

export function VisitedPlacesContent({ visitedPlaces }: VisitedPlacesContentProps) {
  return (
    <TabsContent value="visited">
      <PlaceGrid places={visitedPlaces} />
      {/* You can add more functionality here, such as adding places to wishlist */}
    </TabsContent>
  );
}