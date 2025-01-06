"use client";

import { CategorySection } from "./category-section";
import { POPULAR_PLACES, HIDDEN_GEMS } from "@/lib/explore/popular-data";

export function PopularSection() {
  return (
    <div className="space-y-12">
      <CategorySection
        title="Popular Destinations"
        items={POPULAR_PLACES}
        showTopList
      />
      
      <CategorySection
        title="Hidden Gems"
        items={HIDDEN_GEMS}
        showTopList
      />
    </div>
  );
}