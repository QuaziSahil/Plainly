// Groq AI Service for Plainly Mobile
// Uses the same high-limit model strategy as web

// Secure mode: client talks to our server proxy, not Groq directly.
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL || 'https://plainly.live').replace(/\/$/, '');
const GROQ_PROXY_URL = `${API_BASE_URL}/api/ai/groq`;

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
  search: 'groq/compound',
  searchMini: 'groq/compound-mini',
  default: 'llama-3.1-8b-instant',
};

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

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveQuiz {
  title: string;
  level: string;
  questions: QuizQuestion[];
  quickReview: string[];
}

export interface FlashcardItem {
  front: string;
  back: string;
  memoryTip: string;
}

export interface FlashcardDeck {
  title: string;
  difficulty: string;
  cards: FlashcardItem[];
  studyStrategy: string[];
}

export interface EssayCriterionScore {
  name: string;
  score: number;
  outOf: number;
  feedback: string;
}

export interface EssayGradeResult {
  overallScore: number;
  outOf: number;
  grade: string;
  summary: string;
  strengths: string[];
  improvements: string[];
  criteria: EssayCriterionScore[];
  revisedExcerpt: string;
}

export interface CitationResult {
  style: string;
  citation: string;
  inTextCitation: string;
  bibliographyEntry: string;
  notes: string[];
}

// Custom error class for offline state
export class OfflineError extends Error {
  constructor(message: string = 'No internet connection. Please check your network and try again.') {
    super(message);
    this.name = 'OfflineError';
  }
}

async function callGroqProxy(payload: {
  prompt?: string;
  systemPrompt?: string;
  messages?: Message[];
  options?: ChatOptions;
  search?: boolean;
}): Promise<string> {
  let response: Response;
  try {
    response = await fetch(GROQ_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error: any) {
    if (
      error?.message?.includes('Network request failed') ||
      error?.message?.includes('fetch') ||
      error?.name === 'TypeError'
    ) {
      throw new OfflineError();
    }
    throw error;
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid AI proxy response');
  }

  if (!response.ok) {
    throw new Error(data?.error || 'AI request failed');
  }

  return data?.content || '';
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

  return await callGroqProxy({
    prompt,
    systemPrompt,
    options: {
      model,
      maxTokens,
      temperature,
    },
    search: false,
  });
}

/**
 * Send a message using web-search-capable Groq models only.
 * Used for factual verification flows (fact-checking).
 */
async function askGroqWithWebSearch(
  prompt: string,
  systemPrompt: string = '',
  options: ChatOptions = {}
): Promise<string> {
  const {
    maxTokens = 1900,
    temperature = 0.2,
  } = options;

  return await callGroqProxy({
    prompt,
    systemPrompt,
    options: {
      maxTokens,
      temperature,
    },
    search: true,
  });
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

  return await callGroqProxy({
    messages: allMessages,
    options: {
      model,
      maxTokens,
      temperature,
    },
    search: false,
  });
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
• **AI API Doc Generator** (/ai-api-doc-generator) - Generate code documentation
• **AI Unit Test Generator** (/ai-unit-test-generator) - Generate unit tests
• **AI Code Comment Generator** (/ai-code-comment-generator) - Add comments to code
• **AI Code Review Assistant** (/ai-code-review-assistant) - Expert code review
• **AI Variable Name Generator** (/ai-variable-name-generator) - Get perfect names
• **AI CSS Generator** (/ai-css-generator) - Generate CSS styles
• **AI HTML Generator** (/ai-html-generator) - Generate HTML structure
• **AI React Component Generator** (/ai-react-component-generator) - Generate React components
• **AI REST API Designer** (/ai-rest-api-designer) - Design RESTful APIs
• **AI Database Schema Generator** (/ai-database-schema-generator) - Design database schemas
• **AI Algorithm Selector** (/ai-algorithm-selector) - Find the best algorithms
• **AI Tech Stack Recommender** (/ai-tech-stack-recommender) - Get stack recommendations
• **AI Function Name Generator** (/ai-function-name-generator) - Get perfect function names

## AI MARKETING & SEO TOOLS:
• **AI SEO Keyword Research** (/ai-seo-keyword-research) - Find high-ranking keywords
• **AI Ad Copy Generator** (/ai-ad-copy-generator) - Create high-converting ad copy
• **AI Customer Persona Generator** (/ai-customer-persona-generator) - Create buyer personas
• **AI Meme Generator** (/ai-meme-generator) - Create viral meme concepts
• **AI Thumbnail Generator** (/ai-thumbnail-generator) - Design high-CTR thumbnails
• **AI Video Generator** (/ai-video-generator) - Generate video scripts & plans
• **AI Face Generator** (/ai-face-generator) - Generate realistic AI face prompts
• **AI Logo Generator** (/ai-logo-generator) - Design professional logos
• **AI Cartoon Avatar Generator** (/ai-cartoon-avatar-generator) - Create unique avatars
• **AI Pattern Generator** (/ai-pattern-generator) - Design seamless patterns
• **AI Album Cover Generator** (/ai-album-cover-generator) - Design album artwork
• **AI Business Card Designer** (/ai-business-card-designer) - Create business card layouts
• **AI Instagram Story Template** (/ai-instagram-story-template) - Generate story templates
• **AI Infographic Generator** (/ai-infographic-generator) - Plan visual infographics
• **AI Presentation Slide Generator** (/ai-presentation-slide-generator) - Design presentation slides

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

/**
 * Generate creative titles for content (YouTube, Articles)
 */
export async function generateContentTitles(topic: string, type: string = 'YouTube', tone: string = 'viral'): Promise<string> {
  const prompt = `Generate 10 ${tone} ${type} titles for a video/article about: "${topic}"
    
Make them catchy with high click-through potential.`;

  const systemPrompt = `You are a viral content strategist. Create titles that are irresistible to click but not clickbaity.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.9,
    maxTokens: 500,
  });
}

/**
 * Generate blog post drafts using AI
 */
export async function generateBlogPost(topic: string, outline: string = '', tone: string = 'informative', length: string = 'medium'): Promise<string> {
  const prompt = `Write a ${tone} blog post about: "${topic}"
    
${outline ? `Follow this outline: ${outline}` : 'Create a structured post with introduction, key points, and conclusion.'}

Length: ${length === 'short' ? '400-600 words' : length === 'long' ? '1000-1500 words' : '700-900 words'}.`;

  const systemPrompt = `You are an expert blog writer. Write engaging, SEO-optimized, and high-quality content.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.7,
    maxTokens: 2048,
  });
}

/**
 * Generate SEO meta descriptions using AI
 */
