
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFridgeImage = async (base64Image: string): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  const imageData = base64Image.split(',')[1] || base64Image;

  const prompt = `Analyze this photo of a fridge, pantry, or food items. 
  1. Identify all visible food ingredients.
  2. Suggest 3-5 simple and easy recipes that can be made primarily with these ingredients.
  3. For each recipe, list the ingredients used, any common pantry staples that might be missing, step-by-step instructions, difficulty level, and estimated cooking time.
  Ensure the recipes are creative but practical.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedIngredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of food items identified in the image"
          },
          suggestedRecipes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                ingredientsUsed: { type: Type.ARRAY, items: { type: Type.STRING } },
                missingIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                difficulty: { type: Type.STRING },
                cookingTime: { type: Type.STRING }
              },
              required: ["title", "ingredientsUsed", "missingIngredients", "steps", "difficulty", "cookingTime"]
            }
          }
        },
        required: ["detectedIngredients", "suggestedRecipes"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Failed to get a response from the AI.");
  }

  return JSON.parse(resultText) as AnalysisResult;
};

export const askChefQuestion = async (
  question: string, 
  context: AnalysisResult, 
  history: ChatMessage[]
): Promise<string> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are FridgeChef AI, a helpful kitchen assistant. 
  The user has these ingredients: ${context.detectedIngredients.join(", ")}.
  You previously suggested these recipes: ${context.suggestedRecipes.map(r => r.title).join(", ")}.
  Answer the user's questions about these recipes, suggest substitutions, or give general cooking advice based on what they have. 
  Keep answers concise, helpful, and friendly.`;

  const chatHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents: [
      ...chatHistory,
      { role: 'user', parts: [{ text: question }] }
    ],
    config: {
      systemInstruction
    }
  });

  return response.text || "I'm not sure how to answer that. Could you try rephrasing?";
};
