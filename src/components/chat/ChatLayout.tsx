
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PanelLeftIcon, PlusIcon } from "lucide-react"
import { useState } from "react"
import { DocumentSummaryDialog } from "./DocumentSummaryDialog"

interface ChatLayoutProps {
  children: React.ReactNode
  onSummarize?: (summary: string) => void
}

export function ChatLayout({ children, onSummarize }: ChatLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <div className={cn(
        "fixed left-0 top-0 z-40 h-screen w-72 border-r bg-muted/40 transition-transform",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col gap-2 p-4">
          <Button className="w-full justify-start gap-2" variant="outline">
            <PlusIcon size={16} />
            New Chat
          </Button>
          <div className="flex-1 overflow-auto">
            <div className="space-y-2 pt-4">
            </div>
          </div>
        </div>
      </div>

      <div className={cn(
        "flex flex-1 flex-col transition-all",
        sidebarOpen ? "pl-72" : "pl-0"
      )}>
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center gap-2 px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <PanelLeftIcon size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">NeilGPT</h1>
            </div>
            {onSummarize && <DocumentSummaryDialog onSummaryComplete={onSummarize} />}
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
