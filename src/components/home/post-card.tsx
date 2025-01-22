// 'use client';

// import { useState } from 'react';
// import { Post, Comment } from '@/types/index.type';


// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Avatar } from '@/components/ui/avatar';
// import { Card } from '@/components/ui/card';
// import { Heart, MessageCircle, Share2 } from 'lucide-react';
// import { format } from 'date-fns';
// import Link from 'next/link';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'swiper/css';
// import { Swiper as SwiperClass } from 'swiper';  // Import Swiper class



// import { useRef, useEffect} from 'react';


// interface PostCardProps {
//   post: Post;
// }

// type CustomSwiperInstance = SwiperClass & {
//     params: {
//       navigation: {
//         prevEl: HTMLElement | null;
//         nextEl: HTMLElement | null;
//       };
//     };
//     navigation: {
//       update: () => void;
//     };
//   };
  


// export function PostCard({ post }: PostCardProps) {
//   const [comments, setComments] = useState<Comment[]>(post.comments || []);
//   const [newComment, setNewComment] = useState('');
//   const [showComments, setShowComments] = useState(false);

//   const prevRef = useRef(null);
//   const nextRef = useRef(null);
  
//   const [swiperInstance, setSwiperInstance] = useState<CustomSwiperInstance| null>(null);
//   const [activeIndex, setActiveIndex] = useState(0);

// interface HandleDotClickProps {
//     index: number;
// }

// const handleDotClick = ({ index }: HandleDotClickProps) => {
//     console.log("Clicked dot index:", index);
//     setActiveIndex(index);
//     swiperInstance?.slideTo(index); // Slide to the clicked dot
// };


//   useEffect(() => {
//     if (swiperInstance) {
//       swiperInstance.params.navigation.prevEl = prevRef.current;
//       swiperInstance.params.navigation.nextEl = nextRef.current;
//       swiperInstance.navigation.update();
//     }
//   }, [swiperInstance]);

//   const handleAddComment = () => {
//     if (!newComment.trim()) return;

//     const newCommentData = {
//       id: Date.now(),
//       content: newComment.trim(),
//       user: {
//         name: 'Current User',
//         profileUrl: '/default-avatar.png', // Replace with actual avatar URL
//       },
//       createdAt: new Date().toISOString(),
//     };

//     // setComments([newCommentData, ...comments]);
//     setNewComment('');
//   };

//   return (
//     <Card className="p-6 md:w-3/4 md:m-auto">
//       {/* Header Section */}
//       <div className="flex items-start gap-4 mb-4">
//         <Link href={`/profile/${post.user.id}`}>
//           <Avatar>
//             <img
//               src={post.user.profileUrl ?? '/default-avatar.png'}
//               alt={post.user.name ?? 'User'}
//               className="w-10 h-10 rounded-full object-cover"
//             />
//           </Avatar>
//         </Link>
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-1">
//             <Link href={`/profile/${post.user.id}`}>
//               <span className="font-semibold hover:underline">{post.user.name}</span>
//             </Link>
//             <span className="text-muted-foreground">·</span>
//             <Link href={`/city/${post.city}`}>
//               <span className="text-muted-foreground hover:underline">   Vibe | {post.city.charAt(0).toUpperCase() + post.city.slice(1).toLowerCase()}</span>
//             </Link>
//           </div>
//           <span className="text-sm text-muted-foreground">
//             {format(new Date(post.createdAt), 'MMM d, yyyy')}
//           </span>
//         </div>
//       </div>

    
//         <div>
//       {/* Title and Content */}
//       <h2 className="text-xl font-semibold mb-2">{post.caption}</h2>
//       <p className="mb-4">{post.description}</p>

//       {/* Swiping Images */}
//       {Array.isArray(post.image) && post.image.length > 0 && (
//         <div className="relative mx-auto group">
//           <Swiper
//             modules={[Navigation, Pagination]}
//             onSwiper={(swiper) => setSwiperInstance(swiper as CustomSwiperInstance)}
//             slidesPerView={1}
//             navigation={{
//               prevEl: prevRef.current,
//               nextEl: nextRef.current,
//             }}
//             pagination={{
//               clickable: true,
//             }}
//             className="mb-4 rounded-lg"
//           >
//             {post.image.map((image, index) => (
//               <SwiperSlide key={index} className="flex justify-center items-center">
//                 <div className="max-h-[400px] w-full flex justify-center items-center bg-black">
//                   <img
//                     src={typeof image === 'string' ? image : ''}
//                     alt={`Slide ${index + 1}`}
//                     className="max-h-[400px] w-auto object-contain"
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}

//             {/* Navigation Arrows */}
//             {post.image.length > 1 && (
//               <>
//                 <button
//                   ref={prevRef}
//                   className="swiper-button-prev group-hover:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 items-center justify-center shadow-md transition-all"
//                 >
//                   <ChevronLeft className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                   ref={nextRef}
//                   className="swiper-button-next group-hover:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 items-center justify-center shadow-md transition-all"
//                 >
//                   <ChevronRight className="w-5 h-5 text-gray-800" />
//                 </button>
//               </>
//             )}

//             {/* Pagination Dots */}
//             {/* Custom Pagination Dots */}
//           {/* <div className="swiper-pagination custom-pagination absolute bottom-2 w-full flex justify-center space-x-2 z-10">
//             {post.image.map((_, index) => (
//               <button
//                 key={index}
//                 className={`w-3 h-3 rounded-full ${index === activeIndex ? 'bg-blue-500' : 'bg-gray-400'} transition-all`}
//                 onClick={() => handleDotClick({ index })} // Change image on dot click
//               />
//             ))}
//             </div> */}




            
//           </Swiper>
//         </div>
//       )}
//     </div>


//       {/* Actions */}
//       <div className="flex items-center gap-4 mb-4">
//         <Button variant="ghost" size="sm" className="gap-2">
//           <Heart className="w-4 h-4" />
//           {post.numVotes}
//         </Button>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="gap-2"
//           onClick={() => setShowComments(!showComments)}
//         >
//           <MessageCircle className="w-4 h-4" />
//           {comments.length}
//         </Button>
//         {/* <Button variant="ghost" size="sm" className="gap-2">
//           <Share2 className="w-4 h-4" />
//           Share
//         </Button> */}
//       </div>

//       {/* Comments Section */}
//       {showComments && (
//         <div className="space-y-4">
//           <div className="flex gap-2">
//             <Input
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Add a comment..."
//               className="flex-1"
//             />
//             <Button onClick={handleAddComment}>Comment</Button>
//           </div>

//           {comments.map((comment) => (
//             <div key={comment.id} className="flex gap-3">
//               <Avatar>
//                 <img
//                   src={comment.user.profileUrl ?? '/default-avatar.png'}
//                   alt={comment.user.name ?? 'User'}
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//               </Avatar>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="font-semibold">{comment.user.name}</span>
//                   <span className="text-sm text-muted-foreground">
//                     {format(new Date(comment.createdAt), 'MMM d, yyyy')}
//                   </span>
//                 </div>
//                 <p>{comment.content}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </Card>
//   );
// }
import React from 'react'

type Props = {}

const PostCa = (props: Props) => {
  return (
    <div>post-card</div>
  )
}

export default PostCa