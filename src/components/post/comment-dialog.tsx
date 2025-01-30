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

  // Group comments by parent
  const commentThreads = place.comments.reduce(
    (acc, comment) => {
      if (!comment.parentId) {
        acc[comment.id] = {
          parent: comment,
          replies: [],
        }
      }
      return acc
    },
    {} as Record<string, { parent: CommentType; replies: CommentType[] }>,
  )

  // Add replies to their parent threads
  place.comments.forEach((comment) => {
    if (comment.parentId && commentThreads[comment.parentId]) {
      commentThreads[comment.parentId].replies.push(comment)
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[512px] p-0">
        <div className="flex flex-col h-[80vh]">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Comments</h2>
          </div>

          <ScrollArea className="flex-1 p-4">
            {Object.values(commentThreads).map(({ parent, replies }) => (
              <div key={parent.id} className="mb-6">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <Image
                      src={parent.user.profileUrl || "/placeholder.svg"}
                      alt={parent.user.name || "User"}
                      width={32}
                      height={32}
                    />
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-semibold text-sm">{parent.user.name}</span>
                        <p className="text-sm">{parent.content}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isCurrentUser && parent.user.id === "current-user" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => mutateDelete(parent.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(parent.createdAt).toLocaleDateString()}</span>
                      <button
                        className="hover:text-foreground flex items-center gap-1"
                        onClick={() => handleLike(parent.id)}
                      >
                        <Heart className="h-3 w-3" /> {parent.likes}
                      </button>
                      <button className="hover:text-foreground" onClick={() => handleReply(parent.id)}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {replies.length > 0 && (
                  <div className="ml-11 mt-4 space-y-4">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <Image
                            src={reply.user.profileUrl || "/placeholder.svg"}
                            alt={reply.user.name || "User"}
                            width={24}
                            height={24}
                          />
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-semibold text-sm">{reply.user.name}</span>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                            {isCurrentUser && reply.user.id === "current-user" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                onClick={() => mutateDelete(reply.id)}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                            <button
                              className="hover:text-foreground flex items-center gap-1"
                              onClick={() => handleLike(reply.id)}
                            >
                              <Heart className="h-3 w-3" /> {reply.likes}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo === parent.id && (
                  <div className="ml-11 mt-4 flex gap-2">
                    <Avatar className="h-6 w-6">
                      <Image src={profileUrl || "/placeholder.svg"} alt="Your avatar" width={24} height={24} />
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder={`Reply to ${parent.user.name}...`}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-0 h-9 py-2 resize-none text-sm"
                      />
                      <Button size="sm" onClick={submitReply} disabled={!newComment.trim()}>
                        Reply
                      </Button>
                    </div>
                  </div>
                )}

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