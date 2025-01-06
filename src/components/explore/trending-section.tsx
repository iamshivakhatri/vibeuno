"use client";

import { CategorySection } from "./category-section";
import { TRENDING_PLACES } from "@/lib/explore/trending-data";

export function TrendingSection() {
  return (
    <CategorySection
      title="Trending Now"
      items={TRENDING_PLACES}
      showTopList
    />
  );
}