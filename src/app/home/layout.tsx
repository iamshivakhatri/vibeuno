// // layout.tsx (inside /home)
// import { LeftSidebar } from "@/components/left-sidebar";
// import { RightSidebar } from "@/components/right-sidebar";

// interface HomeLayoutProps {
//   children: ReactNode;
// }
// import { ReactNode, useState } from "react";
// import MobileNavigation from "@/components/global/navigation";

// export default function HomeLayout({ children }: HomeLayoutProps) {
//   const trendingCities = [
//     {
//       name: "Dallas",
//       image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
//       count: 1234,
      
//     },
//     {
//       name: "Cincinnati",
//       image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261",
//       count: 892,
//     },
//     {
//       name: "Chicago",
//       image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f",
//       count: 756,
//     },
//   ];

//   const upcomingEvents = [
//     {
//       name: "Cherry Blossom Festival",
//       city: "Tokyo",
//       date: "April 1-15, 2024",
//       image: "https://images.unsplash.com/photo-1522383225653-ed111181a951",
//     },
//     {
//       name: "Oktoberfest",
//       city: "Munich",
//       date: "Sept 21 - Oct 6, 2024",
//       image: "https://images.unsplash.com/photo-1505489435671-80a165c60816",
//     },
//   ];

//   const localExperts = [
//     {
//       name: "Maria Garcia",
//       city: "Barcelona",
//       expertise: "Food & Culture",
//       avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
//     },
//     {
//       name: "John Smith",
//       city: "New York",
//       expertise: "Urban Explorer",
//       avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Mobile Navigation */}

//       <MobileNavigation
//         trendingCities={trendingCities}
//         upcomingEvents={upcomingEvents}
//         localExperts={localExperts}
//       />

//       {/* Main Layout */}
//       <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-8">
//         {/* Left Sidebar - Desktop */}
//         <div className="hidden lg:block sticky top-10 h-screen overflow-y-auto py-4">
//           <LeftSidebar />
//         </div>

//         {/* Main Content */}
//         <main className="space-y-6 mb-20 lg:mb-0">{children}</main>

//         {/* Right Sidebar - Desktop */}
//         <div className="hidden lg:block sticky top-10 h-screen overflow-y-auto">
//           <RightSidebar
//             trendingCities={trendingCities}
//             upcomingEvents={upcomingEvents}
//             localExperts={localExperts}
//           />
//         </div>
//       </div>


      
//     </div>
//   );
// }

import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { ReactNode } from "react";
import MobileNavigation from "@/components/global/navigation";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const trendingCities = [
    { name: "Dallas", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9", count: 1234 },
    { name: "Cincinnati", image: "https://images.unsplash.com/photo-1534190239940-9ba8944ea261", count: 892 },
    { name: "Chicago", image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f", count: 756 },
  ];

  const upcomingEvents = [
    { name: "Cherry Blossom Festival", city: "Tokyo", date: "April 1-15, 2024", image: "https://images.unsplash.com/photo-1522383225653-ed111181a951" },
    { name: "Oktoberfest", city: "Munich", date: "Sept 21 - Oct 6, 2024", image: "https://images.unsplash.com/photo-1505489435671-80a165c60816" },
  ];

  const localExperts = [
    { name: "Maria Garcia", city: "Barcelona", expertise: "Food & Culture", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
    { name: "John Smith", city: "New York", expertise: "Urban Explorer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
  ];

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden"> {/* Adjust height based on navbar height */}
      <MobileNavigation
        trendingCities={trendingCities}
        upcomingEvents={upcomingEvents}
        localExperts={localExperts}
      />

      <div className="max-w-[1600px] h-full mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-8">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:block h-full overflow-y-auto">
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="overflow-y-auto h-full">
          {children}
        </main>

        {/* Right Sidebar - Desktop */}
        <div className="hidden lg:block h-full overflow-y-auto">
          <RightSidebar
            trendingCities={trendingCities}
            upcomingEvents={upcomingEvents}
            localExperts={localExperts}
          />
        </div>
      </div>
    </div>
  );
}