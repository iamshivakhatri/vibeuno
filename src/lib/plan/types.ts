export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export interface RouteInfo {
  distance: number;
  duration: number;
  coordinates: [number, number][];
}

export interface TripCosts {
  gas: number;
  hotels: number;
  food: number;
  total: number;
}