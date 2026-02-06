// Groq AI Service for Plainly
// PRIORITIZE high-limit models for maximum daily capacity!

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://plainly.live').replace(/\/$/, '')
const GROQ_PROXY_URL = `${API_BASE_URL}/api/ai/groq`

// Model rate limits (from Groq console):
// llama-3.1-8b-instant:     14,400 req/day  ← PRIMARY
// allam-2-7b:                7,000 req/day  ← SECONDARY (for variety)
// llama-3.3-70b-versatile:   1,000 req/day  ← Premium quality
// Llama 4 Scout/Maverick:    1,000 req/day  ← Premium creative
// groq/compound-mini:          250 req/day  ← Complex tasks only

export const MODELS = {
    // HIGH LIMIT - Use these for most tasks (21.4K combined/day!)
    primary: 'llama-3.1-8b-instant',      // 14.4K/day - MAIN model
    secondary: 'allam-2-7b',               // 7K/day - ALTERNATE model

    // MEDIUM LIMIT - Use when needed (1K/day each)
    creative: 'meta-llama/llama-4-maverick-17b-128e-instruct',
    analytical: 'meta-llama/llama-4-scout-17b-16e-instruct',
    versatile: 'llama-3.3-70b-versatile',

    // LOW LIMIT - Use sparingly (250/day)
    complex: 'groq/compound-mini',
    search: 'groq/compound',

    // Default = primary (highest limit)
    default: 'llama-3.1-8b-instant',

    // Aliases for specific use cases (all point to primary for high limit)
    randomNames: 'llama-3.1-8b-instant'   // For fun/random generation tools
}

async function callGroqProxy(payload) {
    const response = await fetch(GROQ_PROXY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    let data = null
    try {
        data = await response.json()
    } catch {
        throw new Error('Invalid AI proxy response')
    }

    if (!response.ok) {
        throw new Error(data?.error || 'AI request failed')
    }

    return data?.content || ''
}

/**
 * Send a prompt to Groq AI with automatic fallback on rate limits
 * @param {string} prompt - The user prompt
 * @param {string} systemPrompt - Optional system instructions
 * @param {object} options - Additional options
 * @returns {Promise<string>} - AI response text
 */
export async function askGroq(prompt, systemPrompt = '', options = {}) {
    const {
        model = MODELS.default,
        maxTokens = 1024,
        temperature = 0.7
    } = options

    return callGroqProxy({
        prompt,
        systemPrompt,
        options: {
            model,
            maxTokens,
            temperature
        },
        search: false
    })
}

/**
 * Send a prompt using web-search-capable Groq models only.
 * Used for fact-checking and truth verification workflows.
 */
async function askGroqWithWebSearch(prompt, systemPrompt = '', options = {}) {
    const {
        maxTokens = 1800,
        temperature = 0.2
    } = options

    return callGroqProxy({
        prompt,
        systemPrompt,
        options: {
            maxTokens,
            temperature
        },
        search: true
    })
}

/**
 * Generate creative baby names using AI
 * Uses: Maverick model (creative writing)
 */
export async function generateAIBabyNames(gender, style, startsWith = '', count = 6) {
    const genderText = gender === 'any' ? 'both boy and girl' : gender === 'male' ? 'boy' : 'girl'
    const startsWithText = startsWith ? ` that start with "${startsWith}"` : ''

    const prompt = `Generate ${count} unique and creative ${genderText} baby names${startsWithText}. 
Style preference: ${style} (modern = trendy 2020s names, classic = timeless traditional names, unique = rare/unusual names).

Return ONLY a JSON array of objects with this exact format, no other text:
[{"name": "Name1", "meaning": "brief meaning", "origin": "origin"}, ...]`

    const systemPrompt = 'You are a helpful baby name expert. Always respond with valid JSON only, no markdown or explanations.'

    try {
        const response = await askGroq(prompt, systemPrompt, {
            model: MODELS.primary,
            temperature: 0.9,
            maxTokens: 500
        })

        // Parse JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid AI response format')
    } catch (error) {
        console.error('AI Name Generation Error:', error)
        return null
    }
}

/**
 * Generate business/brand names using AI
 * Uses: Maverick model (creative writing)
 */
export async function generateAIBusinessNames(industry, keywords = '', style = 'modern', count = 6) {
    const prompt = `Generate ${count} creative and memorable business/brand names for a ${industry} company.
${keywords ? `Keywords to incorporate: ${keywords}` : ''}
Style: ${style}

Return ONLY a JSON array with this format, no other text:
[{"name": "BrandName", "tagline": "short catchy tagline", "available": true}]`

    const systemPrompt = 'You are a branding expert. Generate catchy, memorable, and unique business names. Always respond with valid JSON only.'

    try {
        const response = await askGroq(prompt, systemPrompt, {
            model: MODELS.primary,
            temperature: 0.9,
            maxTokens: 500
        })
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('Invalid AI response format')
    } catch (error) {
        console.error('AI Business Name Error:', error)
        return null
    }
}

/**
 * Summarize text using AI
 * Uses: Scout model (analysis/reasoning)
 */
export async function summarizeText(text, style = 'concise') {
    const styleInstructions = {
        concise: 'Provide a brief 2-3 sentence summary.',
        detailed: 'Provide a comprehensive summary covering all key points.',
        bullets: 'Provide a summary as bullet points.'
    }

    const prompt = `Summarize the following text:

"${text}"

${styleInstructions[style] || styleInstructions.concise}`

    const systemPrompt = 'You are an expert summarizer. Be accurate and capture the essence of the text.'

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.3,
        maxTokens: 500
    })
}

/**
 * Generate paragraphs using AI
 * Uses: Instant model (fast simple tasks)
 */
