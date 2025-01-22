
import type { NextApiRequest, NextApiResponse } from "next"
import { openai, validateApiKey, OpenAIError } from "@/lib/openai"

type ResponseData = {
  response?: string
  error?: string
  debug?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    console.log("Validating API key...")
    await validateApiKey()
    
    const { message } = req.body
    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    console.log("Creating chat completion...")
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are NeilGPT, a helpful and knowledgeable AI assistant. You provide accurate, informative responses while being friendly and conversational."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    })

    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      console.error("No response generated from OpenAI")
      throw new Error("No response generated")
    }

    console.log("Successfully generated response")
    res.status(200).json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    
    if (error instanceof OpenAIError) {
      return res.status(500).json({ 
        error: error.message,
        debug: process.env.NODE_ENV === "development" ? { 
          apiKeyExists: !!process.env.OPENAI_API_KEY,
          orgIdExists: !!process.env.OPENAI_ORG_ID
        } : undefined
      })
    }

    return res.status(500).json({ 
      error: "An unexpected error occurred. Please try again later.",
      debug: process.env.NODE_ENV === "development" ? {
        message: error instanceof Error ? error.message : "Unknown error",
        apiKeyExists: !!process.env.OPENAI_API_KEY,
        orgIdExists: !!process.env.OPENAI_ORG_ID
      } : undefined
    })
  }
}
