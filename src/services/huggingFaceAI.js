/**
 * Pollinations.AI Image Generation Service
 * Free & unlimited image generation with optional API key for priority
 */

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY

/**
 * Generate an image using Pollinations.AI
 * @param {string} prompt - The text prompt for image generation
 * @param {object} options - Generation options
 * @returns {Promise<string>} - URL of the generated image
 */
export async function generateImage(prompt, options = {}) {
    const {
        width = 1024,
        height = 1024,
        model = 'flux',  // Best quality model
        seed = Math.floor(Math.random() * 1000000)
    } = options

    const encodedPrompt = encodeURIComponent(prompt)

    // Build URL with parameters
    let url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`

    // Add API key if available (removes rate limits)
    if (POLLINATIONS_API_KEY) {
        url += `&token=${POLLINATIONS_API_KEY}`
    }

    return url
}

/**
 * Check if API key is configured (with key = no rate limits)
 */
export function isConfigured() {
    return true  // Always works, API key just removes rate limits
}

/**
 * Check if using API key (priority access)
 */
export function hasApiKey() {
    return !!POLLINATIONS_API_KEY
}

export default {
    generateImage,
    isConfigured,
    hasApiKey
}