export async function generateParagraph(topic, tone = 'professional', length = 'medium') {
    const lengthGuide = {
        short: '50-75 words',
        medium: '100-150 words',
        long: '200-300 words'
    }

    const prompt = `Write a ${tone} paragraph about: "${topic}"

Length: approximately ${lengthGuide[length] || lengthGuide.medium}.
Make it engaging, informative, and well-written.`

    const systemPrompt = `You are an expert content writer. Write in a ${tone} tone.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 500
    })
}

/**
 * Translate text using AI
 * Uses: 70B Versatile (most capable)
 */
export async function translateText(text, targetLanguage) {
    const prompt = `Translate the following text to ${targetLanguage}:

"${text}"

Provide only the translation, no explanations.`

    const systemPrompt = 'You are an expert translator. Provide accurate, natural-sounding translations.'

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.3,
        maxTokens: 1000
    })
}

/**
 * Improve/rewrite text using AI
 * Uses: Compound-mini (good for complex tasks)
 */
export async function improveText(text, style = 'professional') {
    const prompt = `Improve and rewrite the following text to make it more ${style}:

"${text}"

Keep the same meaning but improve clarity, grammar, and flow.`

    const systemPrompt = 'You are an expert editor. Improve text while maintaining its original meaning.'

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 1000
    })
}

/**
 * Generate random name (for various generators)
 * Uses: Instant model (fast)
 */
export async function generateRandomName(type, options = {}) {
    const prompts = {
        pet: `Generate 6 creative ${options.petType || 'pet'} names. Return JSON array: [{"name": "Name", "personality": "trait"}]`,
        username: `Generate 6 unique username ideas${options.keywords ? ` related to: ${options.keywords}` : ''}. Return JSON array: [{"username": "name123", "style": "type"}]`,
        character: `Generate 6 fictional character names for a ${options.genre || 'fantasy'} story. Return JSON array: [{"name": "Name", "background": "brief background"}]`,
        team: `Generate 6 team/group names for ${options.purpose || 'sports'}. Return JSON array: [{"name": "TeamName", "meaning": "why it works"}]`
    }

    const prompt = prompts[type] || prompts.pet
    const systemPrompt = 'You are a creative naming expert. Always respond with valid JSON only.'

    try {
        const response = await askGroq(prompt, systemPrompt, {
            model: MODELS.primary,
            temperature: 0.9,
            maxTokens: 400
        })
        const jsonMatch = response.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        return null
    } catch (error) {
        console.error('AI Name Error:', error)
        return null
    }
}

/**
 * Generate emails using AI
 * Uses: Scout model (analysis/reasoning)
 */
export async function generateEmail(purpose, context, tone = 'professional', length = 'medium') {
    const lengthGuide = {
        short: 'Clear and concise, get straight to the point.',
        medium: 'Standard email length with proper greeting and closing.',
        long: 'Detailed email with comprehensive explanations and structure.'
    }

    const prompt = `Draft a ${tone} email for the following purpose: "${purpose}"
    
Context/Details: ${context}

Length requirement: ${lengthGuide[length] || lengthGuide.medium}

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 📧 Subject
**[Your subject line here]**

## 📝 Email Body

**Greeting:**
[Greeting here]

**Body:**
[Main email content here - use paragraphs]

**Closing:**
[Professional closing and signature placeholder]

---

## 💡 Pro Tips
- [One tip about this email type]
- [Another helpful suggestion]`

    const systemPrompt = `You are a professional communication expert. Write emails that are ${tone}, effective, and impactful. 
    
IMPORTANT: Always format your response with markdown headers (##), bold labels (**text**), and bullet points (-) exactly as specified in the prompt. This ensures beautiful purple-styled output.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 1000
    })
}

/**
 * Generate cover letters using AI
 */
export async function generateCoverLetter(jobTitle, company, skills, experience, tone = 'professional') {
    const prompt = `Write a ${tone} cover letter for the position of "${jobTitle}" at "${company}".
    
My Key Skills: ${skills}
My Experience: ${experience}

The letter should be professional, persuasive, and tailored to the job. Include placeholders for [Date], [Hiring Manager Name], and [My Contact Info].`

    const systemPrompt = `You are a career coaching expert. Write compelling, professional cover letters that help candidates stand out.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary, // Using same model as email
        temperature: 0.7,
        maxTokens: 1500
    })
}

/**
 * Generate resume summaries using AI
 */
export async function generateResumeSummary(jobTitle, experience, achievements) {
    const prompt = `Write 3 different professional resume summaries for a "${jobTitle}".
    
Years of Experience: ${experience}
Key Achievements: ${achievements}

Provide 3 options: 1. Concise, 2. Achievement-focused, 3. Skills-focused.`

    const systemPrompt = `You are an expert resume writer. Create impactful, keyword-rich summaries that grab attention.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 800
    })
}

/**
 * Generate product descriptions using AI
 */
export async function generateProductDescription(productName, features, audience, tone = 'persuasive') {
    const prompt = `Write a ${tone} product description for "${productName}".
    
Key Features: ${features}
Target Audience: ${audience}

Make it engaging and focus on benefits, not just features.`

    const systemPrompt = `You are a professional copywriter. Create compelling product descriptions that drive conversions.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.8,
        maxTokens: 800
    })
}

/**
 * Generate slogans/taglines using AI
 */
export async function generateSlogans(businessName, description, tone = 'catchy') {
    const prompt = `Generate 10 catchy and memorable slogans for "${businessName}".
    
Business Description: ${description}
Desired Tone: ${tone}

Return as a list.`

    const systemPrompt = `You are a creative branding expert. Create short, punchy, and memorable slogans.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.9,
        maxTokens: 500
    })
}

/**
 * Generate social media content (Tweets, Instagram, etc)
 */
