export interface CategoryItem {
  title: string;
  description: string;
  imageUrl?: string;
  likes?: number;
  author?: string;
}

export interface PhotoGalleryItem {
  imageUrl: string;
  author: string;
  likes: number;
  caption?: string;
  takenAt?: string;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  icon: string;
}

export interface DressCode {
  recommendations: string[];
  tips: string;
}

export interface PlaceDetails {
  name: string;
  shortDescription: string;
  longDescription: string;
  bestTimeToVisit: string;
  knownFor: string;
  language: string;
  photos: PhotoGalleryItem[];
  weather: WeatherInfo;
  dressCode: DressCode;
  nearbyPlaces: CategoryItem[];
  dining: CategoryItem[];
  activities: CategoryItem[];
}