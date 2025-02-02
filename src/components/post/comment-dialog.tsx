"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Trash, Heart } from "lucide-react"
import Image from "next/image"
import { useState, useRef } from "react"
import { CommentType } from "./CommentSection"

interface CommentDialogProps {
  isOpen: boolean
  onClose: () => void
  place: {
    id: string
    comments: CommentType[]
  }
  profileUrl: string | null | undefined
  handleComment: (placeId: string, content: string, parentId?: string) => void
  mutateDelete: (commentId: string) => void
  handleLike: (commentId: string) => void
  isCurrentUser: boolean
  userId: string
}

interface CommentWithReplies extends CommentType {
  replies?: CommentType[]
}

export function CommentDialog({
  isOpen,
  onClose,
  place,
  profileUrl,
  handleComment,
  mutateDelete,
  handleLike,
  isCurrentUser,
  userId
}: CommentDialogProps) {
  const [mainComment, setMainComment] = useState("")
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null)
  const [replyMap, setReplyMap] = useState<{ [key: string]: string }>({})
  const mainInputRef = useRef<HTMLTextAreaElement>(null)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  
  const organizeComments = (comments: CommentType[]) => {
    const commentMap = new Map<string, CommentWithReplies>()
    const topLevelComments: CommentWithReplies[] = []

    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!
      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId)
        if (parentComment) {
          parentComment.replies = parentComment.replies || []
          parentComment.replies.push(commentWithReplies)
        }
      } else {
        topLevelComments.push(commentWithReplies)
      }
    })

    return topLevelComments
  }

  const organizedComments = organizeComments(place.comments)

  const handleSubmitMainComment = () => {
    if (mainComment.trim()) {
      handleComment(place.id, mainComment)
      setMainComment("")
    }
  }

  const handleSubmitReply = (parentCommentId: string) => {
    if (replyInputRef.current && replyInputRef.current.value.trim()) {
      handleComment(place.id, replyInputRef.current.value, parentCommentId)
      replyInputRef.current.value = ""
      setActiveReplyId(null)
    }
  }

  const handleMainCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMainComment(e.target.value)
  }

  const Comment = ({ comment, level = 0 }: { comment: CommentWithReplies; level?: number }) => {
    const isReplyOpen = activeReplyId === comment.id
    const marginClass = level === 0 ? "" : "ml-6"

    return (
      <div className={`mb-4 ${marginClass}`}>
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <Image
              src={comment.user.profileUrl || "/placeholder.svg"}
              alt={comment.user.name || "User"}
              width={32}
              height={32}
            />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-semibold text-sm">{comment.user.name}</span>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
              {(isCurrentUser && comment.user.id === "current-user") || (userId === comment.userId) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground text-red-500"
                  onClick={() => mutateDelete(comment.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              <button
                className={`flex items-center gap-1 ${
                  comment.hasUserLiked ? "text-red-500" : ""
                }`}
                onClick={() => handleLike(comment.id)}
              >
                <Heart 
                  className="h-3 w-3" 
                  fill={comment.hasUserLiked ? "currentColor" : "none"} 
                /> 
                {comment.likes}
              </button>
              <button
                className="hover:text-foreground"
                onClick={() => {
                  if (isReplyOpen) {
                    setActiveReplyId(null)
                    replyInputRef.current!.value = ""
                  } else {
                    setActiveReplyId(comment.id)
                  }
                }}
              >
                {isReplyOpen ? "Cancel" : "Reply"}
              </button>
            </div>

            {isReplyOpen && (
              <div className="mt-3 flex gap-3 items-start">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <Image
                    src={profileUrl || "/placeholder.svg"}
                    alt="Your avatar"
                    width={32}
                    height={32}
                  />
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <textarea
                    ref={replyInputRef}
                    placeholder="Write a reply......"
                    className="flex-1 min-h-[60px] p-2 resize-none rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Button
                    size="icon"
                    onClick={() => handleSubmitReply(comment.id)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
        
        {level === 0 && <Separator className="my-4" />}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[512px] p-0">
        <div className="flex flex-col h-[80vh]">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Comments</h2>
          </div>
          <ScrollArea className="flex-1 p-4">
            {organizedComments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex gap-3 items-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <Image
                  src={profileUrl || "/placeholder.svg"}
                  alt="Your avatar"
                  width={32}
                  height={32}
                />
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  ref={mainInputRef}
                  placeholder="Add a comment..."
                  value={mainComment}
                  onChange={handleMainCommentChange}
                  className="min-h-[60px] p-2 resize-none"
                />
                <Button
                  size="icon"
                  onClick={handleSubmitMainComment}
                  disabled={!mainComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