export async function generateSocialContent(platform, topic, keywords, tone = 'engaging') {
    const prompt = `Create 5 ${tone} posts for ${platform} about: "${topic}"
    
Include these keywords: ${keywords}
Include relevant hashtags.`

    const systemPrompt = `You are a social media marketing expert. Create high-engagement content for ${platform}.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.8,
        maxTokens: 800
    })
}

/**
 * Generate blog post drafts using AI
 */
export async function generateBlogPost(topic, outline = '', tone = 'informative', length = 'medium') {
    const prompt = `Write a ${tone} blog post about: "${topic}"
    
${outline ? `Follow this outline: ${outline}` : 'Create a structured post with introduction, key points, and conclusion.'}

Length: ${length === 'short' ? '400-600 words' : length === 'long' ? '1000-1500 words' : '700-900 words'}.`

    const systemPrompt = `You are an expert blog writer. Write engaging, SEO-optimized, and high-quality content.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 2048
    })
}

/**
 * Generate SEO meta descriptions using AI
 */
export async function generateMetaDescription(pageTitle, contentSummary, targetKeywords = '') {
    const prompt = `Write 3 different compelling SEO meta descriptions for:
    
Page Title: ${pageTitle}
Content: ${contentSummary}
Keywords: ${targetKeywords}

Each description must be under 160 characters and include a call to action.`

    const systemPrompt = `You are an SEO expert. Write descriptions that improve click-through rates while staying within character limits.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 500
    })
}

/**
 * Generate creative titles for content (YouTube, Articles)
 */
export async function generateContentTitles(topic, type = 'YouTube', tone = 'viral') {
    const prompt = `Generate 10 ${tone} ${type} titles for a video/article about: "${topic}"
    
Make them catchy with high click-through potential.`

    const systemPrompt = `You are a viral content strategist. Create titles that are irresistible to click but not clickbaity.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.9,
        maxTokens: 500
    })
}

/**
 * Advanced text transformation services
 */

export async function checkGrammar(text) {
    const prompt = `Review the following text for grammar, spelling, and punctuation errors:
    
"${text}"`

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
5. Use clean Markdown formatting.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.1,
        maxTokens: 1000
    })
}

export async function transformVoice(text, targetVoice = 'active') {
    const prompt = `Perform a voice transformation analysis for the text below. 

TEXT: "${text}"
TARGET: ${targetVoice === 'active' ? 'Active Voice' : 'Passive Voice'}

If the text cannot be elegantly transformed (e.g., intransitive verbs), explain the closest professional alternative.`

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
5. Use clean, professional Markdown.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.1,
        maxTokens: 1000
    })
}

export async function adjustSentenceLength(text, target = 'expand') {
    const action = target === 'expand' ? 'Expand and elaborate on' : 'Shorten and make more concise';
    const prompt = `${action} the following text while keeping the core meaning:
    
"${text}"`

    const systemPrompt = `You are an expert writer. ${target === 'expand' ? 'Add relevant detail and depth' : 'Remove fluff and optimize for brevity'}.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.6,
        maxTokens: 1000
    })
}

/**
 * Academic & Business tools
 */

export async function generateEssayOutline(topic, type = 'argumentative') {
    const prompt = `Create a structured essay outline for the topic: "${topic}"
    
Essay Type: ${type}

Include:
1. Introduction (with thesis statement placeholder)
2. 3-4 Main body paragraphs with key points
3. Conclusion`

    const systemPrompt = `You are an academic writing coach. Create logical, well-structured outlines for students.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 1000
    })
}

export async function generateMeetingNotes(transcript, format = 'standard') {
    const prompt = `Summarize the following meeting discussion into structured notes:
    
"${transcript}"

Format: ${format === 'bullets' ? 'Concise bullet points' : 'Detailed sections with Actions, Decisions, and Summary'}.`

    const systemPrompt = `You are a professional secretary. Extract key information, action items, and decisions from meeting transcripts.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 1500
    })
}

/**
 * Creative Writing tools
 */

export async function generateCreativeContent(type, topic, details = '', tone = 'creative') {
    const prompts = {
        storyStarter: `Write 3 unique story starters (first paragraphs) for a ${topic} story. ${details ? `Context: ${details}` : ''}`,
        plot: `Generate a compelling plot outline for a ${topic} story. ${details ? `Elements to include: ${details}` : ''}`,
        poem: `Write a ${tone} poem about "${topic}". ${details ? `Style: ${details}` : ''}`,
        lyrics: `Write song lyrics about "${topic}" in the style of ${details || 'modern pop'}.`,
        joke: `Tell me 5 funny jokes about "${topic}".`,
        quote: `Generate 5 inspirational or thought-provoking quotes about "${topic}".`,
        pickupLine: `Generate 5 clever pickup lines about "${topic}".`,
        rapName: `Generate 7 unique rap/hip-hop stage names inspired by "${topic}".`,
        bandName: `Generate 7 creative band names inspired by "${topic}".`,
        username: `Generate 7 creative usernames inspired by "${topic}".`
    }

    // Distribute load across different models based on content type
    const modelsByType = {
        storyStarter: MODELS.primary,      // Maverick - creative
        plot: MODELS.primary,           // Maverick - creative  
        poem: 'llama-3.1-8b-instant',         // 8B - fast
        lyrics: MODELS.primary,             // 70B - versatile
        joke: 'llama-3.1-8b-instant',         // 8B - fast for simple content
        quote: MODELS.primary,              // Scout - analytical
        pickupLine: 'llama-3.1-8b-instant',   // 8B - fast for short content
        rapName: MODELS.primary,          // 8B - names
        bandName: MODELS.primary,         // 8B - names
        username: MODELS.primary          // 8B - names
    }

    const prompt = prompts[type] || `Write something creative about ${topic}.`
    const systemPrompt = `You are a highly creative writer. Write engaging, imaginative, and original content.`
    const selectedModel = modelsByType[type] || MODELS.default

    return await askGroq(prompt, systemPrompt, {
        model: selectedModel,
        temperature: 0.9,
        maxTokens: 1500
    })
}

export async function generateMeetingAgenda(objective, participants = '', duration = '30') {
    const prompt = `Create a professional meeting agenda for: "${objective}"
    
Participants/Context: ${participants || 'Standard team meeting'}
Duration: ${duration} minutes

Include:
1. Goal of the meeting
2. Time-boxed agenda items
3. Required preparation`

    const systemPrompt = `You are a productivity expert. Create efficient, goal-oriented meeting agendas.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 1000
    })
}