export async function generateMetaDescription(pageTitle: string, contentSummary: string, targetKeywords: string = ''): Promise<string> {
  const prompt = `Write 3 different compelling SEO meta descriptions for:
    
Page Title: ${pageTitle}
Content: ${contentSummary}
Keywords: ${targetKeywords}

Each description must be under 160 characters and include a call to action.`;

  const systemPrompt = `You are an SEO expert. Write descriptions that improve click-through rates while staying within character limits.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.5,
    maxTokens: 500,
  });
}

/**
 * Generate social media content (LinkedIn, etc)
 */
export async function generateSocialContent(platform: string, topic: string, keywords: string, tone: string = 'engaging'): Promise<string> {
  const prompt = `Create 5 ${tone} posts for ${platform} about: "${topic}"
    
Include these keywords: ${keywords}
Include relevant hashtags.`;

  const systemPrompt = `You are a social media marketing expert. Create high-engagement content for ${platform}.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.8,
    maxTokens: 800,
  });
}

/**
 * Review text for grammar, spelling, and punctuation errors
 */
export async function checkGrammar(text: string): Promise<string> {
  const prompt = `Review the following text for grammar, spelling, and punctuation errors:
    
"${text}"`;

  const systemPrompt = `You are an expert English teacher and editor. Your goal is to provide perfectly corrected text and clear, actionable feedback.

OUTPUT FORMAT:
Provide your response in these exact sections:

### ✅ Corrected Text
[The final corrected version of the text here]

### 🔍 Key Improvements
*   **Grammar:** [Main grammar fixes]
*   **Spelling/Punctuation:** [Main spelling/punc fixes]
*   **Style/Flow:** [How the flow was improved]

### 📝 Lessons Learned
[A one-sentence expert tip on how to avoid these specific mistakes in the future]

STRICT RULES:
1. ONLY provide the sections above.
2. DO NOT apologize or mention misunderstandings.
3. DO NOT use conversational filler like "Here is your corrected text".
4. If the text is already perfect, just state "Text is already grammatically correct" in the Corrected Text section and explain why it works in the metrics.
5. Use clean Markdown formatting.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.1,
    maxTokens: 1000,
  });
}

/**
 * Perform a voice transformation analysis (Active vs Passive)
 */
export async function transformVoice(text: string, targetVoice: string = 'active'): Promise<string> {
  const prompt = `Perform a voice transformation analysis for the text below. 

TEXT: "${text}"
TARGET: ${targetVoice === 'active' ? 'Active Voice' : 'Passive Voice'}

If the text cannot be elegantly transformed (e.g., intransitive verbs), explain the closest professional alternative.`;

  const systemPrompt = `You are a professional linguistics expert. Your task is to provide a side-by-side comparative analysis of Active vs. Passive voice for the given text.

OUTPUT FORMAT:
Provide the response in these exact sections with these colors/emojis:

### 🟢 Active Voice
**[Put the Active version here - bold it]**

### 🔵 Passive Voice
**[Put the Passive version here - bold it]**

### 📊 Comparative Analysis
*   **Target:** ${targetVoice === 'active' ? 'Active (Clear & Direct)' : 'Passive (Formal & Distant)'}
*   **Subject:** [Who is performing the action?]
*   **Verb:** [The action and its tense]
*   **Key Change:** [Exactly what moved or changed between the two versions]

### 💡 Plainly AI Insight
[Provide a premium tip on which version sounds more professional for this specific sentence.]

STRICT RULES:
1. ALWAYS provide BOTH versions, even if one is provided in the input.
2. Label them exactly as "Active Voice" and "Passive Voice".
3. If a direct transformation is grammatically incorrect (like "The ground was being run at"), provide the "Natural Passive" alternative (e.g., "The ground was trodden upon") and explain.
4. NO conversational fluff or apologies.
5. Use clean, professional Markdown.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.1,
    maxTokens: 1000,
  });
}

/**
 * Expand or shorten a sentence while keeping the core meaning
 */
export async function adjustSentenceLength(text: string, target: 'expand' | 'shorten' = 'expand'): Promise<string> {
  const action = target === 'expand' ? 'Expand and elaborate on' : 'Shorten and make more concise';
  const prompt = `${action} the following text while keeping the core meaning:
    
"${text}"`;

  const systemPrompt = `You are an expert writer. ${target === 'expand' ? 'Add relevant detail and depth' : 'Remove fluff and optimize for brevity'}.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.6,
    maxTokens: 1000,
  });
}

/**
 * Create a structured essay outline
 */
export async function generateEssayOutline(topic: string, type: string = 'argumentative'): Promise<string> {
  const prompt = `Create a structured essay outline for the topic: "${topic}"
    
Essay Type: ${type}

Include:
1. Introduction (with thesis statement placeholder)
2. 3-4 Main body paragraphs with key points
3. Conclusion`;

  const systemPrompt = `You are an academic writing coach. Create logical, well-structured outlines for students.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.5,
    maxTokens: 1000,
  });
}

/**
 * Summarize meeting discussions into structured notes
 */
