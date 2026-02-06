const VIDEO_MODELS = [
  'wan',
  'seedance',
  'seedance-pro',
  'veo',
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

function buildPollinationsVideoUrl(prompt, model, apiKey) {
  const encodedPrompt = encodeURIComponent(prompt);
  const params = new URLSearchParams({
    model,
    nologo: 'true',
  });
  if (apiKey) {
    params.append('key', apiKey);
  }
  return `https://gen.pollinations.ai/video/${encodedPrompt}?${params.toString()}`;
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

  const rateLimitMax = Number(env.VIDEO_RATE_LIMIT_MAX || 10);
  const rateLimitWindowMs = Number(env.VIDEO_RATE_LIMIT_WINDOW_MS || 60_000);
  const rate = checkRateLimit(request, 'video', rateLimitMax, rateLimitWindowMs);
  if (!rate.allowed) {
    return new Response(JSON.stringify({ error: 'Too many video requests. Please try again shortly.' }), {
      status: 429,
      headers: buildCorsHeaders(request, env, 'GET, OPTIONS', {
        'Content-Type': 'application/json',
        'Retry-After': String(rate.retryAfter),
      }),
    });
  }

  const url = new URL(request.url);
  const prompt = (url.searchParams.get('prompt') || '').trim();

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Missing prompt query param.' }), {
      status: 400,
      headers: buildCorsHeaders(request, env, 'GET, OPTIONS', { 'Content-Type': 'application/json' }),
    });
  }

  const errors = [];
  const apiKey = env.POLLINATIONS_API_KEY || '';

  for (const model of VIDEO_MODELS) {
    try {
      const sourceUrl = buildPollinationsVideoUrl(prompt, model, apiKey);
      const upstream = await fetch(sourceUrl);

      if (!upstream.ok) {
        errors.push(`${model}: HTTP ${upstream.status}`);
        continue;
      }

      const contentType = upstream.headers.get('content-type') || '';
      if (!contentType.startsWith('video/')) {
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

  return new Response(JSON.stringify({ error: 'All video models failed.', details: errors }), {
    status: 503,
    headers: buildCorsHeaders(request, env, 'GET, OPTIONS', { 'Content-Type': 'application/json' }),
  });
}
