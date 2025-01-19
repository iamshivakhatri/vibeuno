'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'
import { TripData, PlaceSuggestion } from '@/types/trip'
import PlaceSuggestions from './PlaceSuggestions'

interface TripFormProps {
  onPlanTrip: (data: Partial<TripData>) => void
}

const BASE_API_URL = "https://secure.geonames.org"

export default function TripForm({ onPlanTrip }: TripFormProps) {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [intermediateStops, setIntermediateStops] = useState<string[]>([])
  const [travelers, setTravelers] = useState(1)
  const [traveldays, setTravelDays] = useState(1)
  const [suggestions, setSuggestions] = useState<{ [key: string]: PlaceSuggestion[] }>({})
  const [selectedPlaces, setSelectedPlaces] = useState<{ [key: string]: PlaceSuggestion | null }>({
    origin: null,
    destination: null
  })

  const fetchSuggestions = async (query: string): Promise<PlaceSuggestion[]> => {
    if (query.length < 3) return []
    const apiUrl = `${BASE_API_URL}/searchJSON?name_startsWith=${encodeURIComponent(query)}&maxRows=5&username=shivakhatri01&style=FULL&featureClass=P&orderby=population`
    try {
      const response = await fetch(apiUrl)
      const data = await response.json()
      return data.geonames.map((place: any) => ({
        name: place.name,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lng),
        countryName: place.countryName,
        adminName1: place.adminName1
      }))
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      return []
    }
  }

  const debounceFetch = useCallback((query: string, key: string) => {
    if (query.length < 3) {
      setSuggestions(prev => ({ ...prev, [key]: [] }))
      return
    }
    const timer = setTimeout(() => 
      fetchSuggestions(query).then(results => 
        setSuggestions(prev => ({ ...prev, [key]: results }))
      ), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    return debounceFetch(origin, 'origin')
  }, [origin, debounceFetch])

  useEffect(() => {
    return debounceFetch(destination, 'destination')
  }, [destination, debounceFetch])

  useEffect(() => {
    intermediateStops.forEach((stop, index) => {
      debounceFetch(stop, `intermediate_${index}`)
    })
  }, [intermediateStops, debounceFetch])

  const handlePlaceSelect = (place: PlaceSuggestion, key: string) => {
    if (key.startsWith('intermediate_')) {
      const index = parseInt(key.split('_')[1])
      setIntermediateStops(prev => {
        const newStops = [...prev]
        newStops[index] = `${place.name}, ${place.adminName1}, ${place.countryName}`
        return newStops
      })
    } else if (key === 'origin') {
      setOrigin(`${place.name}, ${place.adminName1}, ${place.countryName}`)
    } else if (key === 'destination') {
      setDestination(`${place.name}, ${place.adminName1}, ${place.countryName}`)
    }
    setSelectedPlaces(prev => ({ ...prev, [key]: place }))
    setSuggestions(prev => ({ ...prev, [key]: [] }))
  }

  // const addIntermediateStop = () => {
  //   setIntermediateStops(prev => [...prev, ''])
  //   setSelectedPlaces(prev => ({ ...prev, [`intermediate_${intermediateStops.length}`]: null }))
  // }

  const addIntermediateStop = () => {
    setIntermediateStops(prev => [...prev, ''])
    setSelectedPlaces(prev => ({ ...prev, [`intermediate_${intermediateStops.length}`]: null }))
  }

  const removeIntermediateStop = (index: number) => {
    setIntermediateStops(prev => prev.filter((_, i) => i !== index))
    setSelectedPlaces(prev => {
      const newSelected = { ...prev }
      delete newSelected[`intermediate_${index}`]
      return newSelected
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allStops = [
      selectedPlaces.origin,
      ...intermediateStops.map((_, index) => selectedPlaces[`intermediate_${index}`]),
      selectedPlaces.destination
    ].filter(Boolean) as PlaceSuggestion[]

    if (allStops.length < 2) {
      alert('Please select at least an origin and a destination.')
      return
    }

    onPlanTrip({
      stops: allStops.map((stop, index, array) => {
        const isFirstOrLast = index === 0 || index === array.length - 1;
        return {
          name: isFirstOrLast ? `${stop.name}, ${stop.adminName1}, ${stop.countryName}` : stop.name,
          coordinates: { lat: stop.lat, lng: stop.lng }
        };
      }),
      travelers,
      traveldays
    });
    


  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="origin">Origin</Label>
        <Input
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g., Cincinnati"
          required
        />
        {renderSuggestions('origin')}
      </div>
      
      {intermediateStops.map((stop, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className="flex-grow">
            <Label htmlFor={`intermediate_${index}`}>Intermediate Stop {index + 1}</Label>
            <Input
              id={`intermediate_${index}`}
              value={stop}
              onChange={(e) => {
                const newStops = [...intermediateStops]
                newStops[index] = e.target.value
                setIntermediateStops(newStops)
              }}
              placeholder="e.g., St. Louis"
            />
            {renderSuggestions(`intermediate_${index}`)}
          </div>
          <Button type="button" variant="outline" size="icon" onClick={() => removeIntermediateStop(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button type="button" variant="outline" onClick={() => addIntermediateStop()} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Intermediate Stop
      </Button>

      <div>
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g., Colorado"
          required
        />
        {renderSuggestions('destination')}
      </div>

      <div>
        <Label htmlFor="travelers">Number of Travelers</Label>
        <Input
          id="travelers"
          type="number"
          min={1}
          value={travelers}
          onChange={(e) => setTravelers(parseInt(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="traveldays">Number of Days For Trip</Label>
        <Input
          id="traveldays"
          type="number"
          min={1}
          value={traveldays}
          onChange={(e) => setTravelDays(parseInt(e.target.value))}
          required
        />
      </div>


      {selectedPlaces.origin && selectedPlaces.destination && (
        <PlaceSuggestions
          origin={selectedPlaces.origin}
          destination={selectedPlaces.destination}
          onAddStop={addIntermediateStop}
        />
      )}

      <Button type="submit" className="w-full">Plan Trip</Button>
    </form>
  )

  function renderSuggestions(key: string) {
    return suggestions[key] && suggestions[key].length > 0 ? (
      <ul className="mt-1 max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
        {suggestions[key].map((place, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => handlePlaceSelect(place, key)}
          >
            {place.name}, {place.adminName1}, {place.countryName}
          </li>
        ))}
      </ul>
    ) : null
  }
}