export async function generateMeetingNotes(transcript: string, format: string = 'standard'): Promise<string> {
  const prompt = `Summarize the following meeting discussion into structured notes:
    
"${transcript}"

Format: ${format === 'bullets' ? 'Concise bullet points' : 'Detailed sections with Actions, Decisions, and Summary'}.`;

  const systemPrompt = `You are a professional secretary. Extract key information, action items, and decisions from meeting transcripts.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.4,
    maxTokens: 1500,
  });
}

function parseJsonFromModelResponse<T>(raw: string): T | null {
  const trimmed = raw.trim();

  const candidates = [
    trimmed,
    trimmed.replace(/^```json\s*/i, '').replace(/```$/i, '').trim(),
    trimmed.replace(/^```\s*/i, '').replace(/```$/i, '').trim(),
  ];

  const objectStart = trimmed.indexOf('{');
  const objectEnd = trimmed.lastIndexOf('}');
  if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
    candidates.push(trimmed.slice(objectStart, objectEnd + 1).trim());
  }

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // Try next candidate
    }
  }

  return null;
}

function normalizeQuiz(
  parsed: any,
  fallbackTopic: string,
  fallbackLevel: string,
  requestedCount: number
): InteractiveQuiz {
  const rawQuestions = Array.isArray(parsed?.questions) ? parsed.questions : [];

  const questions: QuizQuestion[] = rawQuestions
    .map((item: any) => {
      const options = Array.isArray(item?.options)
        ? item.options.map((o: any) => String(o ?? '').trim()).filter(Boolean)
        : [];

      if (!String(item?.question ?? '').trim() || options.length < 2) return null;

      let correctIndex = Number(item?.correctIndex);
      if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
        const correctOption = String(item?.correctOption ?? item?.correctAnswer ?? '').trim().toUpperCase();
        const fromLetter = /^[A-Z]$/.test(correctOption) ? correctOption.charCodeAt(0) - 65 : -1;
        correctIndex = fromLetter >= 0 && fromLetter < options.length ? fromLetter : 0;
      }

      return {
        question: String(item.question).trim(),
        options,
        correctIndex,
        explanation: String(item?.explanation ?? 'Review this concept and try again.').trim(),
      } as QuizQuestion;
    })
    .filter((q: QuizQuestion | null): q is QuizQuestion => !!q)
    .slice(0, requestedCount);

  if (questions.length === 0) {
    throw new Error('Failed to build quiz questions');
  }

  const quickReview = Array.isArray(parsed?.quickReview)
    ? parsed.quickReview.map((item: any) => String(item ?? '').trim()).filter(Boolean)
    : [];

  return {
    title: String(parsed?.title ?? `Quiz: ${fallbackTopic}`).trim(),
    level: String(parsed?.level ?? fallbackLevel).trim(),
    questions,
    quickReview,
  };
}

function normalizeDeck(
  parsed: any,
  fallbackSubject: string,
  fallbackDifficulty: string
): FlashcardDeck {
  const rawCards = Array.isArray(parsed?.cards) ? parsed.cards : [];

  const cards: FlashcardItem[] = rawCards
    .map((item: any) => {
      const front = String(item?.front ?? '').trim();
      const back = String(item?.back ?? '').trim();
      if (!front || !back) return null;

      return {
        front,
        back,
        memoryTip: String(item?.memoryTip ?? 'Test yourself before flipping the card.').trim(),
      } as FlashcardItem;
    })
    .filter((card: FlashcardItem | null): card is FlashcardItem => !!card);

  if (cards.length === 0) {
    throw new Error('Failed to build flashcards');
  }

  const studyStrategy = Array.isArray(parsed?.studyStrategy)
    ? parsed.studyStrategy.map((item: any) => String(item ?? '').trim()).filter(Boolean)
    : [];

  return {
    title: String(parsed?.title ?? `Flashcards: ${fallbackSubject}`).trim(),
    difficulty: String(parsed?.difficulty ?? fallbackDifficulty).trim(),
    cards,
    studyStrategy,
  };
}

function normalizeEssayGrade(parsed: any): EssayGradeResult {
  const criteria = Array.isArray(parsed?.criteria)
    ? parsed.criteria
      .map((item: any) => ({
        name: String(item?.name ?? '').trim(),
        score: Number(item?.score ?? 0),
        outOf: Number(item?.outOf ?? 10),
        feedback: String(item?.feedback ?? '').trim(),
      }))
      .filter((item: EssayCriterionScore) => item.name)
    : [];

  const strengths = Array.isArray(parsed?.strengths)
    ? parsed.strengths.map((item: any) => String(item ?? '').trim()).filter(Boolean)
    : [];

  const improvements = Array.isArray(parsed?.improvements)
    ? parsed.improvements.map((item: any) => String(item ?? '').trim()).filter(Boolean)
    : [];

  const outOf = Number(parsed?.outOf ?? 100);
  const overallScore = Math.max(0, Math.min(Number(parsed?.overallScore ?? 0), outOf));

  return {
    overallScore,
    outOf,
    grade: String(parsed?.grade ?? 'N/A').trim(),
    summary: String(parsed?.summary ?? '').trim(),
    strengths,
    improvements,
    criteria,
    revisedExcerpt: String(parsed?.revisedExcerpt ?? '').trim(),
  };
}

function normalizeCitation(
  parsed: any,
  fallbackStyle: string
): CitationResult {
  const notes = Array.isArray(parsed?.notes)
    ? parsed.notes.map((item: any) => String(item ?? '').trim()).filter(Boolean)
    : [];

  return {
    style: String(parsed?.style ?? fallbackStyle).trim(),
    citation: String(parsed?.citation ?? '').trim(),
    inTextCitation: String(parsed?.inTextCitation ?? '').trim(),
    bibliographyEntry: String(parsed?.bibliographyEntry ?? parsed?.citation ?? '').trim(),
    notes,
  };
}

/**
 * Generate custom quiz questions for learning
 */
export async function generateQuiz(
  topic: string,
  gradeLevel: string = 'high school',
  questionCount: number = 5
): Promise<InteractiveQuiz> {
  const prompt = `Create a ${questionCount}-question multiple-choice quiz about "${topic}" for ${gradeLevel} learners.

Return ONLY valid JSON with this exact shape:
{
  "title": "Quiz: ...",
  "level": "${gradeLevel}",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ],
  "quickReview": ["string", "string", "string"]
}

Rules:
- Use exactly ${questionCount} questions.
- Options must be concise and plausible.
- Only one correct option per question.
- correctIndex must be 0-based.
- No markdown. No code fences. JSON only.`;

  const systemPrompt = `You are an expert educator and assessment writer. Produce accurate quizzes and strict machine-readable JSON only.`;

  const response = await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.4,
    maxTokens: 2200,
  });

  let parsed = parseJsonFromModelResponse<any>(response);

  if (!parsed) {
    const repairPrompt = `Convert the following content into VALID JSON only, preserving meaning and using this schema:
{
  "title": "string",
  "level": "string",
  "questions": [{"question":"string","options":["string"],"correctIndex":0,"explanation":"string"}],
  "quickReview": ["string"]
}

CONTENT:
${response}`;

    const repaired = await askGroq(repairPrompt, 'Return valid JSON only. No markdown.', {
      model: MODELS.secondary,
      temperature: 0,
      maxTokens: 2200,
    });
    parsed = parseJsonFromModelResponse<any>(repaired);
  }

  if (!parsed) {
    throw new Error('Could not parse quiz response');
  }

  return normalizeQuiz(parsed, topic, gradeLevel, questionCount);
}

/**
 * Generate study flashcards for active recall
 */
export async function generateFlashcards(
  subject: string,
  difficulty: string = 'intermediate'
): Promise<FlashcardDeck> {
  const prompt = `Create 10 high-quality flashcards for "${subject}" at ${difficulty} level.

Return ONLY valid JSON with this exact shape:
{
  "title": "Flashcards: ...",
  "difficulty": "${difficulty}",
  "cards": [
    {
      "front": "string",
      "back": "string",
      "memoryTip": "string"
    }
  ],
  "studyStrategy": ["string", "string", "string"]
}

Rules:
- Create exactly 10 cards.
- Keep front short and testable.
- Back must be clear and correct.
- No markdown. No code fences. JSON only.`;

  const systemPrompt = `You are an expert learning coach. Produce concise and accurate flashcards in strict JSON only.`;

  const response = await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.5,
    maxTokens: 2200,
  });

  let parsed = parseJsonFromModelResponse<any>(response);

  if (!parsed) {
    const repairPrompt = `Convert the following content into VALID JSON only, preserving meaning and using this schema:
{
  "title": "string",
  "difficulty": "string",
  "cards": [{"front":"string","back":"string","memoryTip":"string"}],
  "studyStrategy": ["string"]
}

CONTENT:
${response}`;

    const repaired = await askGroq(repairPrompt, 'Return valid JSON only. No markdown.', {
      model: MODELS.secondary,
      temperature: 0,
      maxTokens: 2200,
    });
    parsed = parseJsonFromModelResponse<any>(repaired);
  }

  if (!parsed) {
    throw new Error('Could not parse flashcards response');
  }

  return normalizeDeck(parsed, subject, difficulty);
}

/**
 * Generate a structured study guide
 */
export async function generateStudyGuide(
  topic: string,
  depth: string = 'comprehensive'
): Promise<string> {
  const prompt = `Create a ${depth} study guide for "${topic}".

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## Study Guide: ${topic}
### Depth: ${depth}

