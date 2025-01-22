
import type { NextApiRequest, NextApiResponse } from "next"
import { openai } from "@/lib/openai"

type ResponseData = {
  response: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    res.status(405).end()
    return
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ response: "OpenAI API key is not configured" })
  }

  try {
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
    })

    const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response."
    res.status(200).json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    res.status(500).json({ 
      response: "I apologize, but I encountered an error processing your request."
    })
  }
}
