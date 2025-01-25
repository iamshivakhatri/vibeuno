export type City = {
    id: string
    name: string
    state: string
    country: string
    description?: string
    coverImage?: string
    createdAt: Date
    updatedAt: Date
    places: Place[]
  }
  
  export type Place = {
    id: string
    name?: string
    caption?: string
    description?: string
    state: string
    city: string
    cityId?: string
    country?: string
    category?: string
    imageUrl?: string
    image?: any
    images?: any
    type: "VISITED" | "WISHLIST"
    createdAt: Date
    updatedAt: Date
    userId: string
    numVotes: number
  }
  
  export type User = {
    id: string
    clerkId?: string
    email: string
    name?: string
    profileUrl?: string
    coverPhotoUrl?: string
    university?: string
    location?: string
    occupation?: string
    interests?: string
    createdAt: Date
    places: Place[]
  }
  
  