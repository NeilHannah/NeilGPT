
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

  const handleSend = async (message: string) => {
    const userMessage: Message = { role: "user", content: message }
    const assistantResponse = "I'm a demo version of NeilGPT. This is a placeholder response to demonstrate the UI. In a full implementation, this would be connected to an AI model."
    
    const assistantMessage: Message = {
      role: "assistant",
      content: assistantResponse,
      validation: { isValid: undefined }
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])

    const validation = await validateResponse(message, assistantResponse)
    
    setMessages(prev => prev.map(msg => 
      msg === assistantMessage 
        ? { ...msg, validation }
        : msg
    ))
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
              />
            ))}
          </div>
          <ChatInput onSend={handleSend} />
        </div>
      </ChatLayout>
    </>
  )
}
