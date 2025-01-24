// import { useState, useRef, TouchEvent } from "react"
// import Image from "next/image"
// import { ChevronLeft, ChevronRight } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

// interface ImageCarouselProps {
//   images: string[]
//   category: string
// }

// export function ImageCarousel({ images, category }: ImageCarouselProps) {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const touchStartX = useRef<number | null>(null)

//   const goToPrevious = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
//   }

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
//   }

//   const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
//     touchStartX.current = e.touches[0].clientX
//   }

//   const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
//     if (touchStartX.current === null) return

//     const touchEndX = e.changedTouches[0].clientX
//     const diffX = touchStartX.current - touchEndX

//     if (Math.abs(diffX) > 50) {  // Minimum swipe distance
//       if (diffX > 0) {
//         goToNext()
//       } else {
//         goToPrevious()
//       }
//     }

//     touchStartX.current = null
//   }

//   return (
//     <div 
//       className="relative h-[400px] md:h-[600px] bg-black flex items-center justify-center"
//       onTouchStart={handleTouchStart}
//       onTouchEnd={handleTouchEnd}
//     >
//       <Image 
//         src={images[currentIndex] || ""} 
//         alt={`Image ${currentIndex + 1}`} 
//         fill 
//         className="object-contain" 
//       />
//       <Badge className="absolute top-4 right-4 z-10">{category}</Badge>

//       {images.length > 1 && (
//         <>
//           <button
//             onClick={goToPrevious}
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
//             aria-label="Previous image"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>
//           <button
//             onClick={goToNext}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
//             aria-label="Next image"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//             {images.map((_, index) => (
//               <div
//                 key={index}
//                 className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"}`}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface ImageCarouselProps {
  images: string[] 
  category: string
}

export function ImageCarousel({ images, category }: ImageCarouselProps) {
  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="h-[400px] md:h-[600px] bg-black"
        slidesPerView={1}
        centeredSlides
        style={{
            '--swiper-navigation-color': '#ffffff',
            '--swiper-pagination-color': '#ffffff',
            '--swiper-pagination-bullet-inactive-color': 'rgba(255,255,255,0.5)'
          } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <Image 
              src={image} 
              alt={`Image ${index + 1}`} 
              fill 
              className="object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Badge className="absolute top-4 right-4 z-10">{category}</Badge>
    </div>
  )
}