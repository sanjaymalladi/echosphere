// Google Gemini AI API integration
// Documentation: https://ai.google.dev/docs/gemini-api

// This function makes a request to the Gemini API
export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Gemini API key is missing");
      return "I'm having trouble connecting to my AI services. Please make sure you've set up your NEXT_PUBLIC_GEMINI_API_KEY environment variable.";
    }

    // API endpoint for Gemini model
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    // Make the API request
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      return "Sorry, I encountered an error when processing your request. Please try again later.";
    }

    const data = await response.json();
    
    // Extract the generated text from the response
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response structure:", data);
      return "I received an unexpected response. Please try again with a different question.";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I encountered an error while processing your request. Please try again later.";
  }
} 