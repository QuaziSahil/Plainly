// Groq AI Service for Plainly Mobile
// Uses the same high-limit model strategy as web

// For Expo, we need to use Constants or direct env access
// API key should be set in .env as EXPO_PUBLIC_GROQ_API_KEY
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Model rate limits (from Groq console):
// llama-3.1-8b-instant:                        14,400 req/day  ← PRIMARY
// allam-2-7b:                                   7,000 req/day  ← SECONDARY
// moonshotai/kimi-k2-instruct:                  1,000 req/day  ← TERTIARY
// llama-3.3-70b-versatile:                      1,000 req/day  ← Premium quality
// meta-llama/llama-4-scout-17b-16e-instruct:    1,000 req/day  ← Scout
// meta-llama/llama-4-maverick-17b-128e-instruct: 1,000 req/day ← Creative
// Total Capacity: ~26,400 requests/day

export const MODELS = {
  primary: 'llama-3.1-8b-instant',
  secondary: 'allam-2-7b',
  tertiary: 'moonshotai/kimi-k2-instruct',
  versatile: 'llama-3.3-70b-versatile',
  scout: 'meta-llama/llama-4-scout-17b-16e-instruct',
  creative: 'meta-llama/llama-4-maverick-17b-128e-instruct',
  default: 'llama-3.1-8b-instant',
};

// Fallback chain for rate limit handling (matches website guidelines)
const FALLBACK_CHAIN = [
  MODELS.primary,    // 1st: llama-3.1-8b-instant (14,400/day)
  MODELS.secondary,  // 2nd: allam-2-7b (7,000/day)
  MODELS.tertiary,   // 3rd: kimi-k2-instruct (1,000/day)
  MODELS.versatile,  // 4th: llama-3.3-70b-versatile (1,000/day)
  MODELS.scout,      // 5th: llama-4-scout (1,000/day)
  MODELS.creative,   // 6th: llama-4-maverick (1,000/day)
];

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

// Custom error class for offline state
export class OfflineError extends Error {
  constructor(message: string = 'No internet connection. Please check your network and try again.') {
    super(message);
    this.name = 'OfflineError';
  }
}

/**
 * Check if device has internet connectivity
 */
async function checkConnectivity(): Promise<boolean> {
  try {
    // Try a quick fetch to check connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.groq.com', {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Send a message to Groq AI with automatic fallback on rate limits
 */
export async function askGroq(
  prompt: string,
  systemPrompt: string = '',
  options: ChatOptions = {}
): Promise<string> {
  const {
    model = MODELS.default,
    maxTokens = 1024,
    temperature = 0.7,
  } = options;

  const messages: Message[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const modelsToTry = [model, ...FALLBACK_CHAIN.filter(m => m !== model)];

  for (const tryModel of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: tryModel,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMsg = error.error?.message || '';

        // If rate limited, try next model
        if (response.status === 429 || errorMsg.includes('rate') || errorMsg.includes('limit')) {
          console.warn(`Rate limited on ${tryModel}, trying fallback...`);
          continue;
        }
        throw new Error(errorMsg || 'Groq API error');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error: any) {
      // Check if it's a network error
      if (error.message?.includes('Network request failed') ||
        error.message?.includes('fetch') ||
        error.name === 'TypeError') {
        throw new OfflineError();
      }

      if (tryModel === modelsToTry[modelsToTry.length - 1]) {
        throw error;
      }
      continue;
    }
  }

  throw new Error('All models exhausted');
}

/**
 * Stream a conversation with Groq AI
 */
export async function chatWithGroq(
  messages: Message[],
  options: ChatOptions = {}
): Promise<string> {
  const {
    model = MODELS.default,
    maxTokens = 2048,
    temperature = 0.7,
    systemPrompt,
  } = options;

  const allMessages: Message[] = [];

  if (systemPrompt) {
    allMessages.push({ role: 'system', content: systemPrompt });
  }
  allMessages.push(...messages);

  const modelsToTry = [model, ...FALLBACK_CHAIN.filter(m => m !== model)];

  for (const tryModel of modelsToTry) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: tryModel,
          messages: allMessages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMsg = error.error?.message || '';

        if (response.status === 429 || errorMsg.includes('rate') || errorMsg.includes('limit')) {
          console.warn(`Rate limited on ${tryModel}, trying fallback...`);
          continue;
        }
        throw new Error(errorMsg || 'Groq API error');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error: any) {
      // Check if it's a network error
      if (error.message?.includes('Network request failed') ||
        error.message?.includes('fetch') ||
        error.name === 'TypeError') {
        throw new OfflineError();
      }

      if (tryModel === modelsToTry[modelsToTry.length - 1]) {
        throw error;
      }
      continue;
    }
  }

  throw new Error('All models exhausted');
}

