// Google Gemini AI API integration
// Documentation: https://ai.google.dev/docs/gemini-api

/**
 * Generate an AI response through the server API endpoint
 */
export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    // Use a server endpoint instead of calling the API directly
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      return "Sorry, I encountered an error when processing your request. Please try again later.";
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error calling API:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
} 