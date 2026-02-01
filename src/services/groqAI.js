// Groq AI Service for Plainly
// PRIORITIZE high-limit models for maximum daily capacity!

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Model rate limits (from Groq console):
// llama-3.1-8b-instant:     14,400 req/day  ← PRIMARY
// allam-2-7b:                7,000 req/day  ← SECONDARY (for variety)
// llama-3.3-70b-versatile:   1,000 req/day  ← Premium quality
// Llama 4 Scout/Maverick:    1,000 req/day  ← Premium creative
// groq/compound-mini:          250 req/day  ← Complex tasks only

const MODELS = {
    // HIGH LIMIT - Use these for most tasks (21.4K combined/day!)
    primary: 'llama-3.1-8b-instant',      // 14.4K/day - MAIN model
    secondary: 'allam-2-7b',               // 7K/day - ALTERNATE model

    // MEDIUM LIMIT - Use when needed (1K/day each)
    creative: 'meta-llama/llama-4-maverick-17b-128e-instruct',
    analytical: 'meta-llama/llama-4-scout-17b-16e-instruct',
    versatile: 'llama-3.3-70b-versatile',

    // LOW LIMIT - Use sparingly (250/day)
    complex: 'groq/compound-mini',

    // Default = primary (highest limit)
    default: 'llama-3.1-8b-instant'
}

// Fallback chain: if one model hits limit, try the next
const FALLBACK_CHAIN = [
    MODELS.primary,    // 14.4K/day - llama-3.1-8b-instant
    MODELS.secondary,  // 7K/day - allam-2-7b
    'moonshotai/kimi-k2-instruct',  // 1K/day - Kimi K2
    MODELS.versatile,  // 1K/day - llama-3.3-70b-versatile
    MODELS.analytical, // 1K/day - Scout
    MODELS.creative,   // 1K/day - Maverick
]
// Total capacity: ~26,400 requests/day

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

    const messages = []
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt })
    }
    messages.push({ role: 'user', content: prompt })

    // Build fallback chain starting with requested model
    const modelsToTry = [model, ...FALLBACK_CHAIN.filter(m => m !== model)]

    for (const tryModel of modelsToTry) {
        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: tryModel,
                    messages,
                    max_tokens: maxTokens,
                    temperature
                })
            })

            if (!response.ok) {
                const error = await response.json()
                const errorMsg = error.error?.message || ''

                // If rate limited, try next model in chain
                if (response.status === 429 || errorMsg.includes('rate') || errorMsg.includes('limit')) {
                    console.warn(`Rate limited on ${tryModel}, trying fallback...`)
                    continue
                }
                throw new Error(errorMsg || 'Groq API error')
            }

            const data = await response.json()
            return data.choices[0]?.message?.content || ''
        } catch (error) {
            // If it's our last model, throw the error
            if (tryModel === modelsToTry[modelsToTry.length - 1]) {
                console.error('All models exhausted:', error)
                throw error
            }
            // Otherwise continue to next model
            console.warn(`Error with ${tryModel}:`, error.message)
        }
    }

    throw new Error('All AI models are currently unavailable. Please try again later.')
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

The email should include:
1. A catchy or appropriate Subject line
2. A proper greeting
3. The main body
4. A professional closing/signature block placeholder

Return the subject and the body clearly separated.`

    const systemPrompt = `You are a professional communication expert. Write emails that are ${tone}, effective, and impactful. Ensure there is a clear Subject line at the beginning.`

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

// Export MODELS (functions are already exported inline)
export { MODELS }
