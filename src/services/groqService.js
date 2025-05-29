// groqService.js
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;
const MODEL = import.meta.env.VITE_GROQ_MODEL;

/**
 * Configuration for text enhancement
 */
const ENHANCEMENT_CONFIG = {
  temperature: 0.3,
  max_tokens: 4000,
  systemPrompt: `You are a professional text editor and writing assistant. Your job is to enhance the given text by:

1. Correcting grammar, spelling, and punctuation errors
2. Improving sentence structure and flow
3. Enhancing clarity and readability
4. Maintaining the original meaning and intent
5. Preserving the exact structure and formatting (headers, lists, emphasis)
6. Keeping the same tone and style
7. If the content seems confused correct it with new content

IMPORTANT RULES:
- Preserve ALL formatting markers exactly (# for headers, • for bullets, numbers for lists, ** for bold, * for italic, __ for underline, > for quotes)
- Do NOT change the structure or organization of the content
- Do NOT add new sections or remove existing ones
- Do NOT change the order of information
- Only improve the language quality while maintaining everything else
- Ensure all text is appropriate and professional

Return ONLY the enhanced text with the same formatting structure.`
};

/**
 * Calls the Groq API to enhance text content
 * @param {string} content - The text content to enhance
 * @param {string} apiKey - The Groq API key
 * @returns {Promise<string>} - The enhanced text content
 * @throws {Error} - If the API call fails or returns invalid data
 */
export const enhanceTextWithGroq = async (content, apiKey) => {
  // Validate inputs
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Content is required and must be a non-empty string');
  }

  if (!apiKey || typeof apiKey !== 'string') {
    throw new Error('API key is required');
  }

  if (content.trim().length < 10) {
    throw new Error('Content is too short to enhance (minimum 10 characters)');
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: ENHANCEMENT_CONFIG.systemPrompt
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: ENHANCEMENT_CONFIG.temperature,
        max_tokens: ENHANCEMENT_CONFIG.max_tokens,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error?.message || errorMessage;
      } catch (jsonError) {
        // If we can't parse the error response, use the status
        console.warn('Could not parse error response:', jsonError);
      }
      
      throw new Error(`Groq API error: ${errorMessage}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Invalid response format: no choices returned');
    }

    const choice = data.choices[0];
    if (!choice.message || typeof choice.message.content !== 'string') {
      throw new Error('Invalid response format: no message content');
    }

    const enhancedText = choice.message.content.trim();
    
    if (enhancedText.length === 0) {
      throw new Error('Enhanced text is empty');
    }

    return enhancedText;

  } catch (error) {
    // Re-throw with more context if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to Groq API. ${error.message}`);
    }
    
    // Re-throw other errors as-is
    throw error;
  }
};

/**
 * Test the Groq API connection
 * @param {string} apiKey - The Groq API key to test
 * @returns {Promise<boolean>} - True if the connection is successful
 */
export const testGroqConnection = async (apiKey) => {
  try {
    await enhanceTextWithGroq('This is a test message.', apiKey);
    return true;
  } catch (error) {
    console.error('Groq connection test failed:', error);
    return false;
  }
};

/**
 * Get available models from Groq API
 * @param {string} apiKey - The Groq API key
 * @returns {Promise<Array>} - Array of available models
 */
export const getAvailableModels = async (apiKey) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};