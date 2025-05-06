/**
 * Utility service for interacting with Google's Gemini API
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Updated model name in the URL
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

/**
 * Sends a prompt to the Gemini API and returns the response
 * @param {string} prompt - The user's prompt
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - The response from Gemini
 */
export const getGeminiResponse = async (prompt, conversationHistory = []) => {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is not defined. Please set VITE_GEMINI_API_KEY in your environment.");
    return "I'm having trouble connecting to my knowledge base. Please check the API key configuration.";
  }

  try {
    // Format conversation history for Gemini
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Add the current prompt
    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{
          // Updated prompt to be more general, but still guide the AI
          text: `Regarding the context of obesity, lifestyle diseases, systems thinking, and the health crisis in India: ${prompt}\n\nPlease keep your answers concise and relevant to this topic.`
        }]
      }
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.95,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", response.status, errorData);
      return `I encountered an error (Status: ${response.status}) while processing your request. Please check the console for details or try again later.`;
    }

    const data = await response.json();

    // Extract the response text from the Gemini API response
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else if (data.candidates && data.candidates[0]?.finishReason) {
      // Handle cases where content might be blocked
      console.warn("Gemini response finished with reason:", data.candidates[0].finishReason);
      return `My response was blocked due to safety settings (${data.candidates[0].finishReason}). Please rephrase your question.`;
    } else {
      console.error("Unexpected response format from Gemini API:", data);
      return "I received an unexpected response format. Please try again later.";
    }
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    return "I encountered a network error while connecting to my knowledge base. Please check your connection and try again.";
  }
};
