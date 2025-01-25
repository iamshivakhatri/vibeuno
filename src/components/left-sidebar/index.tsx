import { Button } from '@/components/ui/button';
import { Compass, BookMarked, Users, Calculator, Plane, Globe2, Route, MessageCircle } from 'lucide-react';
import Link from "next/link";


export const LeftSidebar = () => {
    return (
      <div className="space-y-4">
        {/* Navigation Section */}
        <h3 className="font-semibold px-2">Quick Links</h3>

        <div className="space-y-2">
          <Link href="/" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
            <Compass className="w-5 h-5" />
            <span className="font-medium">Explore</span>
          </Link>
          <Link href="/saved" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
            <BookMarked className="w-5 h-5" />
            <span className="font-medium">Saved Routes</span>
          </Link>
          <Link href="/buddies" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
            <Users className="w-5 h-5" />
            <span className="font-medium">Travel Buddies</span>
          </Link>
        </div>
  
        {/* Tools Section */}
        <div className="space-y-4">
          <h3 className="font-semibold px-2">Travel Tools</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Calculator className="w-5 h-5" />
              Budget Calculator
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Plane className="w-5 h-5" />
              Transportation
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Globe2 className="w-5 h-5" />
              Language Guide
            </Button>
          </div>
        </div>
  
        {/* Quick Access */}
        <div className="space-y-4">
          <h3 className="font-semibold px-2">Quick Access</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Route className="w-5 h-5" />
              My Itineraries
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <MessageCircle className="w-5 h-5" />
              Travel Forums
            </Button>
          </div>
        </div>
      </div>
    );
  }