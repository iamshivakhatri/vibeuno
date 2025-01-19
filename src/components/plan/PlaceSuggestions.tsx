'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface Place {
  name: string
  description: string
  lat: number
  lng: number
}

interface PlaceSuggestionsProps {
  origin: { name: string; lat: number; lng: number }
  destination: { name: string; lat: number; lng: number }
  onAddStop: (place: Place) => void
}

export default function PlaceSuggestions({ origin, destination, onAddStop }: PlaceSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Place[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/ai-place-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ origin, destination }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions')
        }

        const data = await response.json()
        setSuggestions(data.suggestions)
        console.log("this is the suggestions", data.suggestions)

      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }


    if (origin && destination) {
      fetchSuggestions()
    }
  }, [origin, destination])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Stops</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading suggestions...</span>
          </div>
        ) : suggestions.length > 0 ? (
          <ul className="space-y-4">
            {suggestions.map((place, index) => (
              <li key={index} className="border-b pb-4 last:border-b-0">
                <h3 className="font-semibold">{place.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{place.description}</p>
                <Button onClick={() => onAddStop(place)} size="sm">Add to Trip</Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No suggestions available</p>
        )}
      </CardContent>
    </Card>
  )
}

