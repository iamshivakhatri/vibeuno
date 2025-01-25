// "use client";

// import { useState, useEffect } from "react";
// // import { Place } from "@prisma/client";
// import { getCities } from "@/actions/place";
// import { ChevronRight, Building2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// type Place ={
//   id: string;
//   name: string | null;
//   city: string;
//   country: string | null;
//   imageUrl: string|null;

// }

// export function CitiesSection() {
//   const [cities, setCities] = useState<Place[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const loadCities = async () => {
//       const data = await getCities();
//       setCities(data);
//       console.log(data);
//     };
//     loadCities();
//   }, []);

//   return (
//     <section className="space-y-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Building2 className="h-6 w-6 text-primary" />
//           <h4 className="text-2xl font-bold">Featured Cities</h4>
//         </div>
//         <Button
//           variant="ghost"
//           onClick={() => router.push('/explore/cities')}
//           className="flex items-center gap-2"
//         >
//           View All
//           <ChevronRight className="h-4 w-4" />
//         </Button>
//       </div>
      
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
//         {cities.slice(0, 9).map((city) => (
//           <div
//             key={city.id}
//             className="group cursor-pointer overflow-hidden rounded-xl border"
//             onClick={() => router.push(`/places/${city.id}`)}
//           >
//             <div className="aspect-[16/9] relative">
//               <Image
//                 src={city.imageUrl || "/placeholder.jpg"}
//                 alt={city.city}
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
//     </section>
//   );
// } 