export const API_CONFIG = {
  OPENCAGE_API_KEY: process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || '',
  OPENWEATHERMAP_API_KEY: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || '',
  OPENWEATHERMAP_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  OPENCAGE_BASE_URL: 'https://api.opencagedata.com/geocode/v1',
  // For now, let's use OpenCage for geocoding and OpenWeatherMap for weather
  // This gives us enough data to show a meaningful demo
  // We'll implement proper place details later with a more comprehensive API
};

// Validate API configuration
export function validateApiConfig() {
  if (!API_CONFIG.OPENCAGE_API_KEY) {
    throw new Error('OpenCage API key is not configured');
  }
  if (!API_CONFIG.OPENWEATHERMAP_API_KEY) {
    throw new Error('OpenWeatherMap API key is not configured');
  }
}