### 1. Core Concepts
- [Concept]
- [Concept]
- [Concept]

### 2. Detailed Notes
[Organized notes with short headings and bullet points]

### 3. Key Terms
- **[Term]:** [Definition]
- **[Term]:** [Definition]

### 4. Must-Remember Points
1. [Point]
2. [Point]
3. [Point]

### 5. Practice Questions
1. [Question]
2. [Question]
3. [Question]

### 6. Quick Revision Plan
- [How to revise in 15-30 minutes]
- [How to revise in 1-2 hours]
- [Final exam tip]`;

  const systemPrompt = `You are an academic tutor. Create structured, reliable, and exam-friendly study guides with clear sections, bullets, and concise explanations.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.5,
    maxTokens: 2200,
  });
}

/**
 * Generate a practical classroom lesson plan
 */
export async function generateLessonPlan(
  topic: string,
  gradeLevel: string = 'high school',
  duration: string = '45 minutes',
  teachingStyle: string = 'interactive',
  objectives: string = ''
): Promise<string> {
  const prompt = `Create a classroom lesson plan for "${topic}".

Details:
- Grade level: ${gradeLevel}
- Duration: ${duration}
- Teaching style: ${teachingStyle}
${objectives ? `- Learning objectives: ${objectives}` : ''}

Return in markdown with these sections:
1. Lesson Overview
2. Learning Objectives
3. Materials Needed
4. Lesson Timeline (warm-up, core activity, wrap-up)
5. Differentiation (support + advanced)
6. Assessment / Exit Ticket
7. Homework or extension`;

  const systemPrompt = `You are an expert teacher and curriculum designer. Create practical, classroom-ready plans with clear timing and actionable teaching steps.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.4,
    maxTokens: 2200,
  });
}

/**
 * Simplify complex explanations for the chosen audience level
 */
export async function simplifyExplanation(
  topic: string,
  sourceText: string = '',
  targetLevel: string = 'beginner',
  style: string = 'step-by-step'
): Promise<string> {
  const prompt = `Explain "${topic}" in a simplified way.

Audience level: ${targetLevel}
Style: ${style}
${sourceText ? `Original text to simplify:\n${sourceText}` : ''}

Return markdown with:
1. Simple Explanation
2. Key Ideas (bullets)
3. Real-World Analogy
4. Quick Check (2 short comprehension questions)`;

  const systemPrompt = `You are a clear and patient tutor. Break down complex ideas into simple, accurate, and engaging explanations for the selected level.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.4,
    maxTokens: 1800,
  });
}

/**
 * Generate interactive practice problems (multiple choice) with answers
 */
export async function generatePracticeProblems(
  topic: string,
  difficulty: string = 'intermediate',
  questionCount: number = 5
): Promise<InteractiveQuiz> {
  const prompt = `Create ${questionCount} multiple-choice practice problems about "${topic}".

Difficulty: ${difficulty}

Return ONLY valid JSON with this exact shape:
{
  "title": "Practice: ...",
  "level": "${difficulty}",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string"
    }
  ],
  "quickReview": ["string", "string", "string"]
}

Rules:
- Exactly ${questionCount} questions.
- At least 4 options per question.
- One correct answer only.
- Explanations should be concise and educational.
- JSON only. No markdown.`;

  const systemPrompt = `You are an expert problem-set creator. Generate accurate practice questions and strict machine-readable JSON.`;

  const response = await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.45,
    maxTokens: 2200,
  });

  let parsed = parseJsonFromModelResponse<any>(response);

  if (!parsed) {
    const repaired = await askGroq(
      `Convert this to valid JSON only using the schema {title, level, questions:[{question, options, correctIndex, explanation}], quickReview}:\n${response}`,
      'Return valid JSON only. No markdown.',
      {
        model: MODELS.secondary,
        temperature: 0,
        maxTokens: 2200,
      }
    );
    parsed = parseJsonFromModelResponse<any>(repaired);
  }

  if (!parsed) {
    throw new Error('Could not parse practice problems response');
  }

  return normalizeQuiz(parsed, topic, difficulty, questionCount);
}

/**
 * Grade an essay and return structured rubric feedback
 */
export async function gradeEssay(
  essayText: string,
  rubric: string = 'academic',
  level: string = 'high school'
): Promise<EssayGradeResult> {
  const prompt = `Grade this essay using a ${rubric} rubric for ${level} level.

Essay:
"""
${essayText}
"""

Return ONLY valid JSON with this exact shape:
{
  "overallScore": 0,
  "outOf": 100,
  "grade": "string",
  "summary": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "criteria": [
    { "name": "Thesis", "score": 0, "outOf": 10, "feedback": "string" }
  ],
  "revisedExcerpt": "string"
}

Rules:
- Criteria must include at least: Thesis, Structure, Evidence, Clarity, Grammar.
- Keep feedback practical and specific.
- JSON only. No markdown.`;

  const systemPrompt = `You are an expert writing evaluator. Provide fair, actionable rubric grading in strict JSON format.`;

  const response = await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.2,
    maxTokens: 2400,
  });

  let parsed = parseJsonFromModelResponse<any>(response);

  if (!parsed) {
    const repaired = await askGroq(
      `Convert this to valid JSON only using the schema {overallScore,outOf,grade,summary,strengths,improvements,criteria,revisedExcerpt}:\n${response}`,
      'Return valid JSON only. No markdown.',
      {
        model: MODELS.secondary,
        temperature: 0,
        maxTokens: 2400,
      }
    );
    parsed = parseJsonFromModelResponse<any>(repaired);
  }

  if (!parsed) {
    throw new Error('Could not parse essay grading response');
  }

  return normalizeEssayGrade(parsed);
}

/**
 * Generate citations for different academic styles
 */
export async function generateCitation(
  sourceType: string,
  style: string,
  sourceDetails: string
): Promise<CitationResult> {
  const prompt = `Create a ${style} citation.

Source type: ${sourceType}
Source details:
${sourceDetails}

Return ONLY valid JSON with this exact shape:
{
  "style": "${style}",
  "citation": "string",
  "inTextCitation": "string",
  "bibliographyEntry": "string",
  "notes": ["string", "string"]
}

Rules:
- Ensure citation follows ${style} formatting.
- If any field is missing, infer best-effort and mention assumptions in notes.
- JSON only. No markdown.`;

  const systemPrompt = `You are an academic citation expert. Produce accurate citation formatting in strict JSON.`;

  const response = await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.2,
    maxTokens: 1200,
  });

  let parsed = parseJsonFromModelResponse<any>(response);

  if (!parsed) {
    const repaired = await askGroq(
      `Convert this to valid JSON only using the schema {style,citation,inTextCitation,bibliographyEntry,notes}:\n${response}`,
      'Return valid JSON only. No markdown.',
      {
        model: MODELS.secondary,
        temperature: 0,
        maxTokens: 1200,
      }
    );
    parsed = parseJsonFromModelResponse<any>(repaired);
  }

  if (!parsed) {
    throw new Error('Could not parse citation response');
  }

  return normalizeCitation(parsed, style);
}

