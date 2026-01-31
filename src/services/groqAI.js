// Groq AI Service for Plainly
// Using DIFFERENT MODELS per function to distribute rate limits

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Model assignments - spread load across different models
// Each model has 14,400 req/day limit so using multiple = more capacity
const MODELS = {
    // Creative tasks - Maverick is good for creative writing
    babyNames: 'meta-llama/llama-4-maverick-17b-128e-instruct',
    businessNames: 'meta-llama/llama-4-maverick-17b-128e-instruct',

    // Summarization - Scout is good for analysis
    summarize: 'meta-llama/llama-4-scout-17b-16e-instruct',

    // Paragraph generation - Fast instant model
    paragraph: 'llama-3.1-8b-instant',

    // Translation - Main versatile model
    translate: 'llama-3.3-70b-versatile',

    // Text improvement - Compound for complex tasks
    improve: 'groq/compound-mini',

    // Random names - Fast model
    randomNames: 'llama-3.1-8b-instant',

    // Default fallback
    default: 'llama-3.3-70b-versatile'
}

/**
 * Send a prompt to Groq AI and get a response
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

    try {
        const messages = []

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt })
        }

        messages.push({ role: 'user', content: prompt })

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                messages,
                max_tokens: maxTokens,
                temperature
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error?.message || 'Groq API error')
        }

        const data = await response.json()
        return data.choices[0]?.message?.content || ''
    } catch (error) {
        console.error('Groq AI Error:', error)
        throw error
    }
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
            model: MODELS.babyNames,
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
            model: MODELS.businessNames,
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
        model: MODELS.summarize,
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
        model: MODELS.paragraph,
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
        model: MODELS.translate,
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
        model: MODELS.improve,
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
            model: MODELS.randomNames,
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

// Export MODELS (functions are already exported inline)
export { MODELS }
