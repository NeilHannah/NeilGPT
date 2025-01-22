
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon } from "lucide-react"
import { useState } from "react"

export function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background/95 backdrop-blur">
      <div className="flex gap-2 max-w-3xl mx-auto">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          className="min-h-[52px] resize-none"
          rows={1}
        />
        <Button type="submit" size="icon">
          <SendIcon size={20} />
        </Button>
      </div>
    </form>
  )
}
