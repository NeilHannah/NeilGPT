
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

  console.log("API Route - Environment Check:", {
    hasApiKey: !!process.env.OPENAI_API_KEY,
    apiKeyLength: process.env.OPENAI_API_KEY?.length,
    hasOrgId: !!process.env.OPENAI_ORG_ID,
    nodeEnv: process.env.NODE_ENV
  })

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new OpenAIError("NO_API_KEY")
    }

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
        debug: { 
          apiKeyExists: !!process.env.OPENAI_API_KEY,
          apiKeyLength: process.env.OPENAI_API_KEY?.length,
          orgIdExists: !!process.env.OPENAI_ORG_ID,
          nodeEnv: process.env.NODE_ENV,
          errorName: error.name,
          errorMessage: error.message
        }
      })
    }

    return res.status(500).json({ 
      error: "An unexpected error occurred. Please try again later.",
      debug: {
        message: error instanceof Error ? error.message : "Unknown error",
        apiKeyExists: !!process.env.OPENAI_API_KEY,
        apiKeyLength: process.env.OPENAI_API_KEY?.length,
        orgIdExists: !!process.env.OPENAI_ORG_ID,
        nodeEnv: process.env.NODE_ENV
      }
    })
  }
}
