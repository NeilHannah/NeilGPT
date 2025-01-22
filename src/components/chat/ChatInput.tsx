
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon } from "lucide-react"
import { useState, useEffect, KeyboardEvent } from "react"

export function ChatInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("")
  const [rows, setRows] = useState(1)

  useEffect(() => {
    const lineCount = message.split("\n").length
    setRows(Math.min(Math.max(lineCount, 1), 5))
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message.trim())
      setMessage("")
      setRows(1)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-background/95 backdrop-blur border-t">
      <div className="max-w-3xl mx-auto relative">
        <Textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Message NeilGPT... (Ctrl+Enter to send)"
          className="min-h-[52px] resize-none pr-12 focus-visible:ring-1"
          rows={rows}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 bottom-2 h-8 w-8"
          disabled={!message.trim()}
        >
          <SendIcon size={16} />
        </Button>
      </div>
      <div className="max-w-3xl mx-auto mt-2">
        <p className="text-xs text-muted-foreground text-center">
          NeilGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </form>
  )
}