/**
 * Generate research questions for academic investigation
 */
export async function generateResearchQuestions(
  topic: string,
  field: string = 'general',
  questionCount: number = 8,
  scope: string = 'balanced'
): Promise<string> {
  const prompt = `Generate ${questionCount} high-quality research questions.

Topic: "${topic}"
Field: ${field}
Scope: ${scope}

Return markdown with sections:
1. Core Research Questions
2. Sub-questions
3. Suggested Variables / Keywords
4. Recommended Next Steps`;

  const systemPrompt = `You are an academic research advisor. Produce specific, arguable, and method-friendly research questions.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.45,
    maxTokens: 1800,
  });
}

/**
 * Generate thesis statement options with rationale
 */
export async function generateThesisStatements(
  topic: string,
  position: string = 'balanced',
  tone: string = 'academic',
  count: number = 5
): Promise<string> {
  const prompt = `Create ${count} thesis statement options.

Topic: "${topic}"
Position: ${position}
Tone: ${tone}

Return markdown with:
1. Thesis Options (numbered)
2. Why each works
3. Strongest option + improved final version`;

  const systemPrompt = `You are an expert writing coach. Produce clear, arguable, focused thesis statements with concise rationale.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.4,
    maxTokens: 1600,
  });
}

/**
 * Generate annotated bibliography entries
 */
export async function generateAnnotatedBibliography(
  topic: string,
  citationStyle: string = 'APA',
  sourceCount: number = 5,
  notes: string = ''
): Promise<string> {
  const prompt = `Create an annotated bibliography.

Topic: "${topic}"
Citation style: ${citationStyle}
Number of sources: ${sourceCount}
${notes ? `Constraints/notes: ${notes}` : ''}

Return markdown with:
1. Source list with full citation
2. 3-5 sentence annotation for each source (summary + evaluation + relevance)
3. Research gap notes`;

  const systemPrompt = `You are an academic librarian and writing specialist. Create realistic, coherent annotated bibliography entries with proper structure.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.35,
    maxTokens: 2200,
  });
}

/**
 * Generate a text-based mind map structure
 */
export async function generateMindMap(
  topic: string,
  depth: string = 'medium',
  focus: string = 'learning'
): Promise<string> {
  const prompt = `Generate a structured mind map for "${topic}".

Depth: ${depth}
Focus: ${focus}

Return markdown with:
1. Central Node
2. Main Branches
3. Sub-branches (nested bullets)
4. 3 possible study or project pathways`;

  const systemPrompt = `You are a structured-thinking coach. Build clear hierarchical maps that are easy to learn and apply.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.45,
    maxTokens: 1800,
  });
}

/**
 * Generate mnemonic devices and memory strategies
 */
export async function generateMnemonicDevices(
  concept: string,
  mnemonicType: string = 'mixed',
  count: number = 8
): Promise<string> {
  const prompt = `Create ${count} mnemonic devices for "${concept}".

Mnemonic type: ${mnemonicType}

Return markdown with:
1. Mnemonic options (acronym, phrase, imagery, chunking)
2. Why each mnemonic works
3. Best mnemonic + recall drill`;

  const systemPrompt = `You are a memory expert. Create practical, memorable mnemonic devices with short recall instructions.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.7,
    maxTokens: 1700,
  });
}

/**
 * Generate a language learning mini-lesson and practice
 */
export async function generateLanguageTutorLesson(
  language: string,
  level: string,
  goal: string,
  nativeLanguage: string = 'English'
): Promise<string> {
  const prompt = `Create a language learning mini-lesson.

Target language: ${language}
Learner level: ${level}
Learning goal: ${goal}
Learner native language: ${nativeLanguage}

Return markdown with:
1. Lesson objective
2. Key vocabulary (with meaning)
3. Grammar pattern
4. Practice exercises
5. Answer key
6. Speaking drill`;

  const systemPrompt = `You are a language tutor. Provide practical, level-appropriate lessons with clear exercises and answer keys.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.5,
    maxTokens: 2200,
  });
}

/**
 * Generate analogies to explain abstract concepts
 */
export async function generateAnalogies(
  concept: string,
  audience: string = 'general',
  style: string = 'everyday life',
  count: number = 6
): Promise<string> {
  const prompt = `Create ${count} analogies for "${concept}".

Audience: ${audience}
Style: ${style}

Return markdown with:
1. Analogy list (numbered)
2. Mapping table (concept part -> analogy part)
3. Best analogy for teaching beginners
4. Common misunderstanding warning`;

  const systemPrompt = `You are an expert explainer. Use vivid, accurate, and relatable analogies without distorting core meaning.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.6,
    maxTokens: 1800,
  });
}

/**
 * AI Encyclopedia - structured, Wikipedia-style explanation
 */
export async function generateEncyclopediaEntry(
  topic: string,
  depth: string = 'comprehensive'
): Promise<string> {
  const prompt = `Create a ${depth} encyclopedia-style entry about "${topic}".

Return markdown with these sections:
1. Overview
2. Key Facts
3. Background and Development
4. Core Concepts or Components
5. Why It Matters Today
6. Related Topics
7. Quick Recap

Requirements:
- Keep a neutral, factual tone.
- Use clear headings, bullet points, and concise paragraphs.
- If uncertain, explicitly mark assumptions.`;

  const systemPrompt = `You are a professional encyclopedia writer. Be accurate, neutral, and structured. Use markdown headings and bullet points for readability.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.35,
    maxTokens: 2200,
  });
}

/**
 * AI History Explorer - timeline and context for historical topics
 */
export async function exploreHistory(
  topic: string,
  era: string = '',
  region: string = ''
): Promise<string> {
  const prompt = `Provide a detailed historical exploration.

Topic: "${topic}"
${era ? `Era/Period: ${era}` : ''}
${region ? `Region: ${region}` : ''}

Return markdown with these sections:
1. Historical Context
2. Timeline of Events
3. Key Figures
4. Causes and Effects
5. Debates or Multiple Interpretations
6. Legacy and Modern Relevance
7. Related Topics to Study`;

  const systemPrompt = `You are a historian. Provide accurate, contextual, balanced explanations with dates when possible. Use clear markdown structure.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.35,
    maxTokens: 2300,
  });
}

/**
 * AI Biography Generator - comprehensive biography summary
 */
export async function generateBiography(
  personName: string,
  focus: string = 'comprehensive'
): Promise<string> {
  const prompt = `Write a ${focus} biography for "${personName}".

Return markdown with:
1. Quick Facts
2. Early Life and Education
3. Career Milestones
4. Major Works or Achievements
5. Challenges or Criticism
6. Legacy and Impact
7. Suggested Reading/Viewing

Requirements:
- Avoid fabricated details.
- If key facts are uncertain, clearly mark uncertainty.`;

  const systemPrompt = `You are a biographer. Be factual, respectful, and balanced. Use clear markdown sections and bullets.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.35,
    maxTokens: 2200,
  });
}

/**
 * AI Timeline Generator - chronological timeline for events/topics
 */
export async function generateTimeline(
  topic: string,
  startYear: string = '',
  endYear: string = ''
): Promise<string> {
  const rangeLine = startYear || endYear
    ? `Range: ${startYear || 'earliest known'} to ${endYear || 'present'}`
    : '';

  const prompt = `Create a chronological timeline.

Topic: "${topic}"
${rangeLine}

Return markdown with:
1. Scope
2. Chronological Events (at least 8 entries)
3. Turning Points
4. Patterns and Themes
5. Key Takeaways

For each timeline entry use:
- Year/Date
- Event Title
- Why it matters`;

  const systemPrompt = `You are a timeline specialist. Keep strict chronological order, concise entries, and clear significance notes.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.3,
    maxTokens: 2200,
  });
}

/**
 * AI Country Guide - current, source-backed country overview
 */
export async function generateCountryGuide(
  countryName: string,
  focus: string = 'general'
): Promise<string> {
  const prompt = `Create a practical country guide for "${countryName}" with focus on "${focus}".

This answer must include recent factual information where applicable.
Return markdown with:
1. Quick Facts
2. Government and Economy
3. Culture and Society
4. Geography and Climate
5. Travel and Safety Notes
6. Key Opportunities and Challenges
7. Sources (URLs)

Requirements:
- Use current, verifiable information for population, currency, and economy.
- Include direct source links in the Sources section.
- If data is uncertain or varies by source, state that explicitly.`;

  const systemPrompt = `You are a country intelligence analyst using live web research. Prefer authoritative and up-to-date sources. Keep output clear and structured.`;

  return await askGroqWithWebSearch(prompt, systemPrompt, {
    temperature: 0.2,
    maxTokens: 2200,
  });
}

/**
 * AI Science Explainer - simplify complex science by level
 */
export async function explainScience(
  concept: string,
  level: string = 'intermediate'
): Promise<string> {
  const prompt = `Explain the science concept "${concept}" for ${level} level learners.

Return markdown with:
1. Simple Explanation
2. How It Works
3. Key Terms
4. Real-World Applications
5. Common Misconceptions
6. Quick Self-Check (3 questions with short answers)`;

  const systemPrompt = `You are a science educator. Be accurate, clear, and practical. Use examples and avoid unnecessary jargon for the selected level.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.45,
    maxTokens: 2100,
  });
}

/**
 * AI Philosophy Explainer - concept and schools-of-thought breakdown
 */
