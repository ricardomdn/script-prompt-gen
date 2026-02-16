export interface SceneSegment {
  id: string;
  originalText: string;
  visualPrompt: string;
  isHook: boolean;
}

export interface ScriptContext {
  detected_city: string;
  detected_era: string;
  visual_style_guide: string;
}

export interface ScriptAnalysisResponse {
  context: ScriptContext;
  scenes: {
    text: string;
    visual_prompt: string;
  }[];
}

export enum AppState {
  INPUT_SCRIPT = 'INPUT_SCRIPT',
  ANALYZING = 'ANALYZING',
  REVIEW_SCENES = 'REVIEW_SCENES',
}
