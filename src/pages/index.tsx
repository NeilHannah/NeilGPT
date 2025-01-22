
import Head from "next/head"
import { useState } from "react"
import { ChatLayout } from "@/components/chat/ChatLayout"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { validateResponse, ValidationResult, SourceMetadata } from "@/services/validationService"

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
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm NeilGPT. How can I assist you today?"
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const generateAIResponse = async (userMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error generating AI response:", error)
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
    }
  }

  const handleSend = async (message: string) => {
    setIsLoading(true)
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
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        validation: { isValid: false }
      }
      setMessages(prev => [...prev, errorMessage])
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
          <div className="flex-1 overflow-y-auto">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                validation={message.validation}
                isLoading={isLoading && index === messages.length - 1}
              />
            ))}
          </div>
          <ChatInput onSend={handleSend} />
        </div>
      </ChatLayout>
    </>
  )
}
