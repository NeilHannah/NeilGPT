
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, XCircle, BookOpen } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SourceMetadata {
  url: string
  title: string
  reliability: number
  lastUpdated: string
}

interface ValidationInfo {
  isValid?: boolean
  confidence?: number
  sources?: SourceMetadata[]
  explanation?: string
  analysisDetails?: {
    factualAccuracy: number
    sourceReliability: number
    contextRelevance: number
  }
}

interface ChatMessageProps {
  role: "assistant" | "user"
  content: string
  isLoading?: boolean
  validation?: ValidationInfo
  error?: string
}

export function ChatMessage({ role, content, isLoading, validation, error }: ChatMessageProps) {
  if (error) {
    return (
      <div className="w-full p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex w-full gap-4 p-8",
      role === "assistant" ? "bg-muted/50" : "bg-background"
    )}>
      <Avatar className={cn(
        "h-8 w-8",
        role === "assistant" ? "bg-primary" : "bg-secondary"
      )}>
        <span className="text-xs">
          {role === "assistant" ? "AI" : "You"}
        </span>
      </Avatar>
      <Card className="flex-1 shadow-none bg-transparent border-0">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="animate-pulse">Generating response...</div>
            </div>
          ) : content}
          {role === "assistant" && validation && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge 
                      variant={validation.isValid ? "default" : "destructive"}
                      className="cursor-help"
                    >
                      {validation.isValid ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {validation.confidence ? `${Math.round(validation.confidence)}% validated` : "Validating..."}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="w-80">
                    <div className="space-y-2">
                      <p>{validation.explanation}</p>
                      {validation.analysisDetails && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Factual Accuracy</span>
                            <span>{validation.analysisDetails.factualAccuracy}%</span>
                          </div>
                          <Progress value={validation.analysisDetails.factualAccuracy} />
                          <div className="flex justify-between text-sm">
                            <span>Source Reliability</span>
                            <span>{validation.analysisDetails.sourceReliability}%</span>
                          </div>
                          <Progress value={validation.analysisDetails.sourceReliability} />
                          <div className="flex justify-between text-sm">
                            <span>Context Relevance</span>
                            <span>{validation.analysisDetails.contextRelevance}%</span>
                          </div>
                          <Progress value={validation.analysisDetails.contextRelevance} />
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
                {validation.sources && validation.sources.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="secondary" className="cursor-help">
                        <BookOpen className="mr-1 h-3 w-3" />
                        {validation.sources.length} sources
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="w-80">
                      <div className="space-y-2">
                        <p className="font-semibold">Sources:</p>
                        {validation.sources.map((source, index) => (
                          <div key={index} className="space-y-1">
                            <a 
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline block"
                            >
                              {source.title}
                            </a>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {Math.round(source.reliability * 100)}% reliable
                              </Badge>
                              <span>Updated: {source.lastUpdated}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
