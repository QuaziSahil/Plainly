const VIDEO_MODELS = [
  'wan',
  'seedance',
  'seedance-pro',
  'veo',
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function withCorsHeaders(headers = {}) {
  return {
    ...headers,
    ...CORS_HEADERS,
  };
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

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const prompt = (url.searchParams.get('prompt') || '').trim();

  if (!prompt) {
    return json({ error: 'Missing prompt query param.' }, 400);
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
        headers: withCorsHeaders({
          'Content-Type': contentType,
          'Cache-Control': 'no-store',
          'X-Plainly-Model': model,
        }),
      });
    } catch (error) {
      errors.push(`${model}: ${error?.message || 'request failed'}`);
    }
  }

  return json({ error: 'All video models failed.', details: errors }, 503);
}
