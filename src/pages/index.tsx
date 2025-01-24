
import Head from "next/head"
import { useState } from "react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { validateResponse, ValidationResult, SourceMetadata } from "@/services/validationService"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ApiKeyGuide } from "@/components/ApiKeyGuide"

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

interface Message {
  role: "assistant" | "user"
  content: string
  validation?: ValidationInfo
  error?: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm NeilGPT. How can I assist you today?"
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showApiGuide, setShowApiGuide] = useState(false)

  const generateAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.error?.includes("Preview API")) {
          setShowApiGuide(true)
        }
        throw new Error(data.error || "Failed to get AI response")
      }

      return data.response
    } catch (error) {
      console.error("Error generating AI response:", error)
      if (error instanceof Error && error.message.includes("Preview API")) {
        setShowApiGuide(true)
        throw new Error("API Configuration Error: Preview API keys are not supported. Please use a production API key.")
      }
      throw error
    }
  }

  const handleSend = async (message: string) => {
    setIsLoading(true)
    setError(null)
    const userMessage: Message = { role: "user", content: message }
    
    setMessages(prev => [...prev, userMessage])

    try {
      const aiResponse = await generateAIResponse(message)
      
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        validation: { isValid: undefined }
      }

      setMessages(prev => [...prev, assistantMessage])

      const validation = await validateResponse(message, aiResponse)
      
      setMessages(prev => prev.map(msg => 
        msg === assistantMessage 
          ? { ...msg, validation }
          : msg
      ))
    } catch (error) {
      console.error("Error in chat:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "",
        error: errorMessage
      }])
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSummarize = (summary: string) => {
    const newMessages: Message[] = [
      ...messages,
      {
        role: "assistant",
        content: summary
      }
    ]
    setMessages(newMessages)
  }

  return (
    <>
      <Head>
        <title>NeilGPT - AI Assistant</title>
        <meta name="description" content="Chat with NeilGPT - Your AI Assistant" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ChatLayout onSummarize={handleSummarize}>
        <div className="flex flex-col min-h-screen">
          {error && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          {showApiGuide ? (
            <ApiKeyGuide />
          ) : (
            <div className="flex-1 overflow-y-auto">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  validation={message.validation}
                  error={message.error}
                  isLoading={isLoading && index === messages.length - 1}
                />
              ))}
            </div>
          )}
          <ChatInput onSend={handleSend} />
        </div>
      </ChatLayout>
    </>
  )
}
