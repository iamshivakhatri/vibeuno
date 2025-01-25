"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Compass, Globe2, Camera } from "lucide-react";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import Link from "next/link";

interface MobileNavigationProps {
  trendingCities: Array<{ name: string; image: string; count: number }>;
  upcomingEvents: Array<{ name: string; city: string; date: string; image: string }>;
  localExperts: Array<{ name: string; city: string; expertise: string; avatar: string }>;
}

export default function MobileNavigation({
  trendingCities,
  upcomingEvents,
  localExperts,
}: MobileNavigationProps) {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-background border-t z-50">
      <div className="flex justify-between items-center p-3">
        <Sheet open={showLeftSidebar} onOpenChange={setShowLeftSidebar}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Compass className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <LeftSidebar />
          </SheetContent>
        </Sheet>

        <Button variant="default">
            <Link
            href="/upload"
            >
          <Camera className="h-5 w-5" />

            </Link>
        </Button>

        <Sheet open={showRightSidebar} onOpenChange={setShowRightSidebar}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe2 className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <RightSidebar
              trendingCities={trendingCities}
              upcomingEvents={upcomingEvents}
              localExperts={localExperts}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
