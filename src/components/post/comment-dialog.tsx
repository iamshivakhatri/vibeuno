"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Trash, Heart } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
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
}: CommentDialogProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId)
  }

  const submitReply = () => {
    if (replyingTo) {
      handleComment(place.id, newComment, replyingTo)
      setNewComment("")
      setReplyingTo(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[512px] p-0">
        <div className="flex flex-col h-[80vh]">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Comments</h2>
          </div>
          <ScrollArea className="flex-1 p-4">
            {place.comments.map((comment) => (
              <div key={comment.id} className="mb-6">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <Image
                      src={comment.user.profileUrl || "/placeholder.svg"}
                      alt={comment.user.name || "User"}
                      width={32}
                      height={32}
                    />
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-sm">{comment.user.name}</span>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      {isCurrentUser && comment.user.id === "current-user" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                          onClick={() => mutateDelete(comment.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                      <button
                        className={`hover:text-foreground flex items-center gap-1 ${comment.hasUserLiked ? "text-red-500" : "text-muted-foreground"}`}
                        onClick={() => handleLike(comment.id)}
                      >
                        <Heart className="h-3 w-3" fill={comment.hasUserLiked ? "red" : "none"} /> {comment.likes}
                      </button>
                      <button className="hover:text-foreground" onClick={() => handleReply(comment.id)}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            )).reverse()}
          </ScrollArea>
          <div className="p-4 border-t">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
