export interface TripData {
  stops: Array<{
    name: string
    coordinates: {
      lat: number
      lng: number
    }
  }>
  travelers: number
  traveldays: number
}

export interface PlaceSuggestion {
  name: string
  lat: number
  lng: number
  countryName: string
  adminName1: string
}

