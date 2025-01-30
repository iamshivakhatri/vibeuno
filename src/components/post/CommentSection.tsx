
// import { useState } from "react"
// import { Comment } from "./Comment"
// import { Avatar } from "@/components/ui/avatar"
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "@/components/ui/button"
// import { Send } from "lucide-react"
// import Image from "next/image"

// interface CommentSectionProps {
//   place: {
//     id: string
//     comments: CommentType[]
//   }
//   profileUrl: string | null | undefined
//   handleComment: (placeId: string, content: string, parentId?: string) => void
//   mutateDelete: (commentId: string) => void
//   handleLike: (commentId: string) => void
//   isCurrentUser: boolean
// }



// export type CommentType = {
//   id: string;
//   content: string;
//   user: {
//     id: string;
//     name: string;
//     profileUrl: string | null;
//     occupation: string | null;
//   };
//   userId: string;
//   placeId: string;
//   createdAt: Date;
//   editedAt: Date | null;
//   isEdited: boolean;
//   likes: number;
//   reported: boolean;
//   parentId: string | null;
//   visible: boolean;
// };

// export function CommentSection({ place, profileUrl, handleComment, mutateDelete, handleLike, isCurrentUser }: CommentSectionProps) {
//   const [newComment, setNewComment] = useState("")
//   const [minimizedComments, setMinimizedComments] = useState<Set<string>>(new Set())

//   const toggleMinimize = (commentId: string) => {
//     setMinimizedComments((prev) => {
//       const newSet = new Set(prev)
//       if (newSet.has(commentId)) {
//         newSet.delete(commentId)
//       } else {
//         newSet.add(commentId)
//       }
//       return newSet
//     })
//   }

//   const renderComments = (comments: CommentType[], parentId: string | null = null, depth = 0) => {
//     return comments
//       .filter((comment) => comment.parentId === parentId)
//       .map((comment) => (
//         <div key={comment.id} className={depth > 0 ? "ml-8 relative" : ""}>
//           {depth > 0 && (
//             <svg className="absolute -left-4 top-0 h-full w-8" xmlns="http://www.w3.org/2000/svg" fill="none">
//               <path d="M1 0C1 20 8 28 24 28" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
//             </svg>
//           )}
//           <Comment
//             comment={comment}
//             handleReply={(content) => handleComment(place.id, content, comment.id)}
//             handleLike={() => handleLike(comment.id)}
//             mutateDelete={() => mutateDelete(comment.id)}
//             isMinimized={minimizedComments.has(comment.id)}
//             toggleMinimize={() => toggleMinimize(comment.id)}
//             isCurrentUser={isCurrentUser}
//           />
//           {!minimizedComments.has(comment.id) && renderComments(comments, comment.id, depth + 1)}
//         </div>
//       ))
//   }

//   return (
//     <div className="space-y-4">
//       {renderComments(place.comments)}

//       <div className="flex gap-3 items-center">
//         <Avatar className="h-8 w-8">
//           <Image src={profileUrl || "https://github.com/shadcn.png"} alt="Your avatar" width={32} height={32} />
//         </Avatar>
//         <div className="flex-1 flex gap-2">
//           <Textarea
//             placeholder="Add a comment..."
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             className="min-h-0 h-9 py-2 resize-none"
//           />
//           <Button
//             size="icon"
//             onClick={() => {
//               handleComment(place.id, newComment)
//               setNewComment("")
//             }}
//             disabled={!newComment.trim()}
//           >
//             <Send className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import Image from "next/image"
import { CommentDialog } from "./comment-dialog"


interface CommentSectionProps {
  place: {
    id: string
    comments: CommentType[]
  }
  profileUrl: string | null | undefined
  handleComment: (placeId: string, content: string, parentId?: string) => void
  mutateDelete: (commentId: string) => void
  handleLike: (commentId: string) => void
  isCurrentUser: boolean
}

