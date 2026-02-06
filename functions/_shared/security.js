const DEFAULT_ALLOWED_ORIGINS = [
  'https://plainly.live',
  'https://www.plainly.live',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

function parseList(value) {
  if (!value || typeof value !== 'string') {
    return [];
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getAllowedOrigins(env) {
  const configured = parseList(env?.ALLOWED_ORIGINS);
  if (configured.length > 0) {
    return configured;
  }
  return DEFAULT_ALLOWED_ORIGINS;
}

export function getRequestOrigin(request) {
  return request.headers.get('Origin') || '';
}

export function isOriginAllowed(origin, env) {
  if (!origin) {
    // Native mobile/server-to-server calls do not always include Origin.
    return true;
  }
  const allowed = getAllowedOrigins(env);
  return allowed.includes(origin);
}

export function buildCorsHeaders(request, env, methods, extraHeaders = {}) {
  const origin = getRequestOrigin(request);
  const headers = {
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
    ...extraHeaders,
  };

  if (isOriginAllowed(origin, env) && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

export function handleCorsOptions(request, env, methods) {
  const origin = getRequestOrigin(request);
  if (origin && !isOriginAllowed(origin, env)) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: buildCorsHeaders(request, env, methods),
  });
}

export function enforceAllowedOrigin(request, env) {
  const origin = getRequestOrigin(request);
  if (origin && !isOriginAllowed(origin, env)) {
    return `Origin not allowed: ${origin}`;
  }
  return null;
}

function getClientIp(request) {
  const cfIp = request.headers.get('CF-Connecting-IP');
  if (cfIp) return cfIp;

  const forwarded = request.headers.get('X-Forwarded-For');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  return 'unknown';
}

function getRateLimitStore() {
  if (!globalThis.__plainlyRateLimitStore) {
    globalThis.__plainlyRateLimitStore = new Map();
  }
  return globalThis.__plainlyRateLimitStore;
}

export function checkRateLimit(request, keyPrefix, maxRequests, windowMs) {
  const ip = getClientIp(request);
  const now = Date.now();
  const bucket = Math.floor(now / windowMs);
  const key = `${keyPrefix}:${ip}:${bucket}`;

  const store = getRateLimitStore();
  const current = store.get(key) || 0;

  // Lightweight cleanup to prevent unbounded growth.
  if (Math.random() < 0.01) {
    const currentBucketPrefix = `${keyPrefix}:${ip}:`;
    for (const existingKey of store.keys()) {
      if (existingKey.startsWith(currentBucketPrefix) && existingKey !== key) {
        store.delete(existingKey);
      }
    }
  }

  if (current >= maxRequests) {
    const retryAfter = Math.ceil(((bucket + 1) * windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }

  store.set(key, current + 1);
  return { allowed: true, retryAfter: 0 };
}
