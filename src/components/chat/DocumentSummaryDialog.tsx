
import { useState } from "react"
import { FileText, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { openai } from "@/lib/openai"

interface DocumentSummaryDialogProps {
  onSummaryComplete: (summary: string) => void
}

export function DocumentSummaryDialog({ onSummaryComplete }: DocumentSummaryDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState("")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const processDocument = async (text: string): Promise<string> => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a document summarization assistant. Provide clear, concise summaries while maintaining key information."
        },
        {
          role: "user",
          content: `Please summarize the following document:\n\n${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })

    return completion.choices[0]?.message?.content || "Unable to generate summary."
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsProcessing(true)
    setProgress(0)
    setError("")

    try {
      const text = await file.text()
      setProgress(50)
      
      const summary = await processDocument(text)
      setProgress(100)
      onSummaryComplete(summary)
    } catch (err) {
      setError("Error processing document. Please try again.")
      console.error("Document processing error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <FileText size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Summarize Document</DialogTitle>
          <DialogDescription>
            Upload a document to generate an AI-powered summary.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex-1 flex items-center justify-center gap-2 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
            >
              <Upload size={20} />
              {fileName || "Upload a document to summarize"}
            </label>
          </div>
          {isProcessing && (
            <div className="space-y-2">
              <div className="text-center text-sm text-muted-foreground">
                Processing document...
              </div>
              <Progress value={progress} />
            </div>
          )}
          {error && (
            <div className="text-center text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
