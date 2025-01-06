import { API_CONFIG } from './api-config';
import type { PlaceDetails } from './types';
import { getWeatherIcon, getBestTimeToVisit, getDefaultDressCode } from './utils';
import { mockPhotos, mockNearbyPlaces, mockDining, mockActivities } from './mock-data';
import { PLACE_DATA } from './data';

export async function searchPlace(query: string): Promise<PlaceDetails | null> {
  try {
    // First check if we have predefined data
    const normalizedQuery = query.toLowerCase().trim();
    const predefinedData = PLACE_DATA[normalizedQuery];
    if (predefinedData) {
      return predefinedData;
    }

    // Get coordinates from OpenCage
    const geocodeUrl = `${API_CONFIG.OPENCAGE_BASE_URL}/json?q=${encodeURIComponent(query)}&key=${API_CONFIG.OPENCAGE_API_KEY}&language=en&pretty=1`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results?.[0]) {
      console.log('No results found for query:', query);
      return null;
    }

    const place = geocodeData.results[0];
    const { lat, lng } = place.geometry;
    
    // Get weather data
    const weatherUrl = `${API_CONFIG.OPENWEATHERMAP_BASE_URL}/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_CONFIG.OPENWEATHERMAP_API_KEY}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Extract place details
    const components = place.components;
    const formatted = place.formatted;
    const country = components.country;
    const city = components.city || components.town || components.village || '';

    // Create place details with mock data for user-generated content
    return {
      name: city || formatted.split(',')[0],
      shortDescription: `${city}, ${country}`,
      longDescription: `Discover ${city}, a beautiful destination in ${country}. This location offers visitors a unique blend of local culture, attractions, and experiences.`,
      bestTimeToVisit: getBestTimeToVisit(lat),
      knownFor: 'Local Culture, Tourism',
      language: components.country_code?.toUpperCase() || '',
      photos: mockPhotos.default,
      weather: {
        temperature: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main,
        icon: getWeatherIcon(weatherData.weather[0].icon)
      },
      dressCode: getDefaultDressCode(weatherData.main.temp),
      nearbyPlaces: mockNearbyPlaces,
      dining: mockDining,
      activities: mockActivities
    };
  } catch (error) {
    console.error('Error fetching place data:', error);
    return null;
  }
}