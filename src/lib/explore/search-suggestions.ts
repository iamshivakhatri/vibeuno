// export const CITY_SUGGESTIONS = [
//   "Cincinnati, Ohio, USA",
//   "Cinque Terre, Italy",
//   "Cingoli, Italy",
//   "Cienfuegos, Cuba",
//   "Cinnaminson, New Jersey, USA"
// ];

// export function getSearchSuggestions(query: string): string[] {
//   const normalizedQuery = query.toLowerCase();
//   return CITY_SUGGESTIONS.filter(city => 
//     city.toLowerCase().startsWith(normalizedQuery)
//   );
// }

// Types for GeoNames API response
interface GeoNamesResult {
  name: string;
  adminName1: string;  // State/Province
  countryName: string;
  geonameId: number;
}

interface GeoNamesResponse {
  geonames: GeoNamesResult[];
  status?: {
    message: string;
  }
}

export async function getSearchSuggestions(query: string): Promise<string[]> {
  // Return empty array if query is too short
  if (query.length < 2) {
    return [];
  }

  try {
    // Fetch results from GeoNames API
    const response = await fetch(
      `http://api.geonames.org/searchJSON?` +
      `name_startsWith=${encodeURIComponent(query)}` +
      `&maxRows=5` +
      `&username=shivakhatri01` +
      `&style=FULL` +
      `&featureClass=P` +
      `&orderby=population`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const data: GeoNamesResponse = await response.json();

    // Check for API errors
    if (data.status) {
      throw new Error(data.status.message);
    }

    // Format results similar to original format
    return data.geonames.map(place => {
      const parts = [
        place.name,
        place.adminName1,
        place.countryName
      ].filter(Boolean); // Remove empty/undefined values
      
      return parts.join(", ");
    });

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

// Example usage:
// const suggestions = await getSearchSuggestions("New");
// Returns: ["New York, New York, USA", "New Delhi, Delhi, India", ...]