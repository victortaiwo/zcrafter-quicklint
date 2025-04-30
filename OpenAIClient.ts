import axios from 'axios';

export class OpenAIClient {
  // Allow setting a static API key for testing
  private static apiKeyOverride: string | null = null;

  public static setApiKey(key: string): void {
    OpenAIClient.apiKeyOverride = key;
  }

  public static async lintCobol(code: string): Promise<string> {
    // Try to get API key from override or environment
    const apiKey = OpenAIClient.apiKeyOverride || process.env.OPENAI_API_KEY?.trim();
    
    if (!apiKey) {
      throw new Error("OpenAI API key not found. Please set OPENAI_API_KEY environment variable or use --api-key option.");
    }

    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a COBOL code analyzer. Report syntax errors and best-practice issues."
        },
        {
          role: "user",
          content:
            "Please lint this COBOL member:\n\n```cobol\n" +
            code +
            "\n```"
        }
      ],
      temperature: 0
    };

    try {
      console.log("Making OpenAI API request...");
      
      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        data: body,
        timeout: 30000 // 30 second timeout
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error in OpenAI API call:");
      
      if (axios.isAxiosError(error)) {
        console.error(`Status: ${error.response?.status || 'unknown'}`);
        console.error(`Response data: ${JSON.stringify(error.response?.data || {})}`);
        
        if (error.response?.status === 401) {
          throw new Error("Authentication error with OpenAI API. Please check your API key.");
        } else {
          throw new Error(`OpenAI API error: ${error.message}`);
        }
      } else {
        console.error("Non-Axios error:", error);
        throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
}