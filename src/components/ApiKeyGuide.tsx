
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

export function ApiKeyGuide() {
  return (
    <Card className="max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Getting Your OpenAI API Key</CardTitle>
        <CardDescription>Follow these steps to obtain a production API key for NeilGPT</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Your current API key is a preview key. You need a production key that starts with "sk-" (not "sk-proj-").
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Steps to get a production API key:</h3>
          
          <ol className="space-y-4">
            <li className="flex gap-4">
              <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">1</div>
              <div>
                <p>Visit the OpenAI API dashboard</p>
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Go to OpenAI Dashboard <ExternalLink size={14} />
                </a>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">2</div>
              <div>
                <p>Sign in or create an OpenAI account</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">3</div>
              <div>
                <p>Click on "Create new secret key"</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">4</div>
              <div>
                <p>Give your key a name (e.g., "NeilGPT Production")</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">5</div>
              <div>
                <p>Copy your new API key (it should start with "sk-")</p>
              </div>
            </li>
            
            <li className="flex gap-4">
              <div className="flex-none w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">6</div>
              <div>
                <p>Replace the existing API key in your .env.local file</p>
              </div>
            </li>
          </ol>
        </div>

        <Alert className="mt-6">
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            Make sure to keep your API key secure and never share it publicly. The key should be kept in your .env.local file and not committed to version control.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
