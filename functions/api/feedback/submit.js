import {
  buildCorsHeaders,
  checkRateLimit,
  enforceAllowedOrigin,
  handleCorsOptions,
} from '../../_shared/security.js';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

function cleanText(value, maxLen = 2000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function json(request, env, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: buildCorsHeaders(request, env, 'POST, OPTIONS', {
      'Content-Type': 'application/json',
    }),
  });
}

function buildToolRequestPayload(body, accessKey) {
  const toolName = cleanText(body.toolName, 120) || 'Not specified';
  const description = cleanText(body.description, 5000);
  const category = cleanText(body.category, 80) || 'other';
  const email = cleanText(body.email, 160) || 'Not provided';
  const pageUrl = cleanText(body.pageUrl, 400) || 'Unknown';

  if (!description) {
    return { error: 'Description is required.' };
  }

  return {
    payload: {
      access_key: accessKey,
      subject: `Tool Suggestion: ${toolName}`,
      from_name: 'Plainly Tool Suggestion',
      tool_name: toolName,
      description,
      suggested_category: category,
      submitter_email: email,
      page_url: pageUrl,
      timestamp: new Date().toISOString(),
    },
  };
}

function buildBugReportPayload(body, accessKey) {
  const calculator = cleanText(body.calculatorName, 160) || 'Unknown';
  const calculatorUrl = cleanText(body.calculatorUrl, 400) || 'Unknown';
  const issueType = cleanText(body.issueType, 60) || 'bug';
  const description = cleanText(body.description, 5000);
  const expectedBehavior = cleanText(body.expectedBehavior, 2000);
  const steps = cleanText(body.steps, 3000);
  const email = cleanText(body.email, 160) || 'Not provided';
  const browser = cleanText(body.browser, 500) || 'Unknown';

  if (!description) {
    return { error: 'Description is required.' };
  }

  return {
    payload: {
      access_key: accessKey,
      subject: `Bug Report: ${calculator}`,
      from_name: 'Plainly Bug Report',
      calculator,
      calculator_url: calculatorUrl,
      issue_type: issueType,
      description,
      expected_behavior: expectedBehavior,
      steps_to_reproduce: steps,
      reporter_email: email,
      browser_info: browser,
      timestamp: new Date().toISOString(),
    },
  };
}

export async function onRequestOptions(context) {
  return handleCorsOptions(context.request, context.env, 'POST, OPTIONS');
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const originError = enforceAllowedOrigin(request, env);
  if (originError) {
    return json(request, env, { error: originError }, 403);
  }

  const rateLimitMax = Number(env.FEEDBACK_RATE_LIMIT_MAX || 10);
  const rateLimitWindowMs = Number(env.FEEDBACK_RATE_LIMIT_WINDOW_MS || 60_000);
  const rate = checkRateLimit(request, 'feedback', rateLimitMax, rateLimitWindowMs);
  if (!rate.allowed) {
    return json(
      request,
      env,
      { error: 'Too many feedback requests. Please try again shortly.' },
      429
    );
  }

  const accessKey = env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return json(request, env, { error: 'Server missing WEB3FORMS_ACCESS_KEY.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(request, env, { error: 'Invalid JSON request body.' }, 400);
  }

  // Honeypot trap.
  if (cleanText(body.website, 200)) {
    return json(request, env, { ok: true });
  }

  const type = cleanText(body.type, 40);
  let built;
  if (type === 'tool_request') {
    built = buildToolRequestPayload(body, accessKey);
  } else if (type === 'bug_report') {
    built = buildBugReportPayload(body, accessKey);
  } else {
    return json(request, env, { error: 'Invalid feedback type.' }, 400);
  }

  if (built.error) {
    return json(request, env, { error: built.error }, 400);
  }

  const upstream = await fetch(WEB3FORMS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(built.payload),
  });

  let upstreamData = null;
  try {
    upstreamData = await upstream.json();
  } catch {
    upstreamData = null;
  }

  if (!upstream.ok || upstreamData?.success === false) {
    return json(request, env, { error: 'Failed to submit feedback.' }, 502);
  }

  return json(request, env, { ok: true });
}
