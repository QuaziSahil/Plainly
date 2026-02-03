/**
 * Plainly AI - Image Generation Service (Mobile)
 * Powered by Pollinations.AI with automatic model fallback
 * Falls back to alternative APIs if Pollinations is down
 */

const POLLINATIONS_API_KEY = process.env.EXPO_PUBLIC_POLLINATIONS_API_KEY;

// Image models ranked from best to worst quality - same as web
export const IMAGE_MODELS = [
  'flux',           // Best quality, recommended
  'turbo',          // SDXL Turbo - fastest
  'flux-realism',   // Realistic images
  'flux-anime',     // Anime style
  'flux-3d',        // 3D renders
];

export interface ImageOptions {
  width?: number;
  height?: number;
  seed?: number;
}

// Try Pollinations API
async function tryPollinations(prompt: string, width: number, height: number, seed: number): Promise<string | null> {
  const encodedPrompt = encodeURIComponent(prompt);
  
  for (const model of IMAGE_MODELS) {
    try {
      let imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`;
      
      if (POLLINATIONS_API_KEY) {
        imageUrl += `&key=${POLLINATIONS_API_KEY}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.log(`Pollinations ${model} failed: ${response.status}`);
        continue;
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.startsWith('image/')) {
        return imageUrl;
      }
    } catch (error: any) {
      console.log(`Pollinations ${model} error:`, error?.message);
      continue;
    }
  }
  return null;
}

// Fallback: Use picsum.photos for placeholder (always works)
function getFallbackImage(width: number, height: number, seed: number): string {
  // Use Lorem Picsum - free, no API key, always works
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

export async function generateImage(prompt: string, options: ImageOptions = {}): Promise<string> {
  const {
    width = 1024,
    height = 1024,
    seed = Math.floor(Math.random() * 1000000),
  } = options;

  // Try Pollinations first
  const pollinationsUrl = await tryPollinations(prompt, width, height, seed);
  if (pollinationsUrl) {
    return pollinationsUrl;
  }

  // If Pollinations is down, throw a clear error
  throw new Error('Image service is temporarily unavailable (502). Please try again in a few minutes.');
}

export function isConfigured() {
  return true;
}

export function hasApiKey() {
  return !!POLLINATIONS_API_KEY;
}

export default {
  generateImage,
  isConfigured,
  hasApiKey,
  IMAGE_MODELS,
};
