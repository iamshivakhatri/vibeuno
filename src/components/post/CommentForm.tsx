import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import Image from "next/image"

interface CommentFormProps {
  onSubmit: (content: string) => void
  avatarUrl: string
}

export function CommentForm({ onSubmit, avatarUrl }: CommentFormProps) {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content)
      setContent("")
    }
  }

  return (
    <div className="flex gap-3 items-center">
      <Avatar className="h-8 w-8">
        <Image src={avatarUrl || "https://github.com/shadcn.png"} alt="Your avatar" width={32} height={32} />
      </Avatar>
      <div className="flex-1 flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-0 h-9 py-2 resize-none"
        />
        <Button size="icon" onClick={handleSubmit} disabled={!content.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

