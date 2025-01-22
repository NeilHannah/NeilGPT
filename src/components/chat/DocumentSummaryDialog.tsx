
import { useState } from "react"
import { FileText, Upload } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DocumentSummaryDialogProps {
  onSummaryComplete: (summary: string) => void
}

export function DocumentSummaryDialog({ onSummaryComplete }: DocumentSummaryDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [fileName, setFileName] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsProcessing(true)

    const mockSummary = `Summary of ${file.name}:\n\nThis is a demonstration of the document summarization feature. In a full implementation, this would process the document and generate a real summary using AI.`

    setTimeout(() => {
      setIsProcessing(false)
      onSummaryComplete(mockSummary)
    }, 2000)
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
            <div className="text-center text-sm text-muted-foreground">
              Processing document...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
