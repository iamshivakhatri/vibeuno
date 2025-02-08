// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { TrendingUp, Calendar, User } from "lucide-react";

// type RightSidebarProps = {
//   trendingCities: Array<{ name: string; image: string; count: number }>;
//   upcomingEvents: Array<{ name: string; city: string; date: string; image: string }>;
//   localExperts: Array<{ name: string; city: string; expertise: string; avatar: string }>;
// };

// export const RightSidebar = ({ trendingCities, upcomingEvents, localExperts }: RightSidebarProps) => {
//   // Dummy data for featured users
//   const featuredUsers = Array.from({ length: 50 }, (_, index) => ({
//     id: index + 1,
//     name: `User ${index + 1}`,
//     avatar: `https://i.pravatar.cc/150?img=${index + 1}`, // Random avatars
//     city: `City ${index % 10 + 1}`, // Cities from 1 to 10
//     expertise: `Expertise ${index % 5 + 1}`, // Expertise from 1 to 5
//   }));

//   return (
//     <div className="space-y-6">
//       {/* Trending Cities */}
//       <div className="bg-card rounded-lg p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <TrendingUp className="w-5 h-5" />
//           <h3 className="text-lg font-semibold">Trending Cities</h3>
//         </div>
//         <div className="space-y-4">
//           {trendingCities.map((city) => (
//             <Link
//               key={city.name}
//               href={`/city/${city.name.toLowerCase()}`}
//               className="flex items-center gap-3 group"
//             >
//               <div className="relative w-16 h-16 rounded-lg overflow-hidden">
//                 <Image
//                   src={city.image}
//                   alt={city.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div>
//                 <p className="font-semibold group-hover:text-primary">
//                   {city.name}
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   {city.count} places
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Featured Users */}
//       <div className="bg-card rounded-lg p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <User className="w-5 h-5" />
//           <h3 className="text-lg font-semibold">Featured Users</h3>
//         </div>
//         {/* Horizontal Scrollable Container */}
//         <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
//           {featuredUsers.map((user) => (
//             <div
//               key={user.id}
//               className="flex-shrink-0 w-40 p-4 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto">
//                 <Image
//                   src={user.avatar}
//                   alt={user.name}
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="mt-2 text-center">
//                 <p className="font-semibold text-sm">{user.name}</p>
//                 <p className="text-xs text-muted-foreground">
//                   {user.city} • {user.expertise}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Upcoming Events */}
//       {/* <div className="bg-card rounded-lg p-2">
//         <div className="flex items-center gap-2 mb-4">
//           <Calendar className="w-5 h-5" />
//           <h3 className="text-lg font-semibold">Events & Festivals</h3>
//         </div>
//         <div className="space-y-4">
//           {upcomingEvents.map((event) => (
//             <div key={event.name} className="group">
//               <div className="relative h-32 rounded-lg overflow-hidden mb-2">
//                 <Image
//                   src={event.image}
//                   alt={event.name}
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//                 <div className="absolute bottom-2 left-2 text-white">
//                   <p className="font-semibold">{event.name}</p>
//                   <p className="text-sm">{event.city}</p>
//                 </div>
//               </div>
//               <p className="text-sm text-muted-foreground">{event.date}</p>
//             </div>
//           ))}
//         </div>
//       </div> */}

//       {/* Local Experts */}
//       {/* <div className="bg-card rounded-lg p-6">
//         <div className="flex items-center gap-2 mb-4">
//           <MessageCircle className="w-5 h-5" />
//           <h3 className="text-lg font-semibold">Ask Locals</h3>
//         </div>
//         <div className="space-y-4">
//           {localExperts.map((expert) => (
//             <div key={expert.name} className="flex items-center gap-3">
//               <Avatar className="h-10 w-10">
//                 <Image
//                   src={expert.avatar}
//                   alt={expert.name}
//                   width={40}
//                   height={40}
//                 />
//               </Avatar>
//               <div>
//                 <p className="font-semibold">{expert.name}</p>
//                 <p className="text-sm text-muted-foreground">
//                   {expert.expertise} • {expert.city}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div> */}
//     </div>
//   );
// };

"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Calendar, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSidebarUsers } from "@/actions/user"; // Import the getUsers function

type RightSidebarProps = {
  trendingCities: Array<{ name: string; image: string; count: number }>;
  upcomingEvents: Array<{
    name: string;
    city: string;
    date: string;
    image: string;
  }>;
  localExperts: Array<{
    name: string;
    city: string;
    expertise: string;
    avatar: string;
  }>;
};

export const RightSidebar = ({
  trendingCities,
  upcomingEvents,
  localExperts,
}: RightSidebarProps) => {
  // Fetch users using useQuery
  // const {
  //   data: users,
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["sidebar-users"],
  //   queryFn: getSidebarUsers,
  // });

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sidebar-users"],
    queryFn: () => getSidebarUsers(),
  });

  console.log("users on the sidebar", users);

  return (
    <div className="space-y-6">
      {/* Trending Cities */}
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Trending Cities</h3>
        </div>
        <div className="space-y-4">
          {trendingCities.map((city) => (
            <Link
              key={city.name}
              href={`/city/${city.name.toLowerCase()}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold group-hover:text-primary">
                  {city.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {city.count} places
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Users */}
      {/* Featured Users */}
<div className="bg-card rounded-lg p-6">
  <div className="flex items-center gap-2 mb-4">
    <User className="w-5 h-5" />
    <h3 className="text-lg font-semibold">Featured Users</h3>
  </div>
  {/* Horizontal Scrollable Container */}
  <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4">
    {isLoading ? (
      // Show skeleton loaders while loading
      Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-40 p-4 bg-background rounded-lg shadow-sm animate-pulse"
        >
          <div className="w-16 h-16 rounded-full bg-muted mx-auto" />
          <div className="mt-2 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </div>
      ))
    ) : isError ? (
      // Show error message if fetching fails
      <p className="text-sm text-muted-foreground">Failed to load users.</p>
    ) : (
      // Display users
      users?.map((user) => (
        <Link
          key={user.id}
          href={`/profile/${user.id}`} // Navigate to the user's profile page
          className="flex-shrink-0 w-40 p-4 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto">
            <Image
              src={user.profileUrl || "https://i.pravatar.cc/150?img=1"} // Fallback avatar
              alt={user.name || "User"}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-2 text-center">
            <p className="font-semibold text-sm">{user.name || "Anonymous"}</p>
            <p className="text-xs text-muted-foreground">
              {user.location} • {user.occupation}
            </p>
            {/* Display the number of places posted by the user */}
            <p className="text-xs text-muted-foreground mt-1">
              {user._count.places} places posted
            </p>
          </div>
        </Link>
      ))
    )}
  </div>
</div>
 

      {/* Upcoming Events */}
      {/* <div className="bg-card rounded-lg p-2">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Events & Festivals</h3>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.name} className="group">
              <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white">
                  <p className="font-semibold">{event.name}</p>
                  <p className="text-sm">{event.city}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{event.date}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Local Experts */}
      {/* <div className="bg-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Ask Locals</h3>
        </div>
        <div className="space-y-4">
          {localExperts.map((expert) => (
            <div key={expert.name} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <Image
                  src={expert.avatar}
                  alt={expert.name}
                  width={40}
                  height={40}
                />
              </Avatar>
              <div>
                <p className="font-semibold">{expert.name}</p>
                <p className="text-sm text-muted-foreground">
                  {expert.expertise} • {expert.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};
