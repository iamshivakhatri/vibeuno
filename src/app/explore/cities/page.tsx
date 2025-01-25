// "use client";

// import { useState, useEffect } from "react";
// import { getCities } from "@/actions/place";
// import { Building2 } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// type Place ={
//   id: string;
//   name: string | null;
//   city: string;
//   country: string | null;
//   imageUrl: string|null;

// }

// export default function CitiesPage() {
//   const [cities, setCities] = useState<Place[]>([]);
//   const router = useRouter();


//   useEffect(() => {
//     const loadCities = async () => {
//       const data = await getCities();
//       setCities(data);
//     };
//     loadCities();
//   }, []);

//   return (
//     <div className="container mx-auto py-8">
//       <div className="flex items-center gap-2 mb-8">
//         <Building2 className="h-8 w-8 text-primary" />
//         <h1 className="text-3xl font-bold">Explore Cities</h1>
//       </div>
      
//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {cities.map((city) => (
//           <div
//             key={city.id}
//             className="group cursor-pointer overflow-hidden rounded-xl border"
//             onClick={() => router.push(`/places/${city.id}`)}
//           >
//             <div className="aspect-[16/9] relative">
//               <Image
//                 src={city.imageUrl || "/placeholder.jpg"}
//                 alt={city.name || " "}
//                 fill
//                 className="object-cover transition-transform group-hover:scale-105"
//               />
//               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
//             </div>
//             <div className="p-4">
//               <h3 className="text-lg font-semibold">{city.name}</h3>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {city.country} • {city.city} 
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// } 