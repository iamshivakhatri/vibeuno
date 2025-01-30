"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PhotoUpload } from "@/components/explore/photo-upload";
import { getSearchSuggestions } from "@/lib/explore/search-suggestions";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { getAppUserId } from "@/actions/auth";

export default function UploadPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
  });

  const { user } = useUser();

  const router = useRouter();

  const {
    data: userId,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userId"],
    queryFn: async () => getAppUserId(user?.id ?? ""),
  });

  const CATEGORIES = [
    "All",
    "Nature",
    "Restaurants",
    "Parks",
    "Museums",
    "Nightlife",
    "Shopping",
    "Architecture",
    "Hidden Gems",
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const suggestions = await getSearchSuggestions(searchQuery);
          setSuggestions(suggestions);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  const handleUploadComplete = (urls: string[]) => {
    console.log("Uploaded photos:", urls);
    setSearchQuery("");
    if (userId) {
      router.push(`/profile/${userId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Share Your Travel Photos</h1>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center border rounded-lg bg-background focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 ml-3 text-muted-foreground" />
              <Input
                className="border-0 focus-visible:ring-0"
                placeholder="Where did you go? (e.g., Las Vegas, Nevada)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{suggestion}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Select */}
          <div>
            {/* Optional category selection */}
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category (Optional)" />
              </SelectTrigger>
              <SelectContent>
  {CATEGORIES.map((category) => (
    <SelectItem key={category} value={category.toLowerCase().replace(" ", "-")}>
      {category}
    </SelectItem>
  ))}
</SelectContent>
            </Select>
          </div>

          <div>
            {/* Optional input field */}
            <Input
              placeholder="Enter the name of the place (Optional)"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          {/* Photo Upload */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Upload Photos</h3>
            <PhotoUpload
              placeId={searchQuery.toLowerCase().replace(/\s+/g, "-")}
              category={formData.category} // Pass category as a prop
              name={formData.name} // Pass name as a prop
              onUploadComplete={handleUploadComplete}
              user={user}
            />
          </div>
        </div>
      </Card>

      {!searchQuery && (
        <div className="text-center text-muted-foreground">
          <p>Search for a place to start uploading photos</p>
        </div>
      )}
    </div>
  );
}
