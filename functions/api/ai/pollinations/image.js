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

import {
  buildCorsHeaders,
  checkRateLimit,
  enforceAllowedOrigin,
  handleCorsOptions,
} from '../../../_shared/security.js';

function withCorsHeaders(headers = {}) {
  // Deprecated in favor of buildCorsHeaders() usage below.
  return headers;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: withCorsHeaders({ 'Content-Type': 'application/json' }),
  });
}

function buildPollinationsUrl(prompt, model, width, height, seed, apiKey) {
  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(seed),
    nologo: 'true',
    model,
  });
  if (apiKey) {
    params.append('key', apiKey);
  }
  return `https://gen.pollinations.ai/image/${encodedPrompt}?${params.toString()}`;
}

export async function onRequestOptions(context) {
  return handleCorsOptions(context.request, context.env, 'GET, OPTIONS');
}

export async function onRequestGet(context) {
  const { request, env } = context;

  const originError = enforceAllowedOrigin(request, env);
  if (originError) {
    return new Response(JSON.stringify({ error: originError }), {
      status: 403,
      headers: buildCorsHeaders(request, env, 'GET, OPTIONS', { 'Content-Type': 'application/json' }),
    });
  }

  const rateLimitMax = Number(env.IMAGE_RATE_LIMIT_MAX || 30);
  const rateLimitWindowMs = Number(env.IMAGE_RATE_LIMIT_WINDOW_MS || 60_000);
  const rate = checkRateLimit(request, 'image', rateLimitMax, rateLimitWindowMs);
  if (!rate.allowed) {
    return new Response(JSON.stringify({ error: 'Too many image requests. Please try again shortly.' }), {
      status: 429,
      headers: buildCorsHeaders(request, env, 'GET, OPTIONS', {
        'Content-Type': 'application/json',
        'Retry-After': String(rate.retryAfter),
      }),
    });
  }

  const url = new URL(request.url);
  const prompt = (url.searchParams.get('prompt') || '').trim();
  const width = Number(url.searchParams.get('width') || 1024);
  const height = Number(url.searchParams.get('height') || 1024);
  const seed = Number(url.searchParams.get('seed') || Math.floor(Math.random() * 1000000));

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Missing prompt query param.' }), {
      status: 400,
      headers: buildCorsHeaders(request, env, 'GET, OPTIONS', { 'Content-Type': 'application/json' }),
    });
  }

  const errors = [];
  const apiKey = env.POLLINATIONS_API_KEY || '';

  for (const model of IMAGE_MODELS) {
    try {
      const sourceUrl = buildPollinationsUrl(prompt, model, width, height, seed, apiKey);
      const upstream = await fetch(sourceUrl);

      if (!upstream.ok) {
        errors.push(`${model}: HTTP ${upstream.status}`);
        continue;
      }

      const contentType = upstream.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) {
        errors.push(`${model}: Invalid content type ${contentType}`);
        continue;
      }

      return new Response(upstream.body, {
        status: 200,
        headers: buildCorsHeaders(request, env, 'GET, OPTIONS', {
          'Content-Type': contentType,
          'Cache-Control': 'no-store',
          'X-Plainly-Model': model,
        }),
      });
    } catch (error) {
      errors.push(`${model}: ${error?.message || 'request failed'}`);
    }
  }

  return new Response(JSON.stringify({ error: 'All image models failed.', details: errors }), {
    status: 503,
    headers: buildCorsHeaders(request, env, 'GET, OPTIONS', { 'Content-Type': 'application/json' }),
  });
}
