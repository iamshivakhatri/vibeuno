import { CategoryItem, PhotoGalleryItem } from './types';

// Mock user-uploaded photos for different categories
export const mockPhotos: Record<string, PhotoGalleryItem[]> = {
  default: [
    {
      imageUrl: "https://images.unsplash.com/photo-1527142879-95b61a0b8226",
      author: "John Smith",
      likes: 1234,
      caption: "Beautiful sunset"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9",
      author: "Emma Wilson",
      likes: 982,
      caption: "City lights"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856",
      author: "Michael Brown",
      likes: 876,
      caption: "Street view"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1531572753322-ad063cecc140",
      author: "Sarah Johnson",
      likes: 654,
      caption: "Local market"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      author: "David Lee",
      likes: 543,
      caption: "Architecture"
    }
  ]
};

// Mock nearby places for any location
export const mockNearbyPlaces: CategoryItem[] = [
  {
    title: "Local Park",
    description: "Beautiful green space",
    imageUrl: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f",
    likes: 456,
    author: "Park Explorer"
  },
  {
    title: "Historic Museum",
    description: "Cultural heritage site",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04",
    likes: 389,
    author: "History Buff"
  },
  {
    title: "Central Square",
    description: "City gathering place",
    imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856",
    likes: 345,
    author: "City Guide"
  },
  {
    title: "Botanical Gardens",
    description: "Natural beauty",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae",
    likes: 298,
    author: "Nature Lover"
  },
  {
    title: "Shopping District",
    description: "Local markets and shops",
    imageUrl: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a",
    likes: 276,
    author: "Shop Local"
  }
];

// Mock dining options for any location
export const mockDining: CategoryItem[] = [
  {
    title: "Local Bistro",
    description: "Traditional cuisine",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    likes: 567,
    author: "Food Critic"
  },
  {
    title: "Café Central",
    description: "Coffee and pastries",
    imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    likes: 432,
    author: "Coffee Lover"
  },
  {
    title: "Market Restaurant",
    description: "Fresh local ingredients",
    imageUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae",
    likes: 398,
    author: "Chef's Choice"
  },
  {
    title: "Street Food Corner",
    description: "Authentic street food",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    likes: 345,
    author: "Street Food Fan"
  },
  {
    title: "Rooftop Bar",
    description: "Drinks with a view",
    imageUrl: "https://images.unsplash.com/photo-1470337458703-46ad1756a187",
    likes: 289,
    author: "Night Life"
  }
];

// Mock activities for any location
export const mockActivities: CategoryItem[] = [
  {
    title: "Walking Tour",
    description: "Explore the city on foot",
    imageUrl: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd",
    likes: 432,
    author: "Tour Guide"
  },
  {
    title: "Local Markets",
    description: "Shop like a local",
    imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e",
    likes: 387,
    author: "Market Explorer"
  },
  {
    title: "Sunset Viewpoint",
    description: "Best views in town",
    imageUrl: "https://images.unsplash.com/photo-1506059612708-99d6c258160e",
    likes: 356,
    author: "Sunset Chaser"
  },
  {
    title: "Cultural Show",
    description: "Traditional performances",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
    likes: 298,
    author: "Culture Seeker"
  },
  {
    title: "Bike Rental",
    description: "Explore on two wheels",
    imageUrl: "https://images.unsplash.com/photo-1471506480208-91b3a4cc78be",
    likes: 276,
    author: "Bike Enthusiast"
  }
];