export async function generateColorPalette(theme, count = 5) {
    const prompt = `Generate a ${count}-color palette for the theme: "${theme}"
    
Return the colors as a list of hex codes with brief descriptions of why they fit the theme.`

    const systemPrompt = `You are a professional UI/UX designer and color theorist. Create harmonious and modern color palettes.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.8,
        maxTokens: 800
    })
}

/**
 * Educational & Learning Tools Services
 */

export async function generateQuiz(topic, gradeLevel = 'high school', questionCount = 5) {
    const prompt = `Generate a ${questionCount}-question multiple-choice quiz about "${topic}" for a ${gradeLevel} level student.
    
Include correct answers and brief explanations for each question. Format the output clearly with Markdown.`

    const systemPrompt = `You are an expert educator. Create challenging but fair assessment questions that test conceptual understanding.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.6,
        maxTokens: 1500
    })
}

export async function generateFlashcards(subject, difficulty = 'intermediate') {
    const prompt = `Create 10 educational flashcards for the subject: "${subject}" at an ${difficulty} level.
    
Format each card as:
**Front:** [Question/Concept]
**Back:** [Answer/Explanation]

Ensure the information is clear, concise, and accurate.`

    const systemPrompt = `You are a learning specialist. Create effective flashcards that facilitate active recall and spaced repetition.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 1200
    })
}

export async function generateStudyGuide(topic, depth = 'comprehensive') {
    const prompt = `Create a ${depth} study guide for "${topic}".
    
Include:
1. Key Concepts & Definitions
2. Core Theory/Principles
3. Important Dates/Figures (if applicable)
4. Summary or "Big Picture" view
5. 3 self-test questions

Use structured Markdown with clear headings.`

    const systemPrompt = `You are an academic coach. Create organized, easy-to-digest study guides that help students master complex subjects.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 2000
    })
}

export async function generateLessonPlan(subject, gradeLevel = 'middle school', duration = '60') {
    const prompt = `Develop a ${duration}-minute lesson plan for "${subject}" at a ${gradeLevel} level.
    
Include:
- Learning Objectives
- Required Materials
- Introduction (5-10 mins)
- Core Instruction (20-30 mins)
- Guided Practice (15 mins)
- Conclusion/Assessment (5 mins)`

    const systemPrompt = `You are a master teacher. Design engaging, pedagogicaly-sound lesson plans that meet standard learning outcomes.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.6,
        maxTokens: 1500
    })
}

export async function simplifyExplanation(text, targetAudience = 'a 10-year old') {
    const prompt = `Explain the following complex concept/text so that "${targetAudience}" can understand it perfectly:
    
"${text}"

Use analogies, simple language, and break down complex terms.`

    const systemPrompt = `You are an expert communicator who excels at "ELI5" (Explain Like I'm 5) style explanations. Make complex ideas accessible without losing the core truth.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 1000
    })
}

export async function generatePracticeProblems(topic, type = 'math', count = 5) {
    const prompt = `Generate ${count} ${type} practice problems about "${topic}".
    
Provide the problems first, followed by a separate "Step-by-Step Solutions" section at the end.`

    const systemPrompt = `You are a math and science tutor. Create problems ranging from basic to challenging, with clear, logical solutions.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 1500
    })
}

export async function gradeEssay(essayText, level = 'college') {
    const prompt = `Act as an academic grader. Evaluate the following ${level}-level essay:
    
"${essayText}"

Provide:
1. **Grade/Score**: (Estimated)
2. **Strengths**: What worked well.
3. **Weaknesses**: Areas for improvement.
4. **Specific Feedback**: Grammar, structure, and argument analysis.
5. **Revised Snippet**: Rewrite one paragraph to show how it can be improved.`

    const systemPrompt = `You are a professional essay grader and writing mentor. Provide constructive, detailed, and encouraging feedback.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 2000
    })
}

export async function generateCitation(sourceData, style = 'APA') {
    const prompt = `Generate a formal academic citation in ${style} style for the following source information:
    
"${sourceData}"

Provide only the citation and a brief note on the style rules used.`

    const systemPrompt = `You are a research librarian. Provide perfectly formatted citations according to the latest style guides (APA, MLA, Chicago, etc.).`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.2,
        maxTokens: 500
    })
}

export async function generateResearchQuestions(topic, field = 'general') {
    const prompt = `Brainstorm 5 high-quality research questions for a study on "${topic}" within the field of ${field}.
    
For each question, briefly explain why it is a valuable area of inquiry.`

    const systemPrompt = `You are a research director. Generate insightful, "google-proof" research questions that drive deep academic or professional investigation.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.8,
        maxTokens: 1000
    })
}

export async function generateThesisStatement(topic, argumentType = 'analytical') {
    const prompt = `Write 3 different formal thesis statements for an essay about "${topic}".
    
Thesis type: ${argumentType}

Ensure they are arguable, specific, and provide a clear roadmap for an essay.`

    const systemPrompt = `You are a writing clinic expert. Craft strong, academic thesis statements that serve as the backbone of a high-quality essay.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 800
    })
}

export async function generateAnnotatedBibliography(sources) {
    const prompt = `Create an annotated bibliography for these sources:
    
"${sources}"

For each source, provide a formal citation and a 100-word summary/evaluation of its relevance and quality.`

    const systemPrompt = `You are an academic researcher. Create professional annotated bibliographies that summarize and critically evaluate sources.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 2000
    })
}

export async function generateMindMap(topic) {
    const prompt = `Create a structured text-based Mind Map for "${topic}".
    
Format: Use a hierarchical bulleted list where indented bullets represent sub-topics and details.
Use emojis to make it visual and engaging.`

    const systemPrompt = `You are a visual learning expert. Organize information into logical, hierarchical structures that mimic mind maps.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 1200
    })
}

