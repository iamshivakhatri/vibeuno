// "use client";

// import { useState } from "react";
// import { MapPinned } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { SearchBar } from "@/components/explore/search-bar";
// import { SearchResults } from "@/components/explore/search-results";
// import { HomeSections } from "@/components/explore/home-sections";

// export default function ExplorePage() {
//   const [searchQuery, setSearchQuery] = useState("");

//   return (
//     <div className="container mx-auto px-8 py-8">
//       <div className="mb-8 space-y-4">
//         <div className="flex items-center justify-between gap-4">
//           <div className="flex-1">
//             <SearchBar 
//               value={searchQuery}
//               onChange={setSearchQuery}
//             />
//           </div>
//         </div>
//       </div>

//       {searchQuery ? (
//         <SearchResults searchQuery={searchQuery} />
//       ) : (
//         <HomeSections />
//       )}
//     </div>
//   );
// }

import CitiesGrid from "@/components/explore-updated/city-grid"

import UsersGrid from "@/components/explore-updated/user-grid"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
       <UsersGrid />
      <CitiesGrid />
    </main>
  )
}

