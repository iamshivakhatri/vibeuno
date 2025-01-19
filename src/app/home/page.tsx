// 'use client';



import { getPost,  getPlaces } from '@/actions/place';
import { PostCard } from '@/components/home/post-card';
import { CityCard } from '@/components/home/city-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, MapPin } from 'lucide-react';

export  default async function Home() {
    const posts = await  getPost();
    console.log("this is the posts", posts)

//     return (
//         <div>
//             <div className="container mx-auto px-4 py-8">
//                 <div className="flex items-center justify-center mb-8">
//                     this is the home page
//                 </div>
//             </div>
//         </div>
//     )}
  return (
     <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <section className="mb-8">
              {/* <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Trending Posts</h2>
                <Button variant="ghost" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  See all
                </Button>
              </div> */}
              <div className="space-y-6">
                 {posts?.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          </div>

          {/* <div className="lg:col-span-4">
            <div className="sticky top-4">
              <section className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Popular Cities</h2>
                  <Button variant="ghost" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Explore
                  </Button>
                </div>
                <div className="space-y-4">
                  {mockCities.map((city) => (
                    <CityCard key={city.id} city={city} />
                  ))}
                </div>
              </section>
            </div>
          </div> */}


        </div>
      </main>
    )
}