export async function generateMnemonic(concept) {
    const prompt = `Create 3 creative mnemonic devices (acronyms, acrostics, or rhymes) to help remember: "${concept}".
    
Explain how each one works.`

    const systemPrompt = `You are a memory specialist. Create catchy, memorable, and effective mnemonics that make complex information "sticky".`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.9,
        maxTokens: 800
    })
}

export async function languageLearningTutor(level, targetLanguage, goal) {
    const prompt = `Act as a language tutor for a ${level} student learning ${targetLanguage}.
    
Goal: ${goal}

Generate:
1. A short dialogue or 5 essential phrases.
2. Grammar/Pronunciation tips.
3. A small practice exercise.`

    const systemPrompt = `You are a polyglot language tutor. Provide helpful, conversational, and culturally-relevant language learning material.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.7,
        maxTokens: 1500
    })
}

export async function generateAnalogy(concept) {
    const prompt = `Create 3 powerful analogies to explain the concept of "${concept}".
    
For each analogy, explain the "mapping" (how the comparison works).`

    const systemPrompt = `You are a conceptual thinker. Create vivid, relatable analogies that make abstract or difficult ideas immediately clear.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.8,
        maxTokens: 1000
    })
}

/**
 * ============================================
 * KNOWLEDGE & HISTORY AI TOOLS
 * All use structured markdown for purple styling
 * ============================================
 */

/**
 * AI Encyclopedia - Wikipedia-style explanations
 */
export async function generateEncyclopediaEntry(topic, depth = 'comprehensive') {
    const prompt = `Create a comprehensive encyclopedia-style entry about "${topic}".

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 📚 ${topic}

### 📖 Overview
[2-3 paragraph comprehensive introduction]

### 🔑 Key Facts
1. [Important fact with context]
2. [Another key fact]
3. [Third key fact]
4. [Fourth key fact]
5. [Fifth key fact]

### 📊 Key Details
- **Category:** [What type/classification]
- **Origin/Date:** [When it started/occurred]
- **Significance:** [Why it matters]
- **Related Topics:** [Connected subjects]

### 🌟 Notable Aspects
- [Interesting detail or achievement]
- [Another notable aspect]
- [Cultural or historical impact]

### 💡 Did You Know?
[One fascinating lesser-known fact about this topic]

---
*Generated by Plainly AI Encyclopedia*`

    const systemPrompt = `You are a professional encyclopedia writer. Write accurate, educational, and engaging content with proper markdown formatting (## for headers, ### for subheaders, bold **text**, bullet points -, and numbered lists). Always maintain neutrality and cite well-known facts.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 2000
    })
}

/**
 * AI History Explorer - Historical events and eras
 */
export async function exploreHistory(topic, era = '') {
    const prompt = `Provide a detailed historical exploration of "${topic}"${era ? ` during the ${era} era` : ''}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🏛️ ${topic}

### 📅 Historical Context
[When and where this occurred, the broader historical setting]

### ⏳ Timeline of Events
1. **[Year/Period]** - [What happened]
2. **[Year/Period]** - [What happened]
3. **[Year/Period]** - [What happened]
4. **[Year/Period]** - [What happened]
5. **[Year/Period]** - [What happened]

### 👥 Key Figures
- **[Name]** - [Role and contribution]
- **[Name]** - [Role and contribution]
- **[Name]** - [Role and contribution]

### 🔍 Causes & Effects
**Causes:**
- [Primary cause]
- [Secondary cause]

**Effects:**
- [Immediate effect]
- [Long-term impact]

### 🌍 Legacy & Modern Relevance
[How this event/era influences the modern world]

### 📖 Learn More
- [Related topic to explore]
- [Another related topic]

---
*Powered by Plainly AI History Explorer*`

    const systemPrompt = `You are a professional historian. Write accurate, well-researched historical content with proper markdown formatting. Include dates, figures, and context. Maintain academic objectivity while making history engaging and accessible.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 2000
    })
}

/**
 * AI Biography Generator - Famous people biographies
 */
export async function generateBiography(personName, focus = 'comprehensive') {
    const prompt = `Write a comprehensive biography of "${personName}".

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 👤 ${personName}

### 📋 Quick Facts
- **Born:** [Date, Place]
- **Died:** [Date, Place] (or "Present" if alive)
- **Nationality:** [Country]
- **Known For:** [Primary achievement/role]
- **Field:** [Area of work/expertise]

### 🌱 Early Life
[Background, childhood, education, formative experiences - 2 paragraphs]

### ⭐ Rise to Prominence
[How they became famous/successful - their journey]

### 🏆 Major Achievements
1. **[Achievement]** - [Context and impact]
2. **[Achievement]** - [Context and impact]
3. **[Achievement]** - [Context and impact]
4. **[Achievement]** - [Context and impact]

### 💬 Famous Quotes
> "[Notable quote from this person]"

> "[Another memorable quote]"

### 🌍 Legacy & Impact
[Their lasting influence on their field and the world]

### 📚 Recommended Reading
- [Book or resource about them]
- [Documentary or film]

---
*Generated by Plainly AI Biography*`

    const systemPrompt = `You are a professional biographer. Write accurate, engaging biographies with proper markdown formatting. Include verified facts, dates, and achievements. Present a balanced, respectful portrait of the individual.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 2000
    })
}

/**
 * AI Fact Checker - Verify claims
 */
export async function checkFact(claim) {
    const prompt = `Analyze and fact-check this claim: "${claim}"

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🔍 Fact Check Analysis

### 📝 Claim Being Checked
"${claim}"

### ✅ Verdict
**[TRUE / MOSTLY TRUE / PARTIALLY TRUE / MISLEADING / FALSE / UNVERIFIABLE]**

### 📊 Accuracy Rating
[⬛⬛⬛⬛⬛ or ⬛⬛⬛⬜⬜ etc. - visual representation]

### 🔬 Analysis
[Detailed explanation of why the claim is rated this way - 2-3 paragraphs]

### 📚 Supporting Evidence
1. [Evidence point with source + URL]
2. [Another evidence point with source + URL]
3. [Third evidence point with source + URL]

### ⚠️ Important Context
- [Context that affects how the claim should be understood]
- [Any nuances or caveats]

### 🔗 Sources (URLs)
1. [Source title](https://...)
2. [Source title](https://...)
3. [Source title](https://...)

### 💡 The Full Picture
[What people should actually understand about this topic]

---
*Fact-checked by Plainly AI - Always verify important claims with official sources*`

    const systemPrompt = `You are a professional fact-checker using live web research. Verify claims with up-to-date online sources, prioritize authoritative references, and provide direct source URLs. Be balanced, cite reasoning clearly, and acknowledge uncertainty where evidence is mixed. Use proper markdown formatting exactly as requested.`

    return await askGroqWithWebSearch(prompt, systemPrompt, {
        temperature: 0.2,
        maxTokens: 1900
    })
}

/**
 * AI Timeline Generator - Chronological events
 */
export async function generateTimeline(topic, startYear = '', endYear = '') {
    const timeRange = startYear && endYear ? ` from ${startYear} to ${endYear}` : ''
    const prompt = `Create a detailed chronological timeline for "${topic}"${timeRange}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## ⏳ Timeline: ${topic}

### 📅 Chronological Events

---

**🔵 [Year/Date]**
### [Event Title]
[What happened and why it was significant - 1-2 sentences]

---

**🔵 [Year/Date]**
### [Event Title]
[What happened and why it was significant]

---

**🔵 [Year/Date]**
### [Event Title]
[What happened and why it was significant]

---

[Continue with 8-12 key dates/events]

### 🔑 Key Takeaways
- [Major theme or pattern from this timeline]
- [Important observation]
- [What this timeline teaches us]

### 📖 Related Timelines
- [Related topic you could explore]
- [Another connected timeline]

---
*Generated by Plainly AI Timeline*`

    const systemPrompt = `You are a professional historian and timeline creator. Generate accurate, chronologically ordered events with proper markdown formatting. Include specific dates where known, and explain the significance of each event concisely.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.3,
        maxTokens: 2000
    })
}

/**
 * AI Country Guide - Country information
 */
export async function generateCountryGuide(countryName) {
    const prompt = `Create a comprehensive guide about ${countryName}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🌍 ${countryName}

### 🗺️ Quick Facts
- **Capital:** [Capital city]
- **Population:** [Approximate population]
- **Language(s):** [Official languages]
- **Currency:** [Currency name and code]
- **Government:** [Type of government]
- **Continent:** [Continent]

### 📜 Brief History
[2-3 paragraph summary of the country's history]

### 🏛️ Culture & Society
- **Religion:** [Major religions]
- **Traditions:** [Key cultural traditions]
- **Cuisine:** [Famous foods]
- **Festivals:** [Major celebrations]

### 🌟 Famous For
1. [Famous landmark, export, or cultural element]
2. [Another notable thing]
3. [Third famous aspect]
4. [Fourth notable element]

### 🏔️ Geography
[Description of landscape, climate, notable natural features]

### 💰 Economy
[Major industries, economic status, trade]

### 🎯 Interesting Facts
- [Unique or surprising fact]
- [Another interesting fact]
- [Third fascinating detail]

### ✈️ Travel Tips
- **Best Time to Visit:** [Season/months]
- **Must-See Places:** [Top destinations]
- **Local Custom:** [Important etiquette tip]

---
*Powered by Plainly AI Country Guide*`

    const systemPrompt = `You are a travel writer and geographer. Write accurate, informative country guides with proper markdown formatting. Include verified statistics and cultural insights. Be respectful and balanced in cultural descriptions.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 2000
    })
}

/**
 * AI Science Explainer - Scientific concepts
 */
export async function explainScience(concept, level = 'intermediate') {
    const levelGuide = {
        beginner: 'Explain like teaching a curious teenager',
        intermediate: 'Explain for someone with basic science knowledge',
        advanced: 'Explain with technical detail for science enthusiasts'
    }

    const prompt = `Explain the scientific concept "${concept}" at a ${level} level.

${levelGuide[level] || levelGuide.intermediate}

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🔬 ${concept}

### 📖 Simple Explanation
[Clear, accessible explanation in 2-3 paragraphs - use analogies if helpful]

### 🧪 The Science Behind It
- **Key Principle:** [Main scientific principle]
- **How It Works:** [Mechanism or process]
- **Related Concepts:** [Connected scientific ideas]

### 📊 Key Facts & Figures
1. [Important numerical fact or measurement]
2. [Another key fact]
3. [Third important detail]

### 🌍 Real-World Applications
- [Practical application in everyday life]
- [Industrial or technological use]
- [Medical or scientific application]

### 🧑‍🔬 Famous Scientists
- **[Name]** - [Contribution to this field]
- **[Name]** - [Contribution to this field]

### 🤔 Common Misconceptions
- **Myth:** [Common misunderstanding]
- **Reality:** [The actual truth]

### 💡 Fun Fact
[One amazing or surprising fact about this concept]

---
*Explained by Plainly AI Science*`

    const systemPrompt = `You are a science educator and communicator. Explain complex concepts clearly with proper markdown formatting. Use analogies and real-world examples. Be accurate while remaining accessible to the specified audience level.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 2000
    })
}

/**
 * AI Word Origin Finder (Etymology)
 */
export async function findWordOrigin(word) {
    const prompt = `Explore the etymology and history of the word "${word}".

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 📚 Etymology: "${word}"

### 🔤 Word Information
- **Modern Meaning:** [Current definition]
- **Part of Speech:** [Noun, verb, adjective, etc.]
- **Pronunciation:** [How to say it]

### 🌳 Origin & Roots
**Language of Origin:** [e.g., Latin, Greek, Old English]

**Root Words:**
- [Root 1] - meaning "[meaning]"
- [Root 2] - meaning "[meaning]" (if applicable)

### ⏳ Historical Journey
[How the word evolved through history - which languages it passed through, how meanings changed - 2-3 paragraphs]

### 🔗 Related Words
- **[Related word 1]** - [Meaning and connection]
- **[Related word 2]** - [Meaning and connection]
- **[Related word 3]** - [Meaning and connection]

### 💬 Usage Examples
1. [Example sentence showing the word in context]
2. [Another example]

### 💡 Fascinating Fact
[Interesting trivia about this word's history or usage]

---
*Discovered by Plainly AI Etymology*`

    const systemPrompt = `You are a linguist and etymologist. Trace word origins accurately with proper markdown formatting. Include language transitions, root meanings, and historical context. Make etymology interesting and educational.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 1500
    })
}

/**
 * AI Historical Comparison - Compare events/figures/eras
 */
export async function compareHistorical(item1, item2) {
    const prompt = `Compare and contrast "${item1}" and "${item2}" historically.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## ⚖️ Historical Comparison

### 🔵 ${item1}
[Brief overview - 1-2 paragraphs]

### 🟣 ${item2}
[Brief overview - 1-2 paragraphs]

---

### 📊 Side-by-Side Comparison

| Aspect | ${item1} | ${item2} |
|--------|----------|----------|
| **Time Period** | [Period] | [Period] |
| **Location** | [Where] | [Where] |
| **Key Figures** | [Who] | [Who] |
| **Main Cause** | [Why] | [Why] |
| **Outcome** | [What happened] | [What happened] |
| **Impact** | [Lasting effect] | [Lasting effect] |

### 🤝 Similarities
1. [Major similarity]
2. [Another similarity]
3. [Third similarity]

### 🔀 Key Differences
1. [Major difference]
2. [Another difference]
3. [Third difference]

### 💡 Key Insight
[What this comparison teaches us about history or human nature]

---
*Analyzed by Plainly AI Historical Comparison*`

    const systemPrompt = `You are a comparative historian. Analyze historical subjects side-by-side with proper markdown formatting. Be balanced, factual, and draw meaningful insights from the comparison.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 2000
    })
}

/**
 * AI Mythology Guide - Myths and legends
 */
export async function exploreMythology(topic, culture = '') {
    const prompt = `Explore the mythology surrounding "${topic}"${culture ? ` in ${culture} culture` : ''}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🌟 Mythology: ${topic}

### 📜 Origin & Culture
- **Culture/Region:** [Where this myth comes from]
- **Time Period:** [When this myth originated]
- **Type:** [Creation myth, hero tale, legend, etc.]

### 📖 The Story
[Retell the main myth or legend in 3-4 engaging paragraphs]

### 👥 Key Characters
- **[Character Name]** - [Role and description]
- **[Character Name]** - [Role and description]
- **[Character Name]** - [Role and description]

### 🔮 Symbolism & Meaning
- **[Symbol/Element]** represents [meaning]
- **[Symbol/Element]** represents [meaning]
- **[Symbol/Element]** represents [meaning]

### 🌍 Cultural Significance
[Why this myth was important to the culture - moral lessons, explanations of natural phenomena, etc.]

### 🔗 Similar Myths
- **[Related myth]** from [culture] - [similarity]
- **[Related myth]** from [culture] - [similarity]

### 💡 Modern Legacy
[How this myth influences modern culture, media, or language]

---
*Explored by Plainly AI Mythology*`

    const systemPrompt = `You are a mythology scholar and storyteller. Present myths accurately and engagingly with proper markdown formatting. Explain cultural context and symbolism while preserving the wonder of ancient stories.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.6,
        maxTokens: 2000
    })
}

/**
 * AI Cultural Explorer - Traditions and customs
 */
export async function exploreCulture(cultureOrTopic, aspect = 'traditions') {
    const prompt = `Explore the ${aspect} of ${cultureOrTopic}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🌍 Cultural Explorer: ${cultureOrTopic}

### 📋 Overview
[Introduction to this culture and the aspect being explored - 2 paragraphs]

### 🎭 Key ${aspect.charAt(0).toUpperCase() + aspect.slice(1)}
1. **[Tradition/Custom Name]**
   - [Detailed description]
   - [When/why it's practiced]

2. **[Tradition/Custom Name]**
   - [Detailed description]
   - [When/why it's practiced]

3. **[Tradition/Custom Name]**
   - [Detailed description]
   - [When/why it's practiced]

### 🕰️ Historical Roots
[Where these traditions come from - 1-2 paragraphs]

### 🌐 Regional Variations
- [How practices differ in different regions]
- [Interesting variations]

### 🤝 Etiquette Tips
- **Do:** [Respectful behavior]
- **Do:** [Another tip]
- **Avoid:** [What not to do]

### 💡 Interesting Facts
- [Surprising fact about this culture]
- [Another interesting detail]
- [Third fascinating fact]

---
*Discovered by Plainly AI Cultural Explorer*`

    const systemPrompt = `You are a cultural anthropologist. Present cultural information respectfully and accurately with proper markdown formatting. Avoid stereotypes and acknowledge diversity within cultures. Educate while promoting cultural appreciation.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 2000
    })
}

/**
 * AI Famous Quotes Finder
 */
export async function findFamousQuotes(topic, author = '') {
    const prompt = `Find and explain famous quotes about "${topic}"${author ? ` by ${author}` : ''}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 💬 Famous Quotes: ${topic}

### ✨ Quote Collection

---

**Quote 1:**
> "[The quote]"

**— [Author Name]** ([Year/Era], [Context])

📖 **Meaning:** [Explanation of what this quote means and why it's significant]

---

**Quote 2:**
> "[The quote]"

**— [Author Name]** ([Year/Era], [Context])

📖 **Meaning:** [Explanation of what this quote means]

---

**Quote 3:**
> "[The quote]"

**— [Author Name]** ([Year/Era], [Context])

📖 **Meaning:** [Explanation of what this quote means]

---

[Include 5-7 quotes total]

### 🎯 Common Themes
- [Theme that appears across these quotes]
- [Another common theme]

### 💡 Reflection
[A thoughtful observation about what these quotes teach us]

---
*Curated by Plainly AI Quotes*`

    const systemPrompt = `You are a literary scholar and curator of wisdom. Present famous quotes accurately with proper attribution and markdown formatting. Provide insightful explanations of meaning and context. Include well-known, verified quotes.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 2000
    })
}

/**
 * AI Invention History - History of inventions
 */
export async function exploreInvention(invention) {
    const prompt = `Explore the history of the invention "${invention}".

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 💡 Invention History: ${invention}

### 📋 Quick Facts
- **Invented:** [Year]
- **Inventor(s):** [Name(s)]
- **Country:** [Where it was invented]
- **Category:** [Type of invention]

### 🌱 The Problem It Solved
[What need or problem led to this invention - 1 paragraph]

### 🔧 The Invention Story
[How it was invented - the journey, challenges, breakthroughs - 2-3 paragraphs]

### 👤 The Inventor(s)
**[Inventor Name]**
- Background: [Brief bio]
- Other inventions: [Other notable works]
- Fun fact: [Interesting personal detail]

### ⏳ Evolution Timeline
1. **[Year]** - [Original invention/prototype]
2. **[Year]** - [Major improvement]
3. **[Year]** - [Another milestone]
4. **[Year]** - [Modern version]

### 🌍 Impact on Society
- [How it changed daily life]
- [Economic impact]
- [Cultural significance]

### 🔮 Modern Developments
[How the invention has evolved today and future possibilities]

### 💡 Did You Know?
[Surprising fact about this invention]

---
*Researched by Plainly AI Invention History*`

    const systemPrompt = `You are a historian of technology and innovation. Present invention histories accurately with proper markdown formatting. Include the human stories behind inventions and their societal impact.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.4,
        maxTokens: 2000
    })
}

