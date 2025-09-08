import { GoogleGenAI, Type } from "@google/genai";
import { FishInfo } from '../types';
import { FISH_IDENTIFICATION_PROMPT } from "../prompts";

// FIX: Per coding guidelines, API key must be retrieved from process.env.API_KEY. This also resolves the original TypeScript error.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // FIX: Updated error message to align with using API_KEY.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fishInfoSchema = {
  type: Type.OBJECT,
  properties: {
    species: {
      type: Type.STRING,
      description: "The common name of the fish species.",
    },
    description: {
      type: Type.STRING,
      description: "A brief, interesting paragraph about the fish, including its characteristics.",
    },
    habitat: {
      type: Type.STRING,
      description: "The typical habitat where this fish is found (e.g., saltwater reefs, freshwater rivers).",
    },
    isEdible: {
      type: Type.BOOLEAN,
      description: "A boolean indicating if the fish is commonly considered edible.",
    },
    estimatedSize: {
        type: Type.STRING,
        description: "An estimated size (length) of the fish based on visual context in the image, as a string range (e.g., 'Approx. 30-35 cm'). If not possible, should be 'Cannot be estimated'.",
    },
    estimatedWeight: {
        type: Type.STRING,
        description: "An estimated weight of the fish based on visual context and species type, as a string range (e.g., 'Approx. 1.0-1.2 kg'). If not possible, should be 'Cannot be estimated'.",
    },
    error: {
        type: Type.STRING,
        description: "If the image does not contain a fish or is unidentifiable, provide a user-friendly error message here. Otherwise, this should be null or omitted.",
    }
  },
  // FIX: Removed 'required' field to allow the model to correctly return an error object without violating the schema.
};

export const identifyFish = async (base64Image: string, mimeType: string): Promise<FishInfo> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // FIX: Corrected 'contents' structure to align with the recommended format for multipart requests in the coding guidelines.
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: FISH_IDENTIFICATION_PROMPT,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: fishInfoSchema,
      },
    });

    const jsonText = response.text.trim();
    const fishData = JSON.parse(jsonText) as FishInfo;
    
    if (fishData.error) {
        throw new Error(fishData.error);
    }

    return fishData;
  } catch (error) {
    console.error("Error identifying fish:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to identify fish: ${error.message}`);
    }
    throw new Error("An unknown error occurred during fish identification.");
  }
};
