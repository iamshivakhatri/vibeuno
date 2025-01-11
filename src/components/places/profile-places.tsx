// Import the PlaceCard component to display individual places
import { PlaceCard } from './place-card';

// Define the interface for the component's props
interface PlaceGridProps {
  places: Place[]; // List of places to display
  viewMode ?: 'grid' | 'list';

}

// Define the structure of the Place data type
type Place = {
  state: string; // State where the place is located
  name: string; // Name of the place
  id: string; // Unique ID for the place
  description: string | null; // Description of the place, may be null
  city: string; // City where the place is located
  category: string; // Category of the place (e.g., "entertainment")
  imageUrl?: string | null; // URL of an image associated with the place, may be null
_count: {
        votes: number; // Number of votes for the place
    };
};

export function PlaceGrid({ places, viewMode = 'grid' }: PlaceGridProps) {
  // Check if there are no places and display a message if none found
  if (!places || places.length === 0) {
    return <div className="flex items-center justify-center h-[250px]">No places found.</div>;
  }

  // Define container classes based on viewMode
  const containerClasses = viewMode === 'grid'
    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-6"
    : "flex flex-col gap-4 mt-6 ";

  // Return a grid of place cards
  return (
    <div className={containerClasses}>
      {places.map((place) => (
        <PlaceCard
          key={place.id} // Use the place ID as the key for each card
          place={{
            id: place.id, // Place ID
            name: place.name, // Place name
            description: place.description || '', // Place description (defaults to empty string if null)
            imageUrl: place.imageUrl || '', // Place image URL (defaults to empty string if null)
            _count: {
              votes: place._count.votes || 0, // Place votes count (defaults to 0 if undefined)
            },
            city: place.city, // Place city
          }}
       // Flag to indicate if the current user is the owner of the place
        />
      ))}
    </div>
  );
}
