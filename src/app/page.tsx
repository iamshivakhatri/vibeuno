"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Navigation, Plus } from 'lucide-react';
import Image from 'next/image';
import { TopContributors } from '@/components/top-contributors';
import Link from 'next/link';
import {Footer} from '@/components/footer';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';


import { STATE_IMAGE_URLS } from '@/lib/states';




export default function Home() {
  const [showStickyNav, setShowStickyNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const newShowStickyNav = window.scrollY > heroBottom - 100;
        setShowStickyNav(newShowStickyNav);
        
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);  // Empty dependency array to run only once when component mounts
  

  return (
    <div className="flex flex-col">
       {/* Sticky Navigation */}
       <div
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b transform transition-all duration-300',
          showStickyNav ? 'top-0' : '-top-20'  // Adjust position instead of transform
        )}
      >
        <div className="container h-16 flex items-center justify-center">
          <div className="flex items-center gap-8">
            <Link href="/explore" className="text-primary hover:text-primary/90 font-medium">
              <Button>
              Explore 
              </Button>
            </Link>

            <Link href="/upload" className="text-primary hover:text-primary/90 font-medium">
             <Button>
             Add Place
             </Button>
            
            </Link>
          </div>
        </div>
      </div>


      {/* Hero Section */}
      {/* <section id= "hero-section" className="relative h-[600px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800')]
       bg-cover bg-center"> */}

<section id="hero-section" className=" relative h-[600px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800')] bg-cover bg-center">

{/* <section id="hero-section" className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd')] bg-cover bg-center"> */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover, Vote, and Explore the Best Places
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of travelers sharing their favorite destinations across America
          </p>
          {/* <div className="flex max-w-md mx-auto gap-2">
            <Input 
              placeholder="Search states, cities, or places..." 
              className="bg-white/90 text-black"
            />

            <Button size="icon" variant="secondary">
              <Search className="h-4 w-4" />
            </Button>

          </div> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-primary hover:bg-primary/90"
              asChild
            >
              <Link href="/explore">
                <Navigation className="mr-2 h-5 w-5" />
                Start Exploring
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg"
              asChild
            >
              <Link href="/upload">
                <Plus className="mr-2 h-5 w-5" />
                Share a Place
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured States Section */}
      <section className="py-16 bg-background">
      <div className="container">
        <h2 className="text-3xl font-semibold text-center mb-12">Popular States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['California', 'New_York', 'Florida'] as const).map((state) => (
            <Card key={state} className="group relative overflow-hidden">
              <div className="aspect-[4/3] relative">
                <Image
                  src={STATE_IMAGE_URLS[state] || `https://source.unsplash.com/featured/?${state},landmark`}
                  alt={state}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Link href={`/states/${state.toLowerCase()}`}>
                    <Button variant="secondary" className="font-semibold">
                      Explore {state}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

      {/* Top Contributors Section */}
      <TopContributors />

      {/* Call to Action */}
      <section className="py-16 bg-accent">
        <div className="container text-center">
          <MapPin className="h-12 w-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-semibold mb-4">Share Your Favorite Places</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help others discover amazing destinations by sharing your personal favorites
          </p>
          <Button size="lg" asChild>
            <Link href="/upload">Add a Place</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}