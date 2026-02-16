import { GoogleGenAI, Type } from "@google/genai";
import { ScriptAnalysisResponse } from "../types";

// Helper to get the AI client. 
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeScriptAndGeneratePrompts = async (script: string): Promise<ScriptAnalysisResponse> => {
  const ai = getAiClient();
  
  const prompt = `
    You are a world-class Art Director and Cinematographer for high-budget historical productions.
    
    INPUT SCRIPT:
    "${script}"

    OBJECTIVE:
    Break this script down into scene-by-scene CINEMATIC VIDEO PROMPTS suitable for Google Veo 3 (Video Generation).
    
    STEP 1: ANALYZE CONTEXT
    - Identify the CITY, ERA, and VISUAL STYLE.
    - Focus on immersion: Textures, lighting, weather, and small storytelling details.

    STEP 2: SEGMENTATION & CLEANUP
    - **CRITICAL: IGNORE STRUCTURAL HEADERS:** The script contains markers indicating sections. You MUST ignore these lines and NOT generate prompts for them.
    - **SPECIFIC MARKERS TO IGNORE:**
      - [HOOK]
      - [INTRO DANDO INDICATIVOS CURIOSOS SOBRE O TEMA]
      - [DESENVOLVIMENTO]
      - [ESPECIALISTAS FALANDO]
      - [GATILHO DE CURIOSIDADE]
      - [FECHAMENTO/CONCLUSAO]
      - Any other line enclosed in square brackets [...].
    - **ACTION:** Only generate prompts for the actual narrative/voiceover text.

    STEP 3: PROMPT ENGINEERING (Veo 3 Optimized)
    - **Goal:** Photorealistic, Cinematic, 8k, Unreal Engine 5 render style.
    - **Structure:** [Subject/Action/Movement] + [Environment/Era Details] + [Lighting/Mood] + [Camera/Lens] + [Small Details].
    - **Motion:** Since this is for video, describe subtle motion (e.g., "slow pan," "rain falling," "smoke rising," "crowd moving").
    - **Context Awareness:** Since AI is stateless, you MUST repeat the Era and City in every prompt.
    - **Small Details:** Include specific details mentioned (e.g., "mud on boots", "cracked pavement", "steam rising").
    - **Framing:** 16:9 Cinematic Aspect Ratio.

    OUTPUT REQUIREMENTS (JSON):
    - visual_prompt: English only. Extremely descriptive. 
      - Example: "1890 London Street, wide cinematic shot. Cobblestone glistens with rain. A horse-drawn carriage passes in background with motion blur. Gas lamps casting warm orange glow against cold blue fog. Slow camera dolly forward. Hyper-realistic, 8k."
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
                visual_prompt: { type: Type.STRING, description: "Highly detailed 16:9 video prompt." }
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