
import type { NextApiRequest, NextApiResponse } from "next"
import { openai, validateApiKey, OpenAIError } from "@/lib/openai"

type ResponseData = {
  response?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    res.status(405).end()
    return
  }

  try {
    await validateApiKey()
    
    const { message } = req.body

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
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.5
    })

    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      throw new Error("No response generated")
    }

    res.status(200).json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    
    if (error instanceof OpenAIError) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(500).json({ 
        error: "An unexpected error occurred. Please try again later."
      })
    }
  }
}
