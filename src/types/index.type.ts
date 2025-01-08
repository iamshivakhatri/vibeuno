export type Place = {
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