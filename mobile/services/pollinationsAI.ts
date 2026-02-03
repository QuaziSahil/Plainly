/**
 * Plainly AI - Image Generation Service (Mobile)
 * Powered by Pollinations.AI with automatic model fallback
 * Updated Feb 2026: Using gen.pollinations.ai unified API
 */

const POLLINATIONS_API_KEY = process.env.EXPO_PUBLIC_POLLINATIONS_API_KEY;

// Image models ranked from BEST to WORST quality
// User has unlimited access to all models
export const IMAGE_MODELS = [
  'flux',           // Flux Schnell - most reliable
  'turbo',          // SDXL Turbo - fast and reliable  
  'seedream',       // Seedream 4.0 - artistic
  'gptimage',       // GPT Image 1 Mini
  'klein',          // FLUX.2 Klein 4B
  'seedream-pro',   // Seedream 4.5 Pro - premium
  'gptimage-large', // GPT Image 1.5 - high quality
  'klein-large',    // FLUX.2 Klein 9B
  'nanobanana',     // NanoBanana - experimental
];

export interface ImageOptions {
  width?: number;
  height?: number;
  seed?: number;
}

// Timeout for image generation
const IMAGE_TIMEOUT = 90000; // 90 seconds

/**
 * Generate image using gen.pollinations.ai unified endpoint
 */
export async function generateImage(prompt: string, options: ImageOptions = {}): Promise<string> {
  const {
    width = 1024,
    height = 1024,
    seed = Math.floor(Math.random() * 1000000),
  } = options;

  const encodedPrompt = encodeURIComponent(prompt);
  const errors: string[] = [];

  console.log('🎨 Mobile Image Generation Started');
  console.log('API Key present:', !!POLLINATIONS_API_KEY);

  // Try each model in order
  for (let i = 0; i < IMAGE_MODELS.length; i++) {
    const model = IMAGE_MODELS[i];

    try {
      console.log(`🎨 Trying: ${model} (${i + 1}/${IMAGE_MODELS.length})`);

      // Build URL with gen.pollinations.ai unified endpoint
      const params = new URLSearchParams({
        width: width.toString(),
        height: height.toString(),
        seed: seed.toString(),
        nologo: 'true',
        model: model,
      });

      if (POLLINATIONS_API_KEY) {
        params.append('key', POLLINATIONS_API_KEY);
      }

      const imageUrl = `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), IMAGE_TIMEOUT);

      const response = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(`❌ ${model}: HTTP ${response.status}`);
        errors.push(`${model}: HTTP ${response.status}`);
        continue;
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.startsWith('image/')) {
        console.log(`✅ SUCCESS: ${model}`);
        return imageUrl;
      }

      errors.push(`${model}: Not an image`);
    } catch (error: any) {
      const errMsg = error?.message || 'Unknown error';
      console.log(`❌ ${model}: ${errMsg}`);
      errors.push(`${model}: ${errMsg}`);
      continue;
    }
  }

  console.error('🚨 All models failed:', errors);
  throw new Error('Image service is temporarily unavailable. Please try again in a few minutes.');
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
