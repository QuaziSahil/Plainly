const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const MODELS = {
  primary: 'llama-3.1-8b-instant',
  secondary: 'allam-2-7b',
  tertiary: 'moonshotai/kimi-k2-instruct',
  versatile: 'llama-3.3-70b-versatile',
  scout: 'meta-llama/llama-4-scout-17b-16e-instruct',
  creative: 'meta-llama/llama-4-maverick-17b-128e-instruct',
  search: 'groq/compound',
  searchMini: 'groq/compound-mini',
};

const FALLBACK_CHAIN = [
  MODELS.primary,
  MODELS.secondary,
  MODELS.tertiary,
  MODELS.versatile,
  MODELS.scout,
  MODELS.creative,
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function normalizeMessages(body) {
  if (Array.isArray(body?.messages) && body.messages.length > 0) {
    return body.messages
      .map((m) => ({
        role: m?.role,
        content: typeof m?.content === 'string' ? m.content : '',
      }))
      .filter((m) => m.role && m.content);
  }

  const prompt = typeof body?.prompt === 'string' ? body.prompt : '';
  const systemPrompt = typeof body?.systemPrompt === 'string' ? body.systemPrompt : '';
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  if (prompt) {
    messages.push({ role: 'user', content: prompt });
  }
  return messages;
}

function modelSequence(body) {
  const requestedModel = body?.options?.model;
  const useSearch = Boolean(body?.search);

  if (useSearch) {
    return [MODELS.search, MODELS.searchMini];
  }

  const sequence = [];
  if (requestedModel) {
    sequence.push(requestedModel);
  }
  for (const model of FALLBACK_CHAIN) {
    if (!sequence.includes(model)) {
      sequence.push(model);
    }
  }
  return sequence;
}

async function callGroq(env, payload) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { response, data };
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.GROQ_API_KEY) {
    return json({ error: 'Server is missing GROQ_API_KEY secret.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON request body.' }, 400);
  }

  const messages = normalizeMessages(body);
  if (!messages.length) {
    return json({ error: 'Missing prompt/messages.' }, 400);
  }

  const options = body?.options || {};
  const useSearch = Boolean(body?.search);
  const maxTokens = Number(options.maxTokens ?? 1024);
  const temperature = Number(options.temperature ?? 0.7);

  const models = modelSequence(body);
  let lastError = 'All models exhausted.';

  for (const model of models) {
    const payload = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    };

    const { response, data } = await callGroq(env, payload);
    if (response.ok) {
      const content = data?.choices?.[0]?.message?.content || '';
      return json({ content, model });
    }

    const errorMsg = data?.error?.message || `Groq API error (${response.status})`;
    const isRateLimit = response.status === 429 || /rate|limit/i.test(errorMsg);
    const isServerRetryable = response.status >= 500;
    const isContextTooLong =
      response.status === 413 ||
      /reduce the length|context|too long|maximum context|token limit/i.test(errorMsg);
    const isSearchAccessIssue =
      useSearch &&
      (response.status === 401 ||
        response.status === 403 ||
        response.status === 404 ||
        /forbidden|permission|access|not found|decommission|unavailable/i.test(errorMsg));
    const shouldTryNext = isRateLimit || isServerRetryable || isSearchAccessIssue || isContextTooLong;

    lastError = errorMsg;
    if (!shouldTryNext) {
      return json({ error: errorMsg, model }, response.status);
    }
  }

  return json({ error: lastError }, 503);
}
