import { Button } from "@/components/ui/button"

interface ReplyButtonProps {
  onClick: () => void
}

export function ReplyButton({ onClick }: ReplyButtonProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick} className="p-0 h-auto">
      Reply
    </Button>
  )
}

