
import OpenAI from "openai"

const OPENAI_ERROR_MESSAGES = {
  NO_API_KEY: "OpenAI API key is not configured. Please add your API key to the environment variables.",
  INVALID_API_KEY: "Invalid OpenAI API key. Please check your configuration.",
  RATE_LIMIT: "Rate limit exceeded. Please try again later.",
  GENERAL_ERROR: "An error occurred while connecting to OpenAI. Please try again.",
  PREVIEW_KEY: "Preview API keys are not supported. Please use a production API key."
}

export class OpenAIError extends Error {
  constructor(public code: keyof typeof OPENAI_ERROR_MESSAGES) {
    super(OPENAI_ERROR_MESSAGES[code])
    this.name = "OpenAIError"
  }
}

const getOpenAIInstance = () => {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  
  if (!apiKey) {
    console.error("OpenAI API key is missing")
    throw new OpenAIError("NO_API_KEY")
  }

  if (apiKey.startsWith("sk-proj-")) {
    console.error("Preview API key detected")
    throw new OpenAIError("PREVIEW_KEY")
  }

  try {
    return new OpenAI({
      apiKey: apiKey,
      organization: process.env.OPENAI_ORG_ID?.trim(),
      maxRetries: 3,
      timeout: 30000
    })
  } catch (error) {
    console.error("Error initializing OpenAI:", error)
    throw new OpenAIError("GENERAL_ERROR")
  }
}

let openaiInstance: OpenAI | null = null

export const openai = (): OpenAI => {
  if (!openaiInstance) {
    openaiInstance = getOpenAIInstance()
  }
  return openaiInstance
}

export async function validateApiKey(): Promise<boolean> {
  try {
    console.log("Testing OpenAI connection...")
    const instance = openai()
    await instance.models.list()
    console.log("OpenAI connection successful")
    return true
  } catch (error: any) {
    console.error("OpenAI connection error:", error)
    if (error?.status === 401) {
      throw new OpenAIError("INVALID_API_KEY")
    }
    if (error?.status === 429) {
      throw new OpenAIError("RATE_LIMIT")
    }
    throw new OpenAIError("GENERAL_ERROR")
  }
}
