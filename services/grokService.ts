/**
 * Service to interact with the unofficial GeminiGen.ai / Grok API
 */

const getValidDuration = (requestedDuration: number): string => {
  // Enforce 6, 10, 15 strict rules
  if (requestedDuration <= 8) return "6";
  if (requestedDuration <= 12) return "10";
  return "15";
};

export const generateGrokVideo = async (
  apiKey: string, 
  prompt: string, 
  duration: number,
  useProxy: boolean = false
): Promise<string> => {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('model', 'grok-3');
  
  // STRICT CONSTRAINT: Always 720p and 16:9 (Landscape)
  formData.append('resolution', '720p');
  formData.append('aspect_ratio', 'landscape');
  
  // FIX: Ensure duration is strictly 6, 10, or 15
  const validDuration = getValidDuration(duration);
  formData.append('duration', validDuration);
  
  formData.append('mode', 'custom');

  console.log(`[Grok API] Requesting: ${validDuration}s, 720p, Landscape. Proxy: ${useProxy}`);

  const baseUrl = 'https://api.geminigen.ai/uapi/v1/video-gen/grok';
  // Use a public CORS proxy if enabled to bypass browser CORS restrictions on localhost
  const url = useProxy ? `https://corsproxy.io/?${encodeURIComponent(baseUrl)}` : baseUrl;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey.trim(),
        'Accept': 'application/json',
        // Note: Content-Type is set automatically by fetch for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    
    // The API might return the url in different fields
    const videoUrl = data.url || data.video_url || data.link || data.output;
    
    if (!videoUrl) {
      console.error("Unexpected API response structure:", data);
      throw new Error("No video URL found in response.");
    }

    return videoUrl;
  } catch (error: any) {
    console.error("Grok Generation Failed:", error);
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("Network Error: Failed to fetch. If you are running locally, enable the 'CORS Proxy' option in Settings.");
    }
    
    throw error;
  }
};
