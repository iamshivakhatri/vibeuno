import { useQuery } from '@tanstack/react-query';

interface FetchAISuggestionsResponse {
    suggestions: string[];
    error?: string;
}

const fetchAISuggestions = async (selectedDestination: string): Promise<FetchAISuggestionsResponse> => {
    const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ place: selectedDestination }),
    });

    if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
    }

    const data: FetchAISuggestionsResponse = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }

    return data; // Return the data for React Query to cache
};

import { UseQueryResult } from '@tanstack/react-query';

interface AISuggestionsResponse {
    suggestions: string[];
    error?: string;
}

export const useAISuggestions = (selectedDestination: string): UseQueryResult<AISuggestionsResponse, Error> => {
    return useQuery<AISuggestionsResponse, Error>(
        {
            queryKey: ['aiSuggestions', selectedDestination], // Unique query key
            queryFn: () => fetchAISuggestions(selectedDestination),
            enabled: !!selectedDestination, // Only run if there's a selectedDestination
            staleTime: 3 * 60 * 1000, // The data remains fresh for 3 minutes (adjust as needed)
        }
    );
};
