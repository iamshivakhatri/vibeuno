"use client";

import { PopularSection } from "./popular-section";
import { TrendingSection } from "./trending-section";

export function HomeSections() {
  return (
    <div className="space-y-12">
      <TrendingSection />
      <PopularSection />
    </div>
  );
}