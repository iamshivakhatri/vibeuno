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
//   profileUrl: string
//   handleComment: (placeId: string, content: string, parentId?: string) => void
//   mutateDelete: (commentId: string) => void
//   handleLike: (commentId: string) => void
// }

// export interface CommentType {
//   id: string
//   content: string
//   user: {
//     id: string
//     name: string
//     profileUrl: string
//   }
//   userId: string
//   placeId: string
//   createdAt: string
//   editedAt?: string
//   isEdited: boolean
//   likes?: number
//   reported: boolean
//   parentId?: string
//   visible: boolean
// }

// export function CommentSection({ place, profileUrl, handleComment, mutateDelete, handleLike }: CommentSectionProps) {
//   const [newComment, setNewComment] = useState("")

//   const renderComments = (comments: CommentType[], parentId: string | null = null, depth = 0) => {
//     return comments
//       .filter((comment) => comment.parentId === parentId)
//       .map((comment) => (
//         <div key={comment.id} style={{ marginLeft: `${depth * 20}px` }}>
//           <Comment
//             comment={comment}
//             handleReply={(content) => handleComment(place.id, content, comment.id)}
//             handleLike={() => handleLike(comment.id)}
//             mutateDelete={() => mutateDelete(comment.id)}
//           />
//           {renderComments(comments, comment.id, depth + 1)}
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

import { useState } from "react"
import { Comment } from "./Comment"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import Image from "next/image"

interface CommentSectionProps {
  place: {
    id: string
    comments: CommentType[]
  }
  profileUrl: string | null | undefined
  handleComment: (placeId: string, content: string, parentId?: string) => void
  mutateDelete: (commentId: string) => void
  handleLike: (commentId: string) => void
}

export interface CommentType {
  id: string
  content: string
  user: {
    id: string
    name: string
    profileUrl: string
  }
  userId: string
  placeId: string
  createdAt: string
  editedAt?: string
  isEdited: boolean
  likes?: number
  reported: boolean
  parentId?: string
  visible: boolean
}

export function CommentSection({ place, profileUrl, handleComment, mutateDelete, handleLike }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [minimizedComments, setMinimizedComments] = useState<Set<string>>(new Set())

  const toggleMinimize = (commentId: string) => {
    setMinimizedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const renderComments = (comments: CommentType[], parentId: string | null = null, depth = 0) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <div key={comment.id} className={depth > 0 ? "ml-8 relative" : ""}>
          {depth > 0 && (
            <svg className="absolute -left-4 top-0 h-full w-8" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path d="M1 0C1 20 8 28 24 28" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          <Comment
            comment={comment}
            handleReply={(content) => handleComment(place.id, content, comment.id)}
            handleLike={() => handleLike(comment.id)}
            mutateDelete={() => mutateDelete(comment.id)}
            isMinimized={minimizedComments.has(comment.id)}
            toggleMinimize={() => toggleMinimize(comment.id)}
          />
          {!minimizedComments.has(comment.id) && renderComments(comments, comment.id, depth + 1)}
        </div>
      ))
  }

  return (
    <div className="space-y-4">
      {renderComments(place.comments)}

      <div className="flex gap-3 items-center">
        <Avatar className="h-8 w-8">
          <Image src={profileUrl || "https://github.com/shadcn.png"} alt="Your avatar" width={32} height={32} />
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
    </div>
  )
}

