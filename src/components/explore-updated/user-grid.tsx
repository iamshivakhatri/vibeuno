"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import type { User } from "@/types"

export default function UsersGrid() {
  const { data: users } = useQuery<User[]>({
    queryKey: ["users"],
  })

  if (!users) return null
  console.log("This is the users.",users)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Popular Travelers</h2>
        <p className="text-muted-foreground">Connect with experienced travelers</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <Link href={`/profile/${user.id}`} key={user.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profileUrl } alt={user.name || "User"} />
                    <AvatarFallback>{(user.name?.[0] || "U").toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold truncate">{user.name || "Anonymous"}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.occupation || user.location || "Traveler"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{user.places.length} places shared</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

