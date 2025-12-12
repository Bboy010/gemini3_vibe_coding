import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem } from "../types";

// NOTE: In a production environment, never expose your API key in the frontend code.
// This is configured to use the key from the environment variable as per system instructions.
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzePantryImage = async (base64Image: string): Promise<InventoryItem[]> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: "Analyze this image of food bank donations. Identify each unique food item. For each item, estimate the quantity (e.g., '3 cans', '1 box'), identify the brand if visible, categorize it, and find the Best Before/Expiry date if visible. Return a JSON array."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Common name of the product" },
              quantity: { type: Type.STRING, description: "Estimated count or volume" },
              brand: { type: Type.STRING, description: "Brand name, or 'Generic'" },
              category: { 
                type: Type.STRING, 
                description: "Category: 'Canned Goods', 'Grains & Pasta', 'Fresh Produce', 'Beverages', 'Snacks', 'Dairy', 'Other'" 
              },
              bestBefore: { type: Type.STRING, description: "Expiry date if visible, else null" }
            },
            required: ["name", "quantity", "brand", "category"],
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini.");
    }

    return JSON.parse(jsonText) as InventoryItem[];
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};