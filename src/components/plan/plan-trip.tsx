'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import TripForm from './TripForm'
import TripMap from './TripMap'
import TripDetails from './TripDetails'
import { TripData } from '@/types/trip'

export default function PlanTrip() {
  const [tripData, setTripData] = useState<Partial<TripData> | null>(null)

  const handlePlanTrip = (formData: Partial<TripData>) => {
    setTripData(formData)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6">
        <TripForm onPlanTrip={handlePlanTrip} />
      </Card>
      <Card className="p-6">
        <TripMap tripData={tripData} />
      </Card>
      {tripData && (
        <Card className="p-6 lg:col-span-2">
          <TripDetails tripData={tripData} />
        </Card>
      )}
    </div>
  )
}

