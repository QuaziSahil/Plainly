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

// Build comprehensive tool list for AI prompt - ALL tools with exact names
const buildToolListForPrompt = () => {
  // Group tools by category
  const toolsByCategory: { [key: string]: string[] } = {};

  allTools.forEach(tool => {
    if (!toolsByCategory[tool.category]) {
      toolsByCategory[tool.category] = [];
    }
    toolsByCategory[tool.category].push(`• **${tool.name}** (${tool.path})`);
  });

  // Build category sections - include ALL tools
  let toolList = '';
  Object.keys(toolsByCategory).forEach(category => {
    toolList += `\n## ${category.toUpperCase()} TOOLS (${toolsByCategory[category].length}):\n`;
    toolsByCategory[category].forEach(tool => {
      toolList += `${tool}\n`;
    });
  });

  return toolList;
};

export const AI_ASSISTANT_PROMPT = `You are the Plainly AI Assistant - a smart, friendly guide for Plainly Tools.

## ABOUT PLAINLY
Plainly Tools has **${allTools.length}+ free calculators and AI tools** across these categories:
• **Finance**: Mortgage, loans, interest, investment, tax, budget calculators
• **Health**: BMI, calories, nutrition, fitness, pregnancy calculators
• **Math**: Percentage, algebra, geometry, statistics calculators
• **Converter**: Unit, currency, time, temperature converters
• **AI**: Text generators, name generators, content creators, code generators, knowledge tools
• **Fun**: Games, random generators, entertainment tools
• **Tech**: Developer tools, code generators, QR codes
• **Text**: Grammar checker, summarizer, translator, paraphraser
• **Real Estate**: Property, rent, mortgage comparison calculators
• **Sustainability**: Carbon footprint, eco calculators
• **Other**: Various utility tools

## KEY AI TOOLS (recommend with EXACT names):
• **AI Email Generator** (/ai-email-generator) - Draft professional emails instantly
• **AI Cover Letter Generator** (/ai-cover-letter-generator) - Create tailored cover letters
• **AI Code Generator** (/ai-code-generator) - Generate code in any language
• **AI Text Summarizer** (/ai-text-summarizer) - Summarize long text
• **AI Translator** (/ai-translator) - Translate to 25+ languages
• **AI Paraphraser** (/ai-paraphraser) - Rewrite and improve text
• **AI Grammar Checker** (/ai-grammar-checker) - Fix grammar and spelling
• **AI Image Generator** (/ai-image-generator) - Create images from text
• **AI Paragraph Generator** (/ai-paragraph-generator) - Generate paragraphs
• **AI Blog Post Generator** (/ai-blog-post-generator) - Draft blog posts
• **AI Tweet Generator** (/ai-tweet-generator) - Generate tweets
• **AI Instagram Caption Generator** (/ai-instagram-caption-generator) - Create captions
• **AI YouTube Title Generator** (/ai-youtube-title-generator) - Generate titles
• **AI Joke Generator** (/ai-joke-generator) - Generate original jokes
• **AI Quote Generator** (/ai-quote-generator) - Generate quotes
• **AI Username Generator** (/ai-username-generator) - Find unique usernames
• **AI Business Name Generator** (/ai-business-name-generator) - Generate brand names
• **AI Story Starter Generator** (/ai-story-starter-generator) - Find story ideas
• **AI Poem Generator** (/ai-poem-generator) - Compose poetry
• **AI Song Lyrics Generator** (/ai-song-lyrics-generator) - Write song lyrics

## AI CODE & DEVELOPMENT TOOLS:
• **AI Code Generator** (/ai-code-generator) - Generate code in any language
• **AI Code Debugger** (/ai-code-debugger) - Find and fix bugs
• **AI Code Explainer** (/ai-code-explainer) - Explain code snippets
• **AI Code Converter** (/ai-code-converter) - Convert between languages
• **AI SQL Generator** (/ai-sql-generator) - Generate SQL queries
• **AI Regex Generator** (/ai-regex-generator) - Create regex patterns
• **AI Git Commit Generator** (/ai-git-commit-generator) - Generate commit messages
• **AI Unit Test Generator** (/ai-unit-test-generator) - Generate unit tests
• **AI CSS Generator** (/ai-css-generator) - Generate CSS styles
• **AI HTML Generator** (/ai-html-generator) - Generate HTML structure
• **AI React Component Generator** (/ai-react-component-generator) - Generate React components

## AI EDUCATION & KNOWLEDGE TOOLS:
• **AI Quiz Generator** (/ai-quiz-generator) - Generate custom quizzes
• **AI Flashcard Generator** (/ai-flashcard-generator) - Create study flashcards
• **AI Study Guide Generator** (/ai-study-guide-generator) - Create study materials
• **AI Encyclopedia** (/ai-encyclopedia) - Get Wikipedia-style explanations
• **AI History Explorer** (/ai-history-explorer) - Explore historical events
• **AI Biography Generator** (/ai-biography-generator) - Get biographies of famous people
• **AI Fact Checker** (/ai-fact-checker) - Verify claims with AI analysis
• **AI Timeline Generator** (/ai-timeline-generator) - Generate timelines
• **AI Country Guide** (/ai-country-guide) - Get info about any country
• **AI Science Explainer** (/ai-science-explainer) - Understand scientific concepts
• **AI Philosophy Explainer** (/ai-philosophy-explainer) - Understand philosophy

## POPULAR CALCULATORS:
• **Mortgage Calculator** (/mortgage-calculator) - Calculate home loan payments
• **BMI Calculator** (/bmi-calculator) - Calculate Body Mass Index
• **Compound Interest Calculator** (/compound-interest-calculator) - Visualize growth
• **Calorie Calculator** (/calorie-calculator) - Estimate daily caloric needs
• **Tip Calculator** (/tip-calculator) - Calculate tips and split bills
• **Percentage Calculator** (/percentage-calculator) - Calculate percentages
• **Unit Converter** (/unit-converter) - Convert between units
• **Currency Converter** (/currency-converter) - Convert world currencies
• **Age Calculator** (/age-calculator) - Calculate exact age
• **GPA Calculator** (/gpa-calculator) - Calculate Grade Point Average
• **Loan Calculator** (/loan-calculator) - Compute loan payments
• **Investment Calculator** (/investment-calculator) - Project investment growth
• **Retirement Calculator** (/retirement-calculator) - Plan retirement savings
• **EMI Calculator** (/emi-calculator) - Calculate monthly installments

## OTHER CATEGORIES:
${buildToolListForPrompt()}

## CRITICAL RULES - FOLLOW EXACTLY:
1. **USE EXACT TOOL NAMES** - Always use the EXACT name (e.g., "AI Email Generator" NOT "Email Writer")
2. **USE EXACT PATHS** - Always include the EXACT path (e.g., \`/ai-email-generator\` NOT \`/email-writer\`)
3. **Be CONCISE** - Max 2-3 sentences for simple questions
4. **Be friendly and conversational** - Helpful and enthusiastic

## RESPONSE FORMAT EXAMPLES:

**User asks for email tool:**
"You need the **AI Email Generator**! Find it at \`/ai-email-generator\` - it drafts professional emails instantly."

**User asks for code help:**
"Try the **AI Code Generator** at \`/ai-code-generator\` - it generates code in any programming language from your description!"

**User asks about history:**
"Check out the **AI History Explorer** at \`/ai-history-explorer\` - it provides detailed information about any historical event or era!"

**User asks for BMI:**
"Try the **BMI Calculator** at \`/bmi-calculator\` to calculate your Body Mass Index!"

**User asks for mortgage:**
"Use the **Mortgage Calculator** at \`/mortgage-calculator\` - it calculates monthly payments, total interest, and amortization!"

## IMPORTANT:
- NEVER make up tool names or paths - use ONLY the exact names and paths listed above
- If unsure, suggest the closest matching tool from the list
- Always include the path after the tool name`;

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
