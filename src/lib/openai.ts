
import OpenAI from "openai"

const OPENAI_ERROR_MESSAGES = {
  NO_API_KEY: "OpenAI API key is not configured. Please add your API key to the environment variables.",
  INVALID_API_KEY: "Invalid OpenAI API key. Please check your configuration.",
  RATE_LIMIT: "Rate limit exceeded. Please try again later.",
  GENERAL_ERROR: "An error occurred while connecting to OpenAI. Please try again."
}

export class OpenAIError extends Error {
  constructor(public code: keyof typeof OPENAI_ERROR_MESSAGES) {
    super(OPENAI_ERROR_MESSAGES[code])
    this.name = "OpenAIError"
  }
}

if (!process.env.OPENAI_API_KEY) {
  console.warn(OPENAI_ERROR_MESSAGES.NO_API_KEY)
}

const apiKey = process.env.OPENAI_API_KEY

if (apiKey === "dummy-key-for-build") {
  console.warn("Using dummy API key for build process")
}

export const openai = new OpenAI({
  apiKey: apiKey || "dummy-key-for-build",
  organization: process.env.OPENAI_ORG_ID,
  defaultHeaders: {
    "OpenAI-Beta": "assistants=v1"
  },
  defaultQuery: {
    "api-version": "2024-01"
  },
  maxRetries: 3,
  timeout: 30000
})

export async function validateApiKey(): Promise<boolean> {
  if (!apiKey || apiKey === "dummy-key-for-build") {
    throw new OpenAIError("NO_API_KEY")
  }

  try {
    await openai.models.list()
    return true
  } catch (error: any) {
    if (error?.status === 401) {
      throw new OpenAIError("INVALID_API_KEY")
    }
    if (error?.status === 429) {
      throw new OpenAIError("RATE_LIMIT")
    }
    throw new OpenAIError("GENERAL_ERROR")
  }
}
