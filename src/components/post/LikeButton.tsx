import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"

interface LikeButtonProps {
  likes: number
  onLike: () => void
}

export function LikeButton({ likes, onLike }: LikeButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onLike} className="p-0 h-auto flex items-center gap-1">
      <ThumbsUp className="h-4 w-4" />
      <span>{likes}</span>
    </Button>
  )
}