// Dummy data for testing
const DUMMY_COMMENTS = [
  {
    id: "1",
    content: "This place looks absolutely stunning! 😍",
    user: {
      id: "u1",
      name: "Sarah Chen",
      profileUrl: "/placeholder.svg?height=40&width=40",
      occupation: "Travel Photographer",
    },
    userId: "u1",
    placeId: "p1",
    createdAt: new Date("2024-01-29T10:00:00"),
    editedAt: null,
    isEdited: false,
    likes: 24,
    reported: false,
    parentId: null,
    visible: true,
  },
  {
    id: "2",
    content: "The architecture is breathtaking! When's the best time to visit?",
    user: {
      id: "u2",
      name: "Alex Rivera",
      profileUrl: "/placeholder.svg?height=40&width=40",
      occupation: "Travel Blogger",
    },
    userId: "u2",
    placeId: "p1",
    createdAt: new Date("2024-01-29T11:30:00"),
    editedAt: null,
    isEdited: false,
    likes: 15,
    reported: false,
    parentId: null,
    visible: true,
  },
  {
    id: "3",
    content: "Spring is perfect! The weather is just right.",
    user: {
      id: "u3",
      name: "Emma Wilson",
      profileUrl: "/placeholder.svg?height=40&width=40",
      occupation: "Local Guide",
    },
    userId: "u3",
    placeId: "p1",
    createdAt: new Date("2024-01-29T12:00:00"),
    editedAt: null,
    isEdited: false,
    likes: 8,
    reported: false,
    parentId: "2",
    visible: true,
  },
]

// interface CommentSectionProps {
//   placeId: string
//   profileUrl: string | null | undefined
//   isCurrentUser: boolean
// }

export type CommentType = {
  id: string
  content: string
  user: {
    id: string
    name: string
    profileUrl: string | null
    occupation: string | null
  }
  userId: string
  placeId: string
  createdAt: Date
  editedAt: Date | null
  isEdited: boolean
  likes: number
  reported: boolean
  parentId: string | null
  visible: boolean
  hasUserLiked?: boolean
}

export function CommentSection({ place, profileUrl, handleComment, mutateDelete, handleLike, isCurrentUser }: CommentSectionProps) {


// export function CommentSection({ placeId, profileUrl, isCurrentUser }: CommentSectionProps) {
  // const [comments, setComments] = useState<CommentType[]>(place.comments)
  const [newComment, setNewComment] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  console.log("this is the place in comment section", place)

  
  // Get the two most recent comments
  const recentComments = place.comments
    .filter((comment) => !comment.parentId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2)

  return (
    <div className="space-y-4">
      {/* Comment Preview */}
      {recentComments.length > 0 && (
        <div className="space-y-2">
          {recentComments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <span className="font-semibold text-sm">{comment.user.name}</span>
              <span className="text-sm text-muted-foreground">{comment.content}</span>
            </div>
          ))}
          {place.comments.length > 0 && (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all {place.comments.length} comments
            </button>
          )}
        </div>
      )} 

          {/* <button
              onClick={() => setIsDialogOpen(true)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              View all {place.comments.length} comments
            </button> */}


      {/* Quick Comment Input */}
      <div className="flex gap-3 items-center">
        <Avatar className="h-8 w-8">
          <Image src={profileUrl || "/placeholder.svg"} alt="Your avatar" width={32} height={32} />
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-0 h-9 py-2 resize-none"
          />
          <Button
            size="icon"
            onClick={() => {
              handleComment(place.id, newComment)
              setNewComment("")
            }}
            disabled={!newComment.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comments Dialog */}
      <CommentDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        place={{
          id: place.id,
          comments: place.comments,
        }}
        profileUrl={profileUrl}
        handleComment={handleComment}
        mutateDelete={mutateDelete}
        handleLike={handleLike}
        isCurrentUser={isCurrentUser}
      />
    </div>
  )
}

