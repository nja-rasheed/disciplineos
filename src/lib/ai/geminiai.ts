import { NextResponse } from 'next/server';

/**
 * Defines the structure of the JSON we expect from the AI.
 */
type AiFeedback = {
  mood: string;
  experience: string; // Changed back from summary
  insights: string;   // Changed from insight
};

type GoalAiFeedback = {
  observation: string;
  suggestion: string;
};

type GoalPlanResponse = {
  suggested_steps: string[];
};

/**
 * Calls the Gemini API to analyze a journal entry.
 * This function is designed to be called ONLY from the server (e.g., an API route).
 */
export async function getFeedback(journalEntry: string): Promise<AiFeedback> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Gemini API key is not set in environment variables.');
    throw new Error('AI service is not configured.');
  }

  // Use the gemini-2.5-flash-preview-09-2025 model for JSON output
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `Analyze the following journal entry. Respond ONLY with a valid JSON object.
- mood: A single word for the emotional tone (e.g., "Positive", "Stressed", "Neutral").
- experience: A one-sentence summary of what happened.
- insights: A short (1-2 sentence) motivational insight or a simple actionable plan for tomorrow based on the entry.

Journal Entry:
${journalEntry}
`,
          },
        ],
      },
    ],
    // We enforce the JSON output using the new generationConfig
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          mood: { type: 'STRING' },
          experience: { type: 'STRING' }, // Changed back
          insights: { type: 'STRING' },   // Changed
        },
        required: ['mood', 'experience', 'insights'], // Changed
      },
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Response:', errorBody);
      throw new Error(`Gemini API request failed: ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();

    // --- ADD THIS CHECK ---
    // If the entire result is empty, throw an error.
    if (!result) {
      throw new Error('Empty response from Gemini API.');
    }
    // --- END ADDED CHECK ---

    // Extract the JSON text and parse it
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
      // --- ADD THIS CHECK ---
      // This will catch { "error": ... } responses from Google
      if (result.error) {
        throw new Error(`Gemini API Error: ${result.error.message}`);
      }
      // --- END ADDED CHECK ---
      throw new Error('Invalid response structure from Gemini API. No candidates found.');
    }
    
    // The API (with responseSchema) guarantees this is valid JSON
    return JSON.parse(jsonText) as AiFeedback;

  } catch (error) {
    console.error('Error in getFeedback:', (error as Error).message);
    // Re-throw the error so the API route can catch it
    throw error;
  }
}


export async function getGoalFeedback(analyticsData: string): Promise<GoalAiFeedback> {
  const apiKey = process.env.GEMINI_API_KEY; // Use GEMINI_API_KEY to match the other function
  if (!apiKey) {
    console.error('Gemini API key is not set in environment variables.');
    throw new Error('AI service is not configured.');
  }

  // Use the gemini-2.5-flash-preview-09-2025 model for JSON output
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [
      {
        parts: [
          {
            text: `You are a productivity coach for an app called "DisciplineOS".
    Analyze the following user data, which shows time spent vs. goal progress for their main life categories.
    Respond ONLY with a valid JSON object.

    - "observation": Write a 1-2 sentence analysis of the data. Find the biggest insight (e.g., "Your 'Study' time is highly effective, but your 'Work' time is not translating into progress.")
    - "suggestion": Write a 1-2 sentence, simple, actionable suggestion for the user (e.g., "Try breaking down your 'Work' goals into smaller sub-tasks to get unstuck.")

    User Data:
    ${analyticsData}
    `,
          },
        ],
      },
    ],
    // We enforce the JSON output
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          observation: { type: 'STRING' },
          suggestion: { type: 'STRING' },
        },
        required: ['observation', 'suggestion'],
      },
    },
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Response:', errorBody);
      throw new Error(`Gemini API request failed: ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();

    if (!result) {
      throw new Error('Empty response from Gemini API.');
    }

    // Extract the JSON text and parse it
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
      if (result.error) {
        throw new Error(`Gemini API Error: ${result.error.message}`);
      }
      throw new Error('Invalid response structure from Gemini API. No candidates found.');
    }
    
    // The API (with responseSchema) guarantees this is valid JSON
    // Use the new, correct type here
    return JSON.parse(jsonText) as GoalAiFeedback;

  } catch (error) {
    console.error('Error in getGoalFeedback:', (error as Error).message);
    // Re-throw the error so the API route can catch it
    throw error;
  }
}

export async function getGoalPlan(goalDataString: string): Promise<GoalPlanResponse> {
  const apiKey = process.env.GEMINI_API_KEY; // Use GEMINI_API_KEY to match the other function
  if (!apiKey) {
    console.error('Gemini API key is not set in environment variables.');
    throw new Error('AI service is not configured.');
  }

  // Use the gemini-2.5-flash-preview-09-2025 model for JSON output
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
      contents: [
        {
          parts: [
            {
              text: `You are a productivity coach for "DisciplineOS".
    A user needs a plan for their goal. Analyze their goal, what they've completed, and what's left to do.
    Respond ONLY with a valid JSON object.

    - "suggested_steps": An array of 3-5 simple, actionable sub-tasks to help them make progress.

    User's Goal Data:
    ${goalDataString}
    `,
            },
          ],
        },
      ],
      // We enforce the JSON output
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            suggested_steps: {
              type: 'ARRAY',
              items: { type: 'STRING' }
            },
          },
          required: ['suggested_steps'],
        },
      },
    };
    try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error Response:', errorBody);
      throw new Error(`Gemini API request failed: ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();

    if (!result) {
      throw new Error('Empty response from Gemini API.');
    }

    // Extract the JSON text and parse it
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!jsonText) {
      if (result.error) {
        throw new Error(`Gemini API Error: ${result.error.message}`);
      }
      throw new Error('Invalid response structure from Gemini API. No candidates found.');
    }
    
    // The API (with responseSchema) guarantees this is valid JSON
    // Use the new, correct type here
    return JSON.parse(jsonText) as GoalPlanResponse;

  } catch (error) {
    console.error('Error in getGoalPlan:', (error as Error).message);
    // Re-throw the error so the API route can catch it
    throw error;
  }
}


