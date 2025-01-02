
// WishlistPlacesContent.tsx
import { PlaceGrid } from '@/components/places/profile-places';
import {Place} from "@/types/index.type";
import { TabsContent } from '../ui/tabs';


interface WishlistPlacesContentProps {
  wishlistPlaces: Place[];
}

export function WishlistPlacesContent({ wishlistPlaces }: WishlistPlacesContentProps) {
  return (
    <TabsContent value="wishlist">
      <PlaceGrid places={wishlistPlaces} />
    </TabsContent>
  );
}