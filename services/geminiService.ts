
import { GoogleGenAI } from "@google/genai";

// Initialize with process.env.API_KEY directly as per SDK requirements
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMusicAdvice = async (userQuery: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional music consultant for a composer's digital store. 
      The store sells sheet music and MIDI. 
      Context of current catalog: ${context}.
      User asks: ${userQuery}.
      Provide a helpful, artistic, and encouraging response under 100 words.`,
    });
    // response.text is a getter property, not a method
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my musical database right now, but I'd love to help you find the right score soon!";
  }
};
