
import { z } from "zod"
import { openai } from "@/lib/openai"

export interface SourceMetadata {
  url: string
  title: string
  reliability: number
  lastUpdated: string
}

export interface ValidationProgress {
  stage: "initializing" | "searching" | "analyzing" | "validating" | "complete"
  progress: number
  currentSource?: string
}

export interface ValidationResult {
  isValid: boolean
  confidence: number
  sources: SourceMetadata[]
  explanation: string
  analysisDetails?: {
    factualAccuracy: number
    sourceReliability: number
    contextRelevance: number
  }
}

const ValidationResponseSchema = z.object({
  isValid: z.boolean(),
  confidence: z.number(),
  sources: z.array(z.object({
    url: z.string(),
    title: z.string(),
    reliability: z.number(),
    lastUpdated: z.string()
  })),
  explanation: z.string(),
  analysisDetails: z.object({
    factualAccuracy: z.number(),
    sourceReliability: z.number(),
    contextRelevance: z.number()
  }).optional()
})

async function searchRelevantSources(query: string): Promise<SourceMetadata[]> {
  try {
    const searchPrompt = `Find relevant, reliable sources for the following query: ${query}`
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a research assistant. Provide relevant, high-quality sources in JSON format."
        },
        {
          role: "user",
          content: searchPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    })

    const sourcesJson = JSON.parse(completion.choices[0]?.message?.content || "[]")
    return sourcesJson.sources || []
  } catch (error) {
    console.error("Error searching sources:", error)
    return []
  }
}

async function analyzeFactualAccuracy(response: string, sources: SourceMetadata[]): Promise<{
  isValid: boolean
  confidence: number
  explanation: string
  analysisDetails: {
    factualAccuracy: number
    sourceReliability: number
    contextRelevance: number
  }
}> {
  try {
    const analysisPrompt = `
      Analyze the following response for factual accuracy:
      Response: ${response}
      
      Available sources: ${JSON.stringify(sources)}
      
      Provide your analysis in JSON format with the following structure:
      {
        "isValid": boolean,
        "confidence": number (0-100),
        "explanation": string,
        "analysisDetails": {
          "factualAccuracy": number (0-100),
          "sourceReliability": number (0-100),
          "contextRelevance": number (0-100)
        }
      }
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a fact-checking assistant. Analyze responses for factual accuracy and provide detailed analysis."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1
    })

    const analysis = JSON.parse(completion.choices[0]?.message?.content || "{}")
    return analysis
  } catch (error) {
    console.error("Error analyzing response:", error)
    return {
      isValid: true,
      confidence: 70,
      explanation: "Unable to perform detailed analysis. Assuming general validity based on AI response.",
      analysisDetails: {
        factualAccuracy: 70,
        sourceReliability: 70,
        contextRelevance: 70
      }
    }
  }
}

export async function validateResponse(query: string, response: string): Promise<ValidationResult> {
  try {
    const sources = await searchRelevantSources(query)
    const analysis = await analyzeFactualAccuracy(response, sources)

    const validation: ValidationResult = {
      isValid: analysis.isValid,
      confidence: analysis.confidence,
      sources: sources,
      explanation: analysis.explanation,
      analysisDetails: analysis.analysisDetails
    }

    return ValidationResponseSchema.parse(validation)
  } catch (error) {
    console.error("Error in validation:", error)
    return {
      isValid: true,
      confidence: 70,
      sources: [],
      explanation: "Validation service encountered an error. Assuming general validity of AI response.",
      analysisDetails: {
        factualAccuracy: 70,
        sourceReliability: 70,
        contextRelevance: 70
      }
    }
  }
}
