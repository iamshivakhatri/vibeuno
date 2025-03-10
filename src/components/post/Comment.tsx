import { useState, useRef } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Trash, Send, ThumbsUp, CornerDownRight, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { CommentType } from "./CommentSection"

interface CommentProps {
  comment: CommentType
  handleReply: (content: string) => void
  handleLike: () => void
  mutateDelete: () => void
  isMinimized: boolean
  toggleMinimize: () => void
  isCurrentUser: boolean
}

export function Comment({ comment, handleReply, handleLike, mutateDelete, isMinimized, toggleMinimize, isCurrentUser }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleReplySubmit = () => {
    if (textareaRef.current && textareaRef.current.value.trim()) {
      handleReply(textareaRef.current.value)
      textareaRef.current.value = ""
      setShowReplyForm(false)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 mt-1">
          <Image
            src={comment.user.profileUrl || "https://github.com/shadcn.png"}
            alt={comment.user.name || "User"}
            width={32}
            height={32}
          />
        </Avatar>
        <div className="flex-1">
          <div className="bg-accent rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{comment.user.name}</p>
                {comment.parentId && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <CornerDownRight className="h-3 w-3 mr-1" />
                    Reply
                  </span>
                )}
              </div>
              <button
                onClick={toggleMinimize}
                className="text-muted-foreground hover:text-foreground"
                aria-label={isMinimized ? "Expand comment" : "Minimize comment"}
              >
                {isMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>

          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
            <button className="hover:text-foreground flex items-center gap-1" onClick={handleLike}>
              <ThumbsUp className="h-3 w-3" />
              <span>{comment.likes || 0}</span>
            </button>
            <button 
              className="hover:text-foreground" 
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </button>
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            {isCurrentUser && (
              <button
                className="text-red-500 hover:text-red-700 ml-auto"
                onClick={mutateDelete}
                aria-label="Delete comment"
              >
                <Trash className="h-3 w-3" />
              </button>
            )}
          </div>

          {!isMinimized && showReplyForm && (
            <div className="mt-2 flex gap-2">
              <textarea
                ref={textareaRef}
                placeholder="Write a reply..."
                className="flex-1 min-h-0 h-9 py-2 px-3 resize-none rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button
                onClick={handleReplySubmit}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

