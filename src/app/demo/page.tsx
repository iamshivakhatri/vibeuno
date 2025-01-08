'use client'

import { Share2, MapPin, Award, Camera, Heart, Bookmark, Grid, List } from 'lucide-react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-purple-50">
      {/* Hero Section with Curved Bottom */}
      <div className="relative h-48 bg-gradient-to-r from-rose-400 to-purple-400">
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 320" className="w-full">
            <path
              fill="currentColor"
              className="text-rose-50"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container px-4 mx-auto -mt-32">
        <div className="relative">
          {/* Profile Card */}
          <div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="relative z-10 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl"
          >
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div 
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <img
                      src="/placeholder.svg?height=128&width=128"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <Badge className="absolute bottom-2 right-0 bg-gradient-to-r from-rose-400 to-purple-400">
                  <Award className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-between gap-4 mb-4">
                  <h1 className="text-2xl font-bold">shivaji null</h1>
                  <Button 
                    variant="secondary"
                    size="sm"
                    className="hidden md:flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </Button>
                </div>
                <p className="text-muted-foreground mb-6">Travel enthusiast | Photography lover | Adventure seeker</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  <div 
                    whileHover={{ y: -2 }}
                    className="p-4 rounded-xl bg-white shadow-sm"
                  >
                    <div className="text-2xl font-bold text-rose-500">2</div>
                    <div className="text-sm text-muted-foreground">Places Visited</div>
                  </div>
                  <div 
                    whileHover={{ y: -2 }}
                    className="p-4 rounded-xl bg-white shadow-sm"
                  >
                    <div className="text-2xl font-bold text-purple-500">16</div>
                    <div className="text-sm text-muted-foreground">Points Earned</div>
                  </div>
                  <div 
                    whileHover={{ y: -2 }}
                    className="p-4 rounded-xl bg-white shadow-sm"
                  >
                    <div className="text-2xl font-bold text-rose-500">24</div>
                    <div className="text-sm text-muted-foreground">Photos Shared</div>
                  </div>
                  <div 
                    whileHover={{ y: -2 }}
                    className="p-4 rounded-xl bg-white shadow-sm"
                  >
                    <div className="text-2xl font-bold text-purple-500">142</div>
                    <div className="text-sm text-muted-foreground">Profile Views</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Badge variant="secondary" className="py-2">
                  <MapPin className="w-3 h-3 mr-1" />
                  First Check-in
                </Badge>
                <Badge variant="secondary" className="py-2">
                  <Camera className="w-3 h-3 mr-1" />
                  Photo Master
                </Badge>
                <Badge variant="secondary" className="py-2">
                  <Heart className="w-3 h-3 mr-1" />
                  Rising Star
                </Badge>
                <Badge variant="secondary" className="py-2">
                  <Award className="w-3 h-3 mr-1" />
                  Early Adopter
                </Badge>
              </div>
            </div>
          </div>

          {/* Places Tabs */}
          <div className="mt-6">
            <Tabs defaultValue="visited" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="visited">Visited Places</TabsTrigger>
                  <TabsTrigger value="wishlist">Want to Visit</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'text-rose-500' : ''}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'text-rose-500' : ''}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <TabsContent value="visited">
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1 gap-4'}`}>
                  {[1, 2].map((place) => (
                    <div
                      key={place}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -2 }}
                      className={`relative group overflow-hidden ${viewMode === 'grid' ? 'rounded-2xl' : 'rounded-xl'}`}
                    >
                      <img
                        src="/placeholder.svg?height=300&width=400"
                        alt={`Place ${place}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/70 transition-all">
                        <div className="absolute bottom-0 p-4 w-full">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-semibold">Amazing Place {place}</h3>
                              <p className="text-white/80 text-sm">Visited on Jan {place}, 2024</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="icon" variant="secondary" className="h-8 w-8">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="secondary" className="h-8 w-8">
                                <Bookmark className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="wishlist">
                <div className="text-center py-8 text-muted-foreground">
                  No places in your wishlist yet. Start exploring!
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