/**
 * AI War & Conflict Summary
 */
export async function summarizeConflict(conflictName) {
    const prompt = `Provide a balanced, educational summary of "${conflictName}".

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## ⚔️ ${conflictName}

### 📋 Quick Facts
- **When:** [Date range]
- **Where:** [Location/region]
- **Parties Involved:** [Who was fighting]
- **Outcome:** [How it ended]
- **Casualties:** [Approximate numbers if known]

### 📜 Background & Causes
[What led to this conflict - historical context - 2 paragraphs]

**Primary Causes:**
1. [Main cause]
2. [Second cause]
3. [Third cause]

### ⏳ Key Events
1. **[Date]** - [Event and significance]
2. **[Date]** - [Event and significance]
3. **[Date]** - [Event and significance]
4. **[Date]** - [Event and significance]
5. **[Date]** - [Event and significance]

### 👥 Key Figures
- **[Name]** - [Role and actions]
- **[Name]** - [Role and actions]
- **[Name]** - [Role and actions]

### 📊 Outcome & Consequences
**Immediate Effects:**
- [Immediate consequence]
- [Another immediate effect]

**Long-term Impact:**
- [Lasting change]
- [Ongoing influence]

### 🕊️ Lessons & Legacy
[What this conflict teaches us - presented respectfully and educationally]

### 📚 Further Reading
- [Recommended resource for learning more]
- [Documentary or book suggestion]

---
*Educational summary by Plainly AI - War affects real people. This is presented for historical education only.*`

    const systemPrompt = `You are a military historian. Present conflict information factually, balanced, and respectfully with proper markdown formatting. Acknowledge the human cost of war. Avoid glorification and maintain educational objectivity. Present multiple perspectives where relevant.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.3,
        maxTokens: 2000
    })
}

/**
 * AI Philosophy Explainer
 */
export async function explainPhilosophy(concept, philosopher = '') {
    const prompt = `Explain the philosophical concept "${concept}"${philosopher ? ` as understood by ${philosopher}` : ''}.

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

## 🧠 Philosophy: ${concept}

### 📖 Simple Explanation
[Explain this concept in clear, accessible terms - 2 paragraphs]

### 🎓 Academic Definition
**Formal Definition:** [Technical philosophical definition]

**Branch of Philosophy:** [Ethics, Metaphysics, Epistemology, etc.]

### 👤 Key Philosophers
- **[Philosopher Name]** ([Era])
  - View: [Their perspective on this concept]
  
- **[Philosopher Name]** ([Era])
  - View: [Their perspective on this concept]

### 💭 Schools of Thought
1. **[School/Tradition]** - [How they approach this concept]
2. **[School/Tradition]** - [Alternative view]
3. **[School/Tradition]** - [Another perspective]

### 🔍 Practical Application
[How this philosophical concept applies to everyday life - real examples]

### 🤔 Key Questions
- [A thought-provoking question this concept raises]
- [Another philosophical question to consider]

### 📚 Essential Readings
- **[Book/Work Title]** by [Author] - [Why it's relevant]
- **[Book/Work Title]** by [Author] - [Why it's relevant]

### 💡 Thought Experiment
[A famous thought experiment related to this concept, or create one to illustrate it]

---
*Explored by Plainly AI Philosophy*`

    const systemPrompt = `You are a philosophy professor. Explain philosophical concepts clearly with proper markdown formatting. Make philosophy accessible without oversimplifying. Present multiple viewpoints fairly and encourage critical thinking.`

    return await askGroq(prompt, systemPrompt, {
        model: MODELS.primary,
        temperature: 0.5,
        maxTokens: 2000
    })
}

