

import CitiesGrid from "@/components/explore-updated/city-grid"

import UsersGrid from "@/components/explore-updated/user-grid"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
       <UsersGrid />
      <CitiesGrid />
    </main>
  )
}

