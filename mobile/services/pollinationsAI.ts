/**
 * Plainly AI - Image & Video Generation Service (Mobile)
 * Secure mode: uses server-side proxy endpoints so provider keys never ship in app binaries.
 */

const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || 'https://plainly.live').replace(/\/$/, '');
const IMAGE_PROXY_URL = `${API_BASE_URL}/api/ai/pollinations/image`;
const VIDEO_PROXY_URL = `${API_BASE_URL}/api/ai/pollinations/video`;

// Kept exported for compatibility with existing imports/UI assumptions.
export const IMAGE_MODELS = [
  'flux',
  'turbo',
  'seedream',
  'gptimage',
  'klein',
  'seedream-pro',
  'gptimage-large',
  'klein-large',
  'nanobanana',
  'nanobanana-pro',
  'zimage',
  'kontext',
];

export const VIDEO_MODELS = ['wan', 'seedance', 'seedance-pro', 'veo'];

export interface ImageOptions {
  width?: number;
  height?: number;
  seed?: number;
}

const IMAGE_TIMEOUT = 90000;
const VIDEO_TIMEOUT = 300000;

function buildImageProxyUrl(prompt: string, options: ImageOptions = {}): string {
  const width = options.width ?? 1024;
  const height = options.height ?? 1024;
  const seed = options.seed ?? Math.floor(Math.random() * 1000000);
  const params = new URLSearchParams({
    prompt,
    width: String(width),
    height: String(height),
    seed: String(seed),
  });
  return `${IMAGE_PROXY_URL}?${params.toString()}`;
}

function buildVideoProxyUrl(prompt: string): string {
  const params = new URLSearchParams({ prompt });
  return `${VIDEO_PROXY_URL}?${params.toString()}`;
}

async function validateProxyAsset(url: string, timeoutMs: number, expectedPrefix: 'image/' | 'video/'): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let message = `Generation failed (${response.status})`;
      try {
        const data = await response.json();
        message = data?.error || message;
      } catch {
        // ignore JSON parse failure
      }
      throw new Error(message);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith(expectedPrefix)) {
      throw new Error(`Invalid response type (${contentType || 'unknown'})`);
    }
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

export async function generateImage(prompt: string, options: ImageOptions = {}): Promise<string> {
  const proxyUrl = buildImageProxyUrl(prompt, options);
  await validateProxyAsset(proxyUrl, IMAGE_TIMEOUT, 'image/');
  return proxyUrl;
}

export async function generateVideo(prompt: string): Promise<string> {
  const proxyUrl = buildVideoProxyUrl(prompt);
  await validateProxyAsset(proxyUrl, VIDEO_TIMEOUT, 'video/');
  return proxyUrl;
}

export function isConfigured() {
  return true;
}

export function hasApiKey() {
  return true;
}

export default {
  generateImage,
  generateVideo,
  isConfigured,
  hasApiKey,
  IMAGE_MODELS,
  VIDEO_MODELS,
};
