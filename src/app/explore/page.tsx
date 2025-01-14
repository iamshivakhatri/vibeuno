"use client";

import { useState } from "react";
import { MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/explore/search-bar";
import { SearchResults } from "@/components/explore/search-results";
import { HomeSections } from "@/components/explore/home-sections";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          {/* <Button
            variant="outline"
            className="flex items-center gap-2 min-w-[140px] bg-background hover:bg-accent  border-primary"
            onClick={() => window.location.href = '/states'}
          >
            <MapPinned className="h-4 w-4" />
            Explore States
          </Button> */}
        </div>
      </div>

      {searchQuery ? (
        <SearchResults searchQuery={searchQuery} />
      ) : (
        <HomeSections />
      )}
    </div>
  );
}