import Image from "next/image";
import Link from "next/link";
import { Place } from "@prisma/client";
import { Heart } from "lucide-react";
import { Avatar } from "@radix-ui/react-avatar";

interface User {
  id: string;
  profileUrl: string | null;
  name: string | null;
}

interface PopularPlaceCardProps {
  place: Place & { user?: User };
}

export default function PopularPlaceCard({ place }: PopularPlaceCardProps) {
  return (
    <Link href={`/places/${place.id}`}>
      <div className="group relative h-full overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          {/* Create the stacked effect with translation and rotation */}
          {Array.isArray(place?.image) &&
            place.image.slice(0, 3).map((img, index) => (
              <div
                key={index}
                className={`absolute top-0 left-0 w-full h-full transition-transform duration-300 group-hover:scale-105`}
                style={{
                  transform: `translate(${(index + 1) * 15}px, ${
                    (index + 1) * 15
                  }px) rotate(${(index + 1) * 6}deg)`, // More space and rotation
                  zIndex: 3 - index, // Ensure proper stacking order (top-most image has the highest z-index)
                }}
              >
                <Image
                  src={typeof img === "string" ? img : "/placeholder.jpg"}
                  alt={`${place.name} - Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg border-2 border-white shadow-lg" // Add a border and shadow for separation
                />
              </div>
            ))}

          {/* Display the total number of images */}
          {Array.isArray(place.image) && place.image.length > 1 && (
            <div className="absolute bottom-2 right-2 z-10 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
              {place.image.length} photos
            </div>
          )}
        </div>

        {/* Place details */}
        <div className="p-4 ">
          <h3 className="text-xl font-semibold text-gray-800">{place.name}</h3>
          <p className="text-sm text-gray-500">{place.city}</p>
          <p className="mt-2 line-clamp-2 text-gray-600">{place.description || "Description not added." } </p>
          <div className="flex justify-between">
            <div className=" mt-3 flex items-center gap-2">
              <span className="flex items-center text-red-500">
                <Heart fill="currentColor" className="h-4 w-4" />

                <span className="ml-1">{place.numVotes}</span>
              </span>
            </div>

            <div className="absolute bottom-1 right-1">
              <Link
              href={`/profile/${place.user?.id}`}
              key={place.user?.id}
              
              >
              <Avatar className="h-4 w-4">
                <Image
                  src={place.user?.profileUrl || "/placeholder.jpg"}
                  alt={place.user?.name || "User Profile"}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Avatar>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
