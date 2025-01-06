export const CITY_SUGGESTIONS = [
  "Cincinnati, Ohio, USA",
  "Cinque Terre, Italy",
  "Cingoli, Italy",
  "Cienfuegos, Cuba",
  "Cinnaminson, New Jersey, USA"
];

export function getSearchSuggestions(query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  return CITY_SUGGESTIONS.filter(city => 
    city.toLowerCase().startsWith(normalizedQuery)
  );
}