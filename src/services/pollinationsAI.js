/**
 * Plainly AI - Image & Video Generation Service (Web)
 * Secure mode: calls server-side proxy endpoints so provider keys never reach the client bundle.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://plainly.live').replace(/\/$/, '');
const IMAGE_PROXY_URL = `${API_BASE_URL}/api/ai/pollinations/image`;
const VIDEO_PROXY_URL = `${API_BASE_URL}/api/ai/pollinations/video`;

// Kept exported for compatibility with existing imports/UI assumptions.
const IMAGE_MODELS = [
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

const VIDEO_MODELS = ['wan', 'seedance', 'seedance-pro', 'veo'];

const IMAGE_TIMEOUT = 90000;
const VIDEO_TIMEOUT = 300000;

async function fetchWithTimeout(url, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

function buildImageProxyUrl(prompt, options = {}) {
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

function buildVideoProxyUrl(prompt) {
  const params = new URLSearchParams({ prompt });
  return `${VIDEO_PROXY_URL}?${params.toString()}`;
}

export async function generateImage(prompt, options = {}) {
  const proxyUrl = buildImageProxyUrl(prompt, options);
  const response = await fetchWithTimeout(proxyUrl, IMAGE_TIMEOUT);

  if (!response.ok) {
    let message = `Image generation failed (${response.status})`;
    try {
      const data = await response.json();
      message = data?.error || message;
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Not an image response (${contentType || 'unknown'})`);
  }

  const blob = await response.blob();
  if (blob.size < 10000) {
    throw new Error(`Image response too small (${blob.size} bytes)`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateVideo(prompt, _options = {}) {
  const proxyUrl = buildVideoProxyUrl(prompt);
  const response = await fetchWithTimeout(proxyUrl, VIDEO_TIMEOUT);

  if (!response.ok) {
    let message = `Video generation failed (${response.status})`;
    try {
      const data = await response.json();
      message = data?.error || message;
    } catch {
      // ignore JSON parse failure
    }
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('video/')) {
    throw new Error(`Not a video response (${contentType || 'unknown'})`);
  }

  const blob = await response.blob();
  if (blob.size < 50000) {
    throw new Error(`Video response too small (${blob.size} bytes)`);
  }

  return URL.createObjectURL(blob);
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
