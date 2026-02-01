/**
 * Pollinations.AI Image Generation Service
 * Uses Authorization header for API key authentication
 * sk_ keys = No rate limits (server-side)
 */

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY

/**
 * Generate an image using Pollinations.AI
 * Uses fetch with Authorization header for authenticated requests
 */
export async function generateImage(prompt, options = {}) {
    const {
        width = 1024,
        height = 1024,
        model = 'flux',  // Best quality model
        seed = Math.floor(Math.random() * 1000000)
    } = options

    // Build the image URL
    const encodedPrompt = encodeURIComponent(prompt)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`

    // If we have an API key, fetch with Authorization header
    if (POLLINATIONS_API_KEY) {
        try {
            const response = await fetch(imageUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${POLLINATIONS_API_KEY}`
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            // Convert response to blob then to data URL for display
            const blob = await response.blob()
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(blob)
            })
        } catch (error) {
            console.warn('Authenticated fetch failed:', error.message)
            // Fallback to direct URL (may hit rate limits)
            return imageUrl
        }
    }

    // No API key - return direct URL (may hit rate limits)
    return imageUrl
}

/**
 * Check if API key is configured
 */
export function isConfigured() {
    return true
}

/**
 * Check if API key exists (for UI display)
 */
export function hasApiKey() {
    return !!POLLINATIONS_API_KEY
}

export default {
    generateImage,
    isConfigured,
    hasApiKey
}