export async function explainPhilosophy(
  concept: string,
  philosopher: string = ''
): Promise<string> {
  const prompt = `Explain the philosophical concept "${concept}"${philosopher ? ` with emphasis on ${philosopher}` : ''}.

Return markdown with:
1. Simple Explanation
2. Formal Definition and Branch
3. Key Philosophers and Views
4. Competing Schools of Thought
5. Practical Relevance Today
6. Reflection Questions
7. Suggested Readings`;

  const systemPrompt = `You are a philosophy tutor. Explain clearly without oversimplifying. Present multiple viewpoints fairly and use structured markdown.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.5,
    maxTokens: 2200,
  });
}

/**
 * Fact-check a claim using web-search-capable Groq models.
 */
export async function checkFact(claim: string): Promise<string> {
  const prompt = `Analyze and fact-check this claim: "${claim}"

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## Fact Check Analysis

### Claim Being Checked
"${claim}"

### Verdict
**[TRUE / MOSTLY TRUE / PARTIALLY TRUE / MISLEADING / FALSE / UNVERIFIABLE]**

### Accuracy Rating
[⬛⬛⬛⬛⬛ or ⬛⬛⬛⬜⬜]

### Analysis
[Detailed explanation with evidence-based reasoning]

### Supporting Evidence
1. [Evidence point with source + URL]
2. [Another evidence point with source + URL]
3. [Third evidence point with source + URL]

### Important Context
- [Context and caveats]
- [Nuance if claim is partially correct]

### Sources (URLs)
1. [Source title](https://...)
2. [Source title](https://...)
3. [Source title](https://...)

### The Full Picture
[What users should actually understand]

---
Fact-checked by Plainly AI`;

  const systemPrompt = `You are a professional fact-checker with live web research capability.
Verify claims using up-to-date online sources, prioritize authoritative references, provide direct source URLs,
and clearly state uncertainty when evidence is mixed.`;

  return await askGroqWithWebSearch(prompt, systemPrompt, {
    temperature: 0.2,
    maxTokens: 1900,
  });
}

/**
 * Generate shared creative content (Story Starters, Plots, etc)
 */
export async function generateCreativeContent(
  type: 'storyStarter' | 'plot' | 'poem' | 'lyrics' | 'joke' | 'quote' | 'pickupLine' | 'bandName' | 'rapName' | 'username' | 'colorPalette' | 'meetingAgenda' | 'babyName' | 'hashtag' | 'businessName',
  topic: string,
  details: string = '',
  tone: string = 'creative'
): Promise<string> {
  const prompts = {
    storyStarter: `Write 3 unique story starters (first paragraphs) for a ${topic} story. ${details ? `Style: ${details}` : ''} Tone: ${tone}.`,
    plot: `Generate a compelling plot outline for a ${topic} story. ${details ? `Style: ${details}` : ''} Tone: ${tone}.`,
    poem: `Write a ${tone} poem about "${topic}". ${details ? `Style/Format: ${details}` : ''}. Use beautiful, evocative language.`,
    lyrics: `Write song lyrics about "${topic}". Genre/Style: ${details || 'modern pop'}. Mood/Tone: ${tone}.`,
    joke: `Tell me 5 funny jokes about "${topic}". Style: ${details || 'observational'}. Tone: ${tone}.`,
    quote: `Generate 5 original quotes about "${topic}". Tone: ${tone}. ${details ? `Style: ${details}` : ''}`,
    pickupLine: `Generate 5 clever pickup lines about "${topic}". Tone: ${tone}. Style: ${details || 'witty'}.`,
    bandName: `Generate 7 creative band names inspired by "${topic}". Style: ${details || 'cool'}. Tone: ${tone}.`,
    rapName: `Generate 7 unique rap/hip-hop stage names inspired by "${topic}". Style: ${details || 'modern'}. Tone: ${tone}.`,
    username: `Generate 10 creative and catchy usernames inspired by "${topic}". ${details ? `Context: ${details}` : ''} Tone: ${tone}.`,
    colorPalette: `Generate 5 professional color palettes inspired by "${topic}". For each palette, provide 5 HEX codes and a brief description. Theme/Tone: ${tone}.`,
    meetingAgenda: `Generate a structured meeting agenda for a meeting about "${topic}". ${details ? `Goals: ${details}` : ''} Tone: ${tone}. Include time allocations.`,
    babyName: `Suggest 10 unique baby names inspired by "${topic}". Style: ${details || 'modern'}. Tone/Vibe: ${tone}.`,
    hashtag: `Generate 20 trending hashtags for "${topic}". Context: ${details || 'social media'}. Tone: ${tone}.`,
    businessName: `Generate 10 creative business names for "${topic}". Style: ${details || 'modern'}. Keywords: ${details}.`,
  };

  const prompt = prompts[type] || `Write something creative about ${topic}.`;

  const systemPrompt = `You are a highly creative writer. Write engaging, imaginative, and original content. 
  ${type === 'poem' || type === 'quote' ? 'Use beautiful formatting and a premium tone.' : ''}
  Use Markdown for formatting (bold, lists, etc.) to ensure the output looks premium.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.9,
    maxTokens: 1500,
  });
}

/**
 * Specialized assistant for coding tasks (Debugger, Explainer, etc)
 */
export async function generateCodeAssistantContent(
  type: 'debugger' | 'explainer' | 'converter' | 'sql' | 'regex' | 'gitCommit' | 'apiDoc' | 'unitTest' | 'codeComment' | 'codeReview' | 'variableName' | 'css' | 'html' | 'reactComponent' | 'restApi' | 'dbSchema' | 'algorithm' | 'techStack' | 'functionName' | 'seoKeyword' | 'adCopy',
  content: string,
  options: {
    language?: string;
    targetLanguage?: string;
    level?: string;
    error?: string;
    dialect?: string;
    testStrings?: string;
    format?: string;
    framework?: string;
    verbosity?: string;
    focus?: string;
    convention?: string;
    niche?: string;
    platform?: string;
  } = {}
): Promise<string> {
  const prompts = {
    debugger: `Debug the following ${options.language || 'code'} snippet.
      ${options.error ? `Error Reported: ${options.error}` : ''}
      
      CODE:
      \`\`\`
      ${content}
      \`\`\`
      
      Provide the fixed code and a clear explanation of what was wrong.`,

    explainer: `Explain how the following logic works. 
      Target Detail Level: ${options.level || 'Intermediate'}
      
      CODE:
      \`\`\`
      ${content}
      \`\`\`
      
      Break down the complexity and explain the key components clearly.`,

    converter: `Convert the following code from ${options.language || 'source'} to ${options.targetLanguage || 'target'}.
      
      CODE:
      \`\`\`
      ${content}
      \`\`\`
      
      Ensure the resulting code follows the idioms and best practices of ${options.targetLanguage}.`,

    sql: `Generate a SQL query for the following requirement: "${content}"
      ${options.dialect ? `SQL Dialect: ${options.dialect}` : ''}
      
      Provide the optimized SQL query and a brief explanation of how it works.`,

    regex: `Generate a regular expression for this requirement: "${content}"
      ${options.testStrings ? `Example strings to match: ${options.testStrings}` : ''}
      
      Provide the regex pattern and explain how each part of the pattern works.`,

    gitCommit: `Generate 3 high-quality git commit messages for these changes:
      STYLE: ${options.level || 'Conventional'}
      
      CHANGES/DIFF:
      ${content}
      
      Output messages in a list, following the requested style.`,

    apiDoc: `Generate comprehensive API documentation for the following code:
      FORMAT: ${options.format || 'Markdown'}
      
      CODE:
      \`\`\`
      ${content}
      \`\`\`
      
      Include parameters, return types, and example usage.`,

    unitTest: `Generate robust unit tests for this code:
      FRAMEWORK: ${options.framework || 'Jest'}
      
      CODE:
      \`\`\`
      ${content}
      \`\`\`
      
      Ensure edge cases are covered and follow the best practices for ${options.framework}.`,

    codeComment: `Add clear, helpful comments to the following code:
      VERBOSITY: ${options.verbosity || 'Explanatory'}
      
      CODE:
      \`\`\`
      ${content}
      \`\`\`
      
      Improve readability without cluttering the code.`,

    codeReview: `Perform a professional code review for the following snippet:
      FOCUS: ${options.focus || 'All'}
      
      CODE:
      \`\`\`
      ${content}
      \`\`\`
      
      Highlight potential bugs, performance issues, and architectural improvements.`,

    variableName: `Suggest 5-10 perfect variable names for this context:
      DESCRIPTION: "${content}"
      CONVENTION: ${options.convention || 'camelCase'}
      
      Provide names that are descriptive, concise, and follow the convention.`,

    functionName: `Suggest 5-10 perfect function/method names for this context:
      DESCRIPTION: "${content}"
      CONVENTION: ${options.convention || 'camelCase'}
      
      Provide names that clarify the action and follow naming best practices.`,

    css: `Generate modern CSS styles for this requirement: "${content}"
      FRAMEWORK/STYLE: ${options.framework || 'Vanilla CSS'}
      
      Provide well-structured CSS and brief usage context.`,

    html: `Generate semantic HTML structure for this requirement: "${content}"
      STRUCTURE TYPE: ${options.level || 'Semantic HTML5'}
      
      Provide clean, accessible HTML and brief explanation.`,

    reactComponent: `Generate a React component for the following requirement: "${content}"
      LIBRARIES/STYLE: ${options.framework || 'Vanilla CSS'}
      
      Provide the complete code for a modern, functional component.`,

    restApi: `Design a RESTful API structure for: "${content}"
      ARCHITECTURE: ${options.level || 'REST'}
      
      Include endpoints, request/reponse schemas, and best practices.`,

    dbSchema: `Design a database schema for: "${content}"
      DB TYPE: ${options.dialect || 'Postgres'}
      
      Include table definitions (or collections), relationships, and optimization tips.`,

    algorithm: `Suggest the best algorithm(s) for the following problem: "${content}"
      PRIORITY: ${options.focus || 'Performance'}
      
      Provide the algorithm name, logic description, and Big O complexity.`,

    techStack: `Recommend a professional tech stack for this project: "${content}"
      FOCUS: ${options.level || 'Full-stack'}
      
      Provide recommendations for frontend, backend, database, and hosting.`,

    seoKeyword: `Research high-ranking SEO keywords for: "${content}"
      NICHE: ${options.niche || 'General'}
      
      Provide a list of keywords, search intent, and competition analysis.`,

    adCopy: `Generate high-converting ad copy for: "${content}"
      PLATFORM: ${options.platform || 'Google Ads'}
      
      Include headline, description, and call-to-action options.`,
  };

  const prompt = prompts[type] || `Analyze this: ${content}`;

  const systemPrompt = `You are an elite expert in software engineering, technical architecture, and digital marketing.
  ${type === 'debugger' ? 'Focus on identifying bugs, memory leaks, and logical errors. Provide clear, fix-oriented feedback.' : ''}
  ${type === 'explainer' ? 'Provide deep architectural insights. Explain "why" not just "what".' : ''}
  ${type === 'converter' ? 'Maintain functional parity while adopting the target language\'s best practices.' : ''}
  ${type === 'sql' || type === 'dbSchema' ? 'Write high-performance, secure data structures. Avoid redundant storage and use proper indexing.' : ''}
  ${type === 'regex' ? 'Create readable and efficient regex. Explain lookaheads/lookbehinds if used.' : ''}
  ${type === 'gitCommit' ? 'Write clear, descriptive commit messages. Use the "type: subject" format if Conventional.' : ''}
  ${type === 'apiDoc' || type === 'restApi' ? 'Create clean, professional documentation/designs. Prioritize clarity, security, and scalability.' : ''}
  ${type === 'unitTest' ? 'Focus on test coverage, descriptive test names, and isolation (mocking).' : ''}
  ${type === 'codeComment' ? 'Explain the "intent" of complex bits. Do not state the obvious.' : ''}
  ${type === 'codeReview' ? 'Be constructive and thorough. Check for edge cases and security vulnerabilities.' : ''}
  ${type === 'variableName' || type === 'functionName' ? 'Prioritize descriptive names that eliminate the need for comments.' : ''}
  ${type === 'css' || type === 'html' || type === 'reactComponent' ? 'Focus on modern, accessible, and clean frontend code.' : ''}
  ${type === 'algorithm' ? 'Provide efficient algorithms. Explain time and space complexity clearly.' : ''}
  ${type === 'techStack' ? 'Suggest modern, scalable, and cost-effective stacks based on current industry standards.' : ''}
  ${type === 'seoKeyword' ? 'Focus on user intent and search volume optimization.' : ''}
  ${type === 'adCopy' ? 'Write compelling, persuasive copy that drives conversions and high CTR.' : ''}
  
  ALWAYS use Markdown for formatting. Use code blocks for all code/technical snippets.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.versatile,
    temperature: 0.2,
    maxTokens: 2500,
  });
}

/**
 * Specialized assistant for Design and Visual concepts (Batch 9)
 */
export async function generateDesignContent(
  type: 'customerPersona' | 'memeGenerator' | 'thumbnail' | 'videoGenerator' | 'faceGenerator' | 'logo' | 'cartoonAvatar' | 'pattern' | 'albumCover' | 'businessCard' | 'instaStory' | 'infographic' | 'presentation',
  topic: string,
  options: {
    style?: string;
    platform?: string;
    industry?: string;
    targetAudience?: string;
  } = {}
): Promise<string> {
  const prompts = {
    customerPersona: `Create a detailed customer persona for a business in the ${options.industry || 'general'} industry. 
      PRODUCT/SERVICE: "${topic}"
      TARGET AUDIENCE: ${options.targetAudience || 'General'}
      
      Include demographic info, pain points, motivations, and buying behavior.`,

    memeGenerator: `Generate 5 creative meme concepts for: "${topic}"
      STYLE: ${options.style || 'Humorous'}
      
      For each, provide a Caption (Top/Bottom) and a description of the recommended visual/image template.`,

    thumbnail: `Design a high-CTR video thumbnail concept for: "${topic}"
      PLATFORM: ${options.platform || 'YouTube'}
      STYLE: ${options.style || 'Vibrant/Bold'}
      
      Include main text overlay, focal point description, and background suggestions.`,

    videoGenerator: `Generate a conceptual video script and scene descriptions for: "${topic}"
      TYPE: ${options.style || 'Short-form (TikTok/Reels)'}
      GOAL: ${options.targetAudience || 'Engagement'}
      
      Provide a hook, core scenes, and a call-to-action.`,

    faceGenerator: `Generate a precise, high-detail description for a realistic AI face based on: "${topic}"
      STYLE: ${options.style || 'Photorealistic'}
      
      Include features like age, ethnicity, expression, lighting, and camera angle.`,

    logo: `Design a professional logo concept for: "${topic}"
      INDUSTRY: ${options.industry || 'General'}
      STYLE: ${options.style || 'Minimalist'}
      
      Include icon description, typography suggestions, and color palette.`,

    cartoonAvatar: `Generate a unique cartoon avatar concept for: "${topic}"
      STYLE: ${options.style || 'Flat Design / 3D Render'}
      
      Include character traits, accessories, and stylistic elements.`,

    pattern: `Design a seamless pattern concept based on: "${topic}"
      STYLE: ${options.style || 'Abstract/Geometric'}
      
      Describe the repeating elements, color schemes, and usage scenarios.`,

    albumCover: `Design a professional album cover concept for: "${topic}"
      GENRE/VIBE: ${options.style || 'Modern'}
      
      Include focal imagery, typography style, and atmospheric details.`,

    businessCard: `Design a modern business card layout for: "${topic}"
      STYLE: ${options.style || 'Premium/Professional'}
      
      Include front/back layout, font recommendations, and material suggestions.`,

    instaStory: `Generate 3 engaging Instagram Story templates for: "${topic}"
      GOAL: ${options.targetAudience || 'Interaction'}
      
      Include text overlays, interactive elements (polls/prompts), and visual composition.`,

    infographic: `Create a structured infographic plan for: "${topic}"
      STYLE: ${options.style || 'Clean/Data-driven'}
      
      Include information hierarchy, key statistics to highlight, and icon/graph suggestions.`,

    presentation: `Generate a slide-by-slide content and design plan for a presentation about: "${topic}"
      LENGTH: 5-7 slides
      STYLE: ${options.style || 'Corporate/Sleek'}
      
      Include slide titles, core bullet points, and visual layout ideas for each slide.`,
  };

  const prompt = prompts[type] || `Design a concept for: ${topic}`;

  const systemPrompt = `You are a world-class creative director and design strategist.
    ${type === 'customerPersona' ? 'Focus on psychological depth and actionable marketing insights.' : ''}
    ${type === 'memeGenerator' ? 'Focus on relatability, viral potential, and humor.' : ''}
    ${type === 'thumbnail' ? 'Focus on psychology of clicks: high contrast, readable text, and curiosity loops.' : ''}
    ${type === 'logo' || type === 'businessCard' ? 'Focus on branding principles: scalability, memorability, and industry relevance.' : ''}
    ${type.includes('Generator') || type === 'faceGenerator' ? 'Provide incredibly detailed prompts that could be used in Midjourney or Stable Diffusion.' : ''}
    ${type === 'presentation' || type === 'infographic' ? 'Focus on clarity of information and logical flow.' : ''}
    
    ALWAYS use Markdown for formatting. Use bold headers, lists, and tables where appropriate to make the design plan look premium.`;

  return await askGroq(prompt, systemPrompt, {
    model: MODELS.primary,
    temperature: 0.8,
    maxTokens: 2000,
  });
}
