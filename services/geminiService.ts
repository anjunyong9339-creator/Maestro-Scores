
import { GoogleGenAI } from "@google/genai";

// Initialize with a fallback to avoid crash during top-level evaluation
const apiKey = process.env.API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const getMusicAdvice = async (userQuery: string, context: string) => {
  if (!apiKey) {
    return "The Maestro AI is currently off-duty as the environment key is missing. Please check your configuration.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional music consultant for a composer's digital store. 
      The store sells sheet music and MIDI. 
      Context of current catalog: ${context}.
      User asks: ${userQuery}.
      Provide a helpful, artistic, and encouraging response under 100 words.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my musical database right now, but I'd love to help you find the right score soon!";
  }
};