// AI Assistant system prompt - matches website behavior exactly
// Dynamically include all tools for comprehensive coverage
import { allTools } from '@/constants/Tools';

// Build comprehensive tool list for AI prompt
const buildToolListForPrompt = () => {
  // Group tools by category
  const toolsByCategory: { [key: string]: string[] } = {};

  allTools.forEach(tool => {
    if (!toolsByCategory[tool.category]) {
      toolsByCategory[tool.category] = [];
    }
    toolsByCategory[tool.category].push(`${tool.name} at ${tool.path}`);
  });

  // Build category sections
  let toolList = '';
  Object.keys(toolsByCategory).forEach(category => {
    toolList += `\n${category.toUpperCase()} TOOLS:\n`;
    toolsByCategory[category].slice(0, 15).forEach(tool => {
      toolList += `- ${tool}\n`;
    });
    if (toolsByCategory[category].length > 15) {
      toolList += `- ...and ${toolsByCategory[category].length - 15} more ${category} tools\n`;
    }
  });

  return toolList;
};

export const AI_ASSISTANT_PROMPT = `You are the Plainly AI Assistant - a smart, friendly guide for Plainly Tools.

ABOUT PLAINLY: ${allTools.length}+ free calculators and AI tools in Finance, Health, Math, Converter, AI, Fun, Tech, Text, Real Estate, Sustainability categories.

KEY AI TOOLS (always recommend these for AI requests):
- AI Translator at /ai-translator - Translate text to 25+ languages
- AI Text Summarizer at /ai-text-summarizer - Summarize long text
- AI Paraphraser at /ai-paraphraser - Rewrite text in different ways
- AI Email Generator at /ai-email-generator - Write professional emails
- AI Paragraph Generator at /ai-paragraph-generator - Generate paragraphs
- AI Code Generator at /ai-code-generator - Generate code in any language
- AI Image Generator at /ai-image-generator - Create images from text
- AI Grammar Checker at /ai-grammar-checker - Fix grammar errors
- AI Story Generator at /ai-story-generator - Create stories
- AI Name Generator at /ai-name-generator - Generate creative names

KEY CALCULATORS:
- BMI Calculator at /bmi-calculator
- Mortgage Calculator at /mortgage-calculator  
- Tip Calculator at /tip-calculator
- Loan Calculator at /loan-calculator
- Calorie Calculator at /calorie-calculator
- Percentage Calculator at /percentage-calculator
- Age Calculator at /age-calculator
- Compound Interest at /compound-interest-calculator
- Unit Converter at /unit-converter
- Currency Converter at /currency-converter

ALL AVAILABLE TOOLS (${allTools.length} total):
${buildToolListForPrompt()}

RESPONSE RULES:
1. Be VERY concise - 1-2 sentences max
2. Always mention the tool path like /tool-name
3. Ask a follow-up question when helpful
4. No bullet lists or long explanations
5. Be conversational and friendly
6. For translation requests, ALWAYS recommend /ai-translator
7. For any AI text task, recommend the appropriate AI tool

EXAMPLE RESPONSES:

User: "translate"
Response: "Use our AI Translator at /ai-translator - it supports 25+ languages and provides instant translations! What would you like to translate?"

User: "ai image"
Response: "Try our AI Image Generator at /ai-image-generator - describe what you want and it'll create it! What kind of image are you thinking?"

User: "calculate bmi"  
Response: "Use the BMI Calculator at /bmi-calculator - just enter your height and weight to get your Body Mass Index instantly!"

User: "paraphrase"
Response: "The AI Paraphraser at /ai-paraphraser can rewrite your text in multiple ways. Paste your text and choose a style!"

IMPORTANT: Keep responses SHORT and conversational. Always include the tool path. Ask follow-up questions.`;

// Build TOOL_DATABASE dynamically from allTools
export const TOOL_DATABASE: { [key: string]: { name: string; description: string; path: string } } = {};

// Populate TOOL_DATABASE from allTools
allTools.forEach(tool => {
  TOOL_DATABASE[tool.path] = {
    name: tool.name,
    description: tool.description,
    path: tool.path,
  };
});

// Extract tool path from AI response
export function extractToolPath(text: string): string | null {
  const pathMatch = text.match(/\/[\w-]+/);
  return pathMatch ? pathMatch[0] : null;
}

// Get tool info from path
export function getToolFromPath(path: string): { name: string; description: string; path: string } | null {
  return TOOL_DATABASE[path] || null;
}
