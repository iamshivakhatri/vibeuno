"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CategoryItem } from "@/lib/explore/types";

interface CategorySectionProps {
  title: string;
  items: CategoryItem[];
  showTopList?: boolean;
}

export function CategorySection({ title, items, showTopList = false }: CategorySectionProps) {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = (itemTitle: string) => {
    const newLikedItems = new Set(likedItems);
    if (likedItems.has(itemTitle)) {
      newLikedItems.delete(itemTitle);
    } else {
      newLikedItems.add(itemTitle);
    }
    setLikedItems(newLikedItems);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      {showTopList && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Top Picks</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            {items.map((item) => (
              <li key={item.title}>{item.title} - {item.description}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.title} className="overflow-hidden">
            {item.imageUrl && (
              <div className="relative aspect-video">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLike(item.title)}
                  className={likedItems.has(item.title) ? "text-red-500" : ""}
                >
                  <Heart className="h-5 w-5" fill={likedItems.has(item.title) ? "currentColor" : "none"} />
                </Button>
              </div>
              {item.likes !== undefined && (
                <p className="text-sm text-muted-foreground mt-2">
                  {item.likes + (likedItems.has(item.title) ? 1 : 0)} likes
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}