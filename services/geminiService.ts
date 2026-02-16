import { GoogleGenAI, Type } from "@google/genai";
import { ScriptAnalysisResponse } from "../types";

// Helper to get the AI client. 
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeScriptAndGeneratePrompts = async (script: string): Promise<ScriptAnalysisResponse> => {
  const ai = getAiClient();
  
  const prompt = `
    You are a world-class Art Director and Concept Artist for high-budget historical productions.
    
    INPUT SCRIPT:
    "${script}"

    OBJECTIVE:
    Break this script down into scene-by-scene STATIC IMAGE PROMPTS suitable for high-end AI image generators (like Midjourney v6, Flux.1, or Veo Image Mode).
    
    STEP 1: ANALYZE CONTEXT
    - Identify the CITY, ERA, and VISUAL STYLE.
    - Focus on immersion: Textures, lighting, weather, and small storytelling details.

    STEP 2: SEGMENTATION & CLEANUP
    - **IGNORE STRUCTURAL HEADERS:** The script will contain markers indicating sections, such as [HOOK], [INTRO], [DESENVOLVIMENTO], [ESPECIALISTAS FALANDO], [GATILHO DE CURIOSIDADE], [FECHAMENTO], etc.
    - **ACTION:** DO NOT generate visual prompts for these headers. They are structural metadata. Only generate prompts for the actual narrative/voiceover text associated with them.
    - **First 10 Segments:** Break the narrative content of the beginning (the Hook) into very short, punchy phrases. We need a rapid succession of images to build tension.
    - **Rest of Script:** Standard narrative segmentation.

    STEP 3: PROMPT ENGINEERING (Immersive Realism)
    - **Goal:** Photorealistic, Cinematic, 8k, Unreal Engine 5 render style.
    - **Structure:** [Subject/Action] + [Environment/Era Details] + [Lighting/Mood] + [Camera/Lens] + [Small Details].
    - **Context Awareness:** Since AI is stateless, you MUST repeat the Era and City in every prompt.
    - **Small Details:** Include specific details mentioned in the user request (e.g., "mud on boots", "cracked pavement", "steam rising from a vent", "rust on the lamppost").
    - **Framing:** 16:9 Cinematic Aspect Ratio.

    OUTPUT REQUIREMENTS (JSON):
    - visual_prompt: English only. Extremely descriptive. 
      - Example: "1890 London Street, wide cinematic shot. Cobblestone glistens with rain. A horse-drawn carriage passes in background, motion blur. Gas lamps casting warm orange glow against cold blue fog. Hyper-realistic, 8k, intricate textures."
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          context: {
            type: Type.OBJECT,
            properties: {
              detected_city: { type: Type.STRING, description: "The main city identified." },
              detected_era: { type: Type.STRING, description: "The time period identified." },
              visual_style_guide: { type: Type.STRING, description: "3-4 words describing the overall look." }
            },
            required: ["detected_city", "detected_era", "visual_style_guide"]
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING, description: "Script segment (narrative text only, no headers)." },
                visual_prompt: { type: Type.STRING, description: "Highly detailed 16:9 image prompt." }
              },
              required: ["text", "visual_prompt"]
            }
          }
        },
        required: ["context", "scenes"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate scene analysis");
  }

  return JSON.parse(response.text) as ScriptAnalysisResponse